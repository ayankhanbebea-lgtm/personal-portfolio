/**
 * Ayan Khan - AI Chatbot Client
 * Communicates with /api/chat (Vercel Serverless Function).
 * Contains fallback answers for offline / static previews.
 */

document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.getElementById("chatMessages");
  const userInput = document.getElementById("userInput");
  const sendButton = document.getElementById("sendButton");
  const chatStatus = document.getElementById("chatStatus");
  const clearChatBtn = document.getElementById("clearChatBtn");
  const suggestions = document.querySelectorAll(".sugg-chip");

  const conversationHistory = [];

  function appendMessage(role, text) {
    const bubble = document.createElement("div");
    bubble.className = `chat-message ${role === "user" ? "chat-user" : "chat-assistant"}`;
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Authentic fallback response generator for static or offline previews
  function getLocalFallback(query) {
    const q = query.toLowerCase().trim();

    if (q.includes("who are you") || q.includes("introduce") || q.includes("about you")) {
      return "I'm Ayan Khan's AI portfolio assistant. Ayan is a 2nd-year B.Tech CSE (Core) student at JECRC University, Jaipur, focused on software engineering, web development, Python, and practical AI tools.";
    }
    if (q.includes("where do you study") || q.includes("college") || q.includes("university") || q.includes("education")) {
      return "Ayan studies at JECRC University in Jaipur, pursuing his B.Tech in Computer Science and Engineering (CSE Core), currently in his 2nd year with an expected graduation in 2029.";
    }
    if (q.includes("skill") || q.includes("technologies") || q.includes("stack")) {
      return "Ayan's skills include HTML, CSS, JavaScript, Python, C, C++, Git, GitHub, Web Development, and AI Tools.";
    }
    if (q.includes("what projects") || q.includes("completed") || q.includes("list projects") || q.includes("all projects")) {
      return "Ayan's portfolio showcases 9 projects: KRISHIDHENU, PDFAI Hub, Interactive Quiz Application, Book Reading List Application, Python Programs Collection, Messy Python Code Improvement, Bug Fixing Using Cursor AI, ArriveAI, and Traffic Escape.";
    }
    if (q.includes("krishidhenu") || q.includes("farmer") || q.includes("procurement")) {
      return "KRISHIDHENU is a digital procurement platform for farmers featuring slot booking, OTP authentication, and a real-time live queue built with Next.js and Server-Sent Events (SSE). Repository: https://github.com/ayankhanbebea-lgtm/indian-farmer-Procurement";
    }
    if (q.includes("arrive") || q.includes("arriveai")) {
      return "ArriveAI is a SaaS prototype developed with Next.js and AI integrations that dispatches smart automated notifications when an order delivery is approaching.";
    }
    if (q.includes("pdf") || q.includes("pdfai")) {
      return "PDFAI Hub is an all-in-one PDF processing and AI suite built using Next.js 15. Check out the live demo at https://pdfaihub.vercel.app or view code at https://github.com/ayankhanbebea-lgtm/PDFAIHUB";
    }
    if (q.includes("traffic") || q.includes("escape") || q.includes("game")) {
      return "Traffic Escape is an engaging mobile-responsive puzzle game built with HTML5 and Canvas where players clear road congestion to navigate their car to safety.";
    }
    if (q.includes("python program") || q.includes("factorial") || q.includes("fibonacci") || q.includes("dictionary conversion")) {
      return "The Python Programs Collection (Lecture 4) demonstrates foundational C-to-Python algorithm conversion: computing factorials, generating Fibonacci numbers, and mapping C structures to Python dictionaries, complete with an audited fact-check table in the repository.";
    }
    if (q.includes("messy") || q.includes("refactor") || q.includes("clean code")) {
      return "The Messy Python Code Improvement project refactored a monolithic student grade and attendance calculator with cryptic variable names and repeated loops into a modular, PEP 8-compliant program with type hints and automated unit tests.";
    }
    if (q.includes("bug") || q.includes("cursor") || q.includes("corrected") || q.includes("cw02")) {
      return "In the Bug Fixing project, Ayan used Cursor AI with a 3-step chain prompting approach to fix 3 runtime bugs in an array average algorithm: uninitialized sum accumulator, off-by-one buffer overflow (i <= n), and integer division truncation.";
    }
    if (q.includes("quiz") || q.includes("lecture 10")) {
      return "The Interactive Quiz Application (Lecture 10) is a responsive browser quiz evaluating LLM next-token prediction, conventional Git commit messages, unit testing, and algorithmic complexity, featuring instant visual feedback and score calculation.";
    }
    if (q.includes("reading list") || q.includes("book") || q.includes("lecture 11")) {
      return "The Book Reading List Application (Lecture 11) is a responsive reading tracker allowing users to add books, toggle statuses (Want to Read, Currently Reading, Completed), filter and search in real-time, with automatic LocalStorage persistence.";
    }
    if (q.includes("github") || q.includes("repo") || q.includes("where is your github")) {
      return "You can find all of Ayan's projects and open-source repositories on his official GitHub profile: https://github.com/ayankhanbebea-lgtm";
    }
    if (q.includes("email") || q.includes("contact")) {
      return "You can reach Ayan directly by email at ayankhanbebea@gmail.com or connect via his GitHub profile: https://github.com/ayankhanbebea-lgtm";
    }

    // Default guardrail response
    return "I am Ayan Khan's academic portfolio assistant, designed specifically to answer questions about his educational background, skills, and five coursework projects. How can I help you learn more about his work?";
  }

  async function sendMessage(text) {
    const question = (text || userInput.value || "").trim();
    if (!question) return;

    appendMessage("user", question);
    userInput.value = "";
    userInput.disabled = true;
    sendButton.disabled = true;
    chatStatus.textContent = "AI is thinking...";

    conversationHistory.push({ role: "user", content: question });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: question,
          history: conversationHistory
        })
      });

      if (response.ok) {
        const data = await response.json();
        const answer = data.answer || "Thank you for asking!";
        appendMessage("assistant", answer);
        conversationHistory.push({ role: "assistant", content: answer });
      } else {
        // If serverless endpoint is unavailable (e.g. static preview or local static server)
        const errJson = await response.json().catch(() => ({}));
        if (errJson.error && errJson.error.includes("GROQ_API_KEY")) {
          appendMessage("assistant", `[Server Notice]: ${errJson.error}\n\n${getLocalFallback(question)}`);
        } else {
          const fallback = getLocalFallback(question);
          appendMessage("assistant", fallback);
          conversationHistory.push({ role: "assistant", content: fallback });
        }
      }
    } catch (err) {
      console.warn("API request fallback:", err.message);
      const fallback = getLocalFallback(question);
      appendMessage("assistant", fallback);
      conversationHistory.push({ role: "assistant", content: fallback });
    } finally {
      userInput.disabled = false;
      sendButton.disabled = false;
      chatStatus.textContent = "";
      userInput.focus();
    }
  }

  if (sendButton) {
    sendButton.addEventListener("click", () => sendMessage());
  }

  if (userInput) {
    userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // Clickable suggested question chips
  suggestions.forEach(chip => {
    chip.addEventListener("click", () => {
      const q = chip.textContent.trim();
      userInput.value = q;
      sendMessage(q);
    });
  });

  // Clear chat button
  if (clearChatBtn) {
    clearChatBtn.addEventListener("click", () => {
      chatMessages.innerHTML = `
        <div class="chat-message chat-assistant">
          Chat cleared. Ask me anything about Ayan Khan's background, skills, or projects!
        </div>
      `;
      conversationHistory.length = 0;
      chatStatus.textContent = "";
    });
  }
});
