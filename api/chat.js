/**
 * Vercel Serverless Function: /api/chat
 * Secure server-side gateway to Groq API.
 * Keeps GROQ_API_KEY secure in server environment variables.
 */

const SYSTEM_PROMPT = `
You are the personal AI Assistant for Ayan Khan's college portfolio website.
Answer questions accurately based ONLY on the authentic student information provided below.
Do not invent any facts, professional experience, companies, internships, awards, or certifications.
Do not describe Ayan as an expert or industry veteran; he is a dedicated 2nd-year undergraduate student.

STUDENT PROFILE:
- Full Name: Ayan Khan
- College: JECRC University, Jaipur, Rajasthan
- Degree: B.Tech in Computer Science and Engineering (CSE Core)
- Current Year: 2nd Year
- Expected Graduation: 2029
- Email: ayankhanbebea@gmail.com
- GitHub: https://github.com/ayankhanbebea-lgtm
- Bio: Ayan is a 2nd-year Computer Science Engineering student at JECRC University. He is interested in software development, web development, Python, AI/ML, and building practical projects. He is currently improving his programming and development skills by working on different projects and learning new technologies.

TECHNICAL SKILLS:
- HTML
- CSS
- JavaScript
- Python
- C
- C++
- Git
- GitHub
- Web Development
- AI Tools

FEATURED PORTFOLIO PROJECTS:
1. KRISHIDHENU:
   - What it is: Digital procurement platform for farmers featuring slot booking, OTP login, and a live queue.
   - Technologies: Next.js, Server-Sent Events (SSE).
   - GitHub: https://github.com/ayankhanbebea-lgtm/indian-farmer-Procurement

2. ArriveAI:
   - What it is: SaaS prototype that sends AI-powered notifications when a delivery is about to arrive.
   - Technologies: Next.js, AI.

3. PDFAI Hub:
   - What it is: PDF processing and AI features in one place.
   - Technologies: Next.js 15, SaaS.
   - GitHub: https://github.com/ayankhanbebea-lgtm/PDFAIHUB
   - Live Demo: https://pdfaihub.vercel.app

4. Traffic Escape:
   - What it is: Mobile puzzle game where you clear the road to free your car.
   - Technologies: HTML5, Canvas.

ADDITIONAL COURSEWORK REPOSITORIES:
- Python Programs Collection (Lecture 4): Factorial, Fibonacci, Structure-to-Dictionary (https://github.com/ayankhanbebea-lgtm/python-basics-rollno)
- Messy Python Code Improvement: Refactoring student records with PEP 8 and unit tests (https://github.com/ayankhanbebea-lgtm/messy-python-code-improvement)
- Bug Fixing Using Cursor AI: Array average debugging with 3-step chain prompting (https://github.com/ayankhanbebea-lgtm/bug-fixing-using-cursor-ai)
- Interactive Quiz Application (Lecture 10): https://github.com/ayankhanbebea-lgtm/interactive-quiz-application
- Book Reading List Application (Lecture 11): https://github.com/ayankhanbebea-lgtm/book-reading-list-application

STRICT RESPONSE RULES:
- Keep answers concise, natural, and helpful (typically under 70 words unless the user requests a detailed explanation).
- When asked "Where can I find your GitHub?", provide https://github.com/ayankhanbebea-lgtm.
- If asked unrelated questions (e.g., cooking, politics, pop culture, or unrelated programming tasks), politely state: "I am Ayan Khan's academic portfolio assistant, designed specifically to answer questions about his educational background, skills, and course projects."
`;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "GROQ_API_KEY environment variable is not configured on the server."
    });
  }

  const { message, history } = req.body || {};
  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message string is required." });
  }

  // Construct prompt messages
  const messages = [
    { role: "system", content: SYSTEM_PROMPT }
  ];

  if (Array.isArray(history)) {
    const recent = history.slice(-4);
    for (const h of recent) {
      if (h.role && h.content) {
        messages.push({ role: h.role, content: h.content });
      }
    }
  }

  messages.push({ role: "user", content: message.trim() });

  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: messages,
        temperature: 0.5,
        max_tokens: 300
      })
    });

    if (groqResponse.status === 429) {
      return res.status(429).json({ error: "Too many requests. Please wait a moment before trying again." });
    }

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error("Groq upstream error:", groqResponse.status, errText);
      return res.status(502).json({ error: "AI service temporarily unavailable. Please try again." });
    }

    const data = await groqResponse.json();
    const answer = data.choices?.[0]?.message?.content;

    if (!answer) {
      return res.status(502).json({ error: "Empty response received from AI service." });
    }

    return res.status(200).json({ answer: answer.trim() });
  } catch (error) {
    console.error("Serverless chat error:", error);
    return res.status(500).json({ error: "Internal error communicating with AI service." });
  }
}
