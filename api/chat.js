/**
 * Vercel Serverless Function: /api/chat
 * Secure server-side gateway to Groq API.
 * Keeps GROQ_API_KEY secure in Vercel environment variables.
 */

const SYSTEM_PROMPT = `
You are the AI Assistant for Ayan Khan's personal developer portfolio website.
Answer questions accurately based ONLY on the following authentic student information. Do not invent facts.

STUDENT PROFILE:
- Full Name: Ayan Khan
- College: JECRC University, Jaipur, Rajasthan
- Degree: B.Tech in Computer Science and Engineering (CSE Core), 2nd Year
- Expected Graduation: 2029
- Personal Bio: Computer Science Engineering student interested in software development, web development, Python, AI/ML, and building practical projects. Enjoys learning new technologies and improving skills through practical projects. (Note: Ayan is a dedicated 2nd-year student, not an industry veteran).
- Skills: Python, C, C++, JavaScript (ES6+), HTML5, CSS3, DOM manipulation, LocalStorage, Git, GitHub, Cursor AI, Vercel, Prompt Engineering.
- GitHub: https://github.com/ayankhanbebea-lgtm
- Email: ayankhanbebea@gmail.com

THE FIVE COURSEWORK PROJECTS:
1. Python Programs Collection:
   - Covers: Factorial calculation, Fibonacci series generator, and C Structure-to-Python Dictionary conversion.
   - Developed in Google Colab (Lecture 4). Includes an audited README fact-check table.
   - GitHub: https://github.com/ayankhanbebea-lgtm/python-basics-rollno

2. Messy Python Code Improvement:
   - Case study refactoring an intentionally messy student grade and attendance calculator script.
   - Fixed issues: cryptic variable names (s1_m, t1, a1), code duplication, lack of modular functions, unhandled division by zero, and lack of type hints.
   - Improvements made: Modular functions, type hints, PEP 8 compliance, and automated verification tests.
   - GitHub: https://github.com/ayankhanbebea-lgtm/messy-python-code-improvement

3. Bug Fixing Using Cursor AI:
   - Analysis of software bug identification comparing a naive single prompt against a 3-step chain prompting workflow in Cursor AI.
   - Identified 3 runtime bugs in an array average algorithm: uninitialized accumulator variable, off-by-one buffer overflow, and integer division truncation.
   - GitHub: https://github.com/ayankhanbebea-lgtm/bug-fixing-using-cursor-ai

4. Interactive Quiz Application:
   - Interactive web quiz developed in Lecture 10 testing Large Language Models, conventional Git commits, unit testing, and time complexity.
   - Built with HTML5, CSS3, and JavaScript with instant feedback and score calculation.
   - GitHub: https://github.com/ayankhanbebea-lgtm/interactive-quiz-application
   - Live Demo: https://ayankhanbebea-lgtm.github.io/interactive-quiz-application/

5. Book Reading List Application:
   - Reading tracker developed in Lecture 11 with book title/author inputs, reading status lifecycle (Want to Read, Currently Reading, Completed), live dynamic search, status filtering, and LocalStorage persistence.
   - GitHub: https://github.com/ayankhanbebea-lgtm/book-reading-list-application
   - Live Demo: https://ayankhanbebea-lgtm.github.io/book-reading-list-application/

GUIDELINES:
- Keep answers friendly, concise (under 80 words unless a detailed explanation is requested), and professional.
- Refer visitors to Ayan's actual project cards or GitHub links when relevant.
`;

export default async function handler(req, res) {
  // Set CORS headers
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

  // Construct message array
  const messages = [
    { role: "system", content: SYSTEM_PROMPT }
  ];

  if (Array.isArray(history)) {
    // Include last 4 turns for conversational context
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
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.6,
        max_tokens: 300
      })
    });

    if (groqResponse.status === 429) {
      return res.status(429).json({ error: "Rate limit reached. Please wait a moment before trying again." });
    }

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error("Groq upstream error:", groqResponse.status, errText);
      return res.status(502).json({ error: "AI service temporarily unavailable. Please try again." });
    }

    const data = await groqResponse.json();
    const answer = data.choices?.[0]?.message?.content;

    if (!answer) {
      return res.status(502).json({ error: "Empty response from AI service." });
    }

    return res.status(200).json({ answer: answer.trim() });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({ error: "Internal server error connecting to AI service." });
  }
}
