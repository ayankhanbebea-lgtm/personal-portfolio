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

PORTFOLIO PROJECTS:
1. KRISHIDHENU:
   - What it is: Digital procurement platform for farmers featuring slot booking, OTP login, and a live queue.
   - Technologies: Next.js, Server-Sent Events (SSE).
   - GitHub: https://github.com/ayankhanbebea-lgtm/indian-farmer-Procurement

2. PDFAI Hub:
   - What it is: All-in-one AI PDF platform featuring PDF editing tools, AI document analysis, and Next.js 15.
   - Technologies: Next.js 15, SaaS, AI.
   - GitHub: https://github.com/ayankhanbebea-lgtm/PDFAIHUB
   - Live Demo: https://pdfaihub.vercel.app

3. Interactive Quiz Application (Lecture 10):
   - What it is: Responsive quiz web application testing computer science and AI concepts with dynamic questions, instant feedback, and score tracking.
   - Technologies: HTML, CSS, JavaScript.
   - GitHub: https://github.com/ayankhanbebea-lgtm/interactive-quiz-application
   - Live Demo: https://ayankhanbebea-lgtm.github.io/interactive-quiz-application/

4. Book Reading List Application (Lecture 11):
   - What it is: Reading tracker application with book entry creation, reading status toggles, and localStorage persistence.
   - Technologies: HTML, CSS, JavaScript, LocalStorage.
   - GitHub: https://github.com/ayankhanbebea-lgtm/book-reading-list-application
   - Live Demo: https://ayankhanbebea-lgtm.github.io/book-reading-list-application/

5. Python Programs Collection (Lecture 4):
   - What it is: Core Python programs covering factorial calculation, Fibonacci series generator, and C structure-to-Python dictionary data mapping.
   - Technologies: Python, C, Google Colab.
   - GitHub: https://github.com/ayankhanbebea-lgtm/python-basics-rollno

6. Messy Python Code Improvement:
   - What it is: Refactoring student grade/attendance calculator into clean, modular, tested PEP 8 Python with unit tests using AI assistance.
   - Technologies: Python, AI Tools, Unit Testing.
   - GitHub: https://github.com/ayankhanbebea-lgtm/messy-python-code-improvement

7. Bug Fixing Using Cursor AI (CW02):
   - What it is: Debugging 3 runtime bugs in array average algorithm using Cursor AI 3-step chain prompting.
   - Technologies: C, Python, Cursor AI.
   - GitHub: https://github.com/ayankhanbebea-lgtm/bug-fixing-using-cursor-ai

8. ArriveAI:
   - What it is: SaaS prototype that sends AI-powered notifications when a delivery is about to arrive.
   - Technologies: Next.js, AI.

9. Traffic Escape:
   - What it is: Mobile puzzle game where you clear the road to free your car.
   - Technologies: HTML5, Canvas.

STRICT RESPONSE RULES:
- Keep answers concise, natural, and helpful (typically under 70 words unless the user requests a detailed explanation).
- When asked about GitHub or where to find GitHub, always provide the exact URL: https://github.com/ayankhanbebea-lgtm (username: ayankhanbebea-lgtm).
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
