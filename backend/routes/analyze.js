import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { GoogleGenAI } from '@google/genai';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'), false);
  }
});

const JOB_ROLE_SKILLS = {
  'Frontend Developer': ['React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'Next.js', 'Webpack', 'Jest', 'Redux', 'GraphQL', 'REST API', 'Responsive Design'],
  'Backend Developer': ['Node.js', 'Python', 'Java', 'Express', 'Django', 'FastAPI', 'Spring Boot', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'REST API', 'GraphQL', 'Docker', 'Microservices'],
  'Full Stack Developer': ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB', 'Docker', 'REST API', 'GraphQL', 'Next.js', 'Express', 'Redis', 'AWS', 'CI/CD', 'Git', 'Linux'],
  'Software Engineer': ['Data Structures', 'Algorithms', 'System Design', 'OOP', 'Design Patterns', 'Git', 'Docker', 'Testing', 'CI/CD', 'Agile', 'Code Review', 'Problem Solving'],
  'Data Analyst': ['Python', 'SQL', 'Excel', 'Tableau', 'Power BI', 'Statistics', 'Pandas', 'NumPy', 'Data Visualization', 'R', 'Machine Learning', 'ETL', 'BigQuery', 'Spark'],
  'Data Scientist': ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Statistics', 'SQL', 'Pandas', 'NumPy', 'Data Visualization', 'NLP', 'Feature Engineering', 'A/B Testing'],
  'AI/ML Engineer': ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'NLP', 'Computer Vision', 'MLOps', 'Kubernetes', 'Docker', 'AWS SageMaker', 'Model Deployment', 'CUDA', 'LangChain', 'Hugging Face'],
  'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'Ansible', 'Jenkins', 'CI/CD', 'Linux', 'Bash', 'Monitoring', 'Prometheus', 'Grafana', 'Git'],
  'Cloud Engineer': ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes', 'Docker', 'Serverless', 'Networking', 'Security', 'IAM', 'CloudFormation', 'Load Balancing', 'CDN', 'Cost Optimization']
};

// ─── Strip HTML tags and clean scraped text ───────────────────────────────────
function stripHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// ─── Scrape JD text from URL ─────────────────────────────────────────────────
async function scrapeJD(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    timeout: 15000
  });

  if (!response.ok) throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);

  const html = await response.text();
  const text = stripHtml(html);

  if (text.length < 100) throw new Error('Could not extract meaningful content from the URL.');

  // Return up to 6000 chars — enough for any JD
  return text.substring(0, 6000);
}

// ─── Role-based match (existing logic) ───────────────────────────────────────
function calculateRoleMatch(skills, jobRole) {
  const roleSkills = JOB_ROLE_SKILLS[jobRole] || [];
  const allExtractedSkills = Object.values(skills).flat().map(s => s.toLowerCase());

  const matched = roleSkills.filter(skill =>
    allExtractedSkills.some(e => e.includes(skill.toLowerCase()) || skill.toLowerCase().includes(e))
  );
  const missing = roleSkills.filter(skill =>
    !allExtractedSkills.some(e => e.includes(skill.toLowerCase()) || skill.toLowerCase().includes(e))
  );

  return {
    matchPercentage: Math.round((matched.length / roleSkills.length) * 100),
    missingSkills: missing,
    matchedSkills: matched,
    totalRequired: roleSkills.length
  };
}

// ─── Endpoint: scrape & preview a JD URL ─────────────────────────────────────
router.post('/scrape-jd', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    // Basic URL validation
    new URL(url); // throws if invalid

    const jdText = await scrapeJD(url);
    res.json({ success: true, jdText, length: jdText.length });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to scrape job description' });
  }
});

// ─── Main analyze endpoint ────────────────────────────────────────────────────
router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });

    const jobRole    = req.body.jobRole  || 'Software Engineer';
    const jdUrl      = req.body.jdUrl    || '';     // optional JD URL
    const jdText     = req.body.jdText   || '';     // optional pre-scraped JD text

    // ── Parse PDF ──────────────────────────────────────────────────────────
    let resumeText = '';
    try {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    } catch {
      return res.status(400).json({ error: 'Failed to parse PDF. Please ensure it is a valid, text-based PDF.' });
    }

    if (!resumeText || resumeText.trim().length < 50)
      return res.status(400).json({ error: 'Could not extract sufficient text from PDF. Try a text-based PDF.' });

    // ── Optionally scrape JD ───────────────────────────────────────────────
    let resolvedJdText = jdText;
    let resolvedJdUrl  = jdUrl;
    if (jdUrl && !jdText) {
      try {
        resolvedJdText = await scrapeJD(jdUrl);
      } catch (scrapeErr) {
        return res.status(400).json({ error: `JD scraping failed: ${scrapeErr.message}` });
      }
    }

    const hasJD = resolvedJdText && resolvedJdText.trim().length > 50;

    // ── Build AI prompt ────────────────────────────────────────────────────
    const jdSection = hasJD
      ? `\nJob Description (from ${resolvedJdUrl || 'pasted text'}):\n"""\n${resolvedJdText.substring(0, 4000)}\n"""`
      : `\nTarget Job Role: ${jobRole}`;

    const jdMatchInstruction = hasJD
      ? `Also perform a deep JD match:
  - Extract all required skills, qualifications, experience, and keywords from the JD
  - Compare them against the resume
  - Return "jdMatch" object in the JSON`
      : '';

    const jdMatchJson = hasJD
      ? `"jdMatch": {
    "matchPercentage": <0-100 integer based on how well resume matches the JD>,
    "matchedKeywords": ["<keyword matched in both>"],
    "missingKeywords": ["<required in JD but absent in resume>"],
    "jdTitle": "<job title extracted from JD or 'Job Description'>",
    "jdCompany": "<company name from JD or ''>",
    "experienceRequired": "<e.g. 3-5 years or ''>",
    "educationRequired": "<e.g. B.Tech CS or ''>",
    "keyResponsibilities": ["<top 3-4 responsibilities from JD>"]
  },`
      : '"jdMatch": null,';

    const prompt = `You are an expert ATS resume analyzer. Analyze the resume below and return ONLY a JSON object (no markdown, no extra text).

Resume:
"""
${resumeText.substring(0, 6000)}
"""
${jdSection}

${jdMatchInstruction}

Return exactly this JSON:
{
  "atsScore": <0-100>,
  "summary": "<2-3 sentence professional summary>",
  "strengths": ["<strength>", "<strength>", "<strength>", "<strength>", "<strength>"],
  "weaknesses": ["<weakness>", "<weakness>", "<weakness>"],
  "skills": {
    "languages": [],
    "frameworks": [],
    "databases": [],
    "cloud": [],
    "tools": [],
    "softSkills": []
  },
  ${jdMatchJson}
  "recommendations": ["<rec1>","<rec2>","<rec3>","<rec4>","<rec5>"]
}

ATS scoring: 90-100 excellent, 75-89 good, 60-74 average, <60 needs work.
Extract ALL skills from the resume. Be specific and thorough.`;

    // ── Call Gemini ────────────────────────────────────────────────────────
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const responseText = result.text;

    let aiAnalysis;
    try {
      aiAnalysis = JSON.parse(responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch {
      const m = responseText.match(/\{[\s\S]*\}/);
      if (m) aiAnalysis = JSON.parse(m[0]);
      else throw new Error('Failed to parse AI response as JSON');
    }

    // ── Role-based match (always calculated) ──────────────────────────────
    const roleMatch = calculateRoleMatch(aiAnalysis.skills || {}, jobRole);

    const finalResponse = {
      ...aiAnalysis,
      // role-based fields
      missingSkills:   roleMatch.missingSkills,
      jobMatch: {
        role:           jobRole,
        matchPercentage: roleMatch.matchPercentage,
        matchedSkills:  roleMatch.matchedSkills,
        totalRequired:  roleMatch.totalRequired
      },
      // JD-based fields (null if no JD provided)
      jdMatch: aiAnalysis.jdMatch || null,
      jdUrl:   resolvedJdUrl || null,
      // meta
      fileName:    req.file.originalname,
      fileSize:    req.file.size,
      analyzedAt:  new Date().toISOString()
    };

    res.json({ success: true, data: finalResponse });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze resume' });
  }
});

export default router;