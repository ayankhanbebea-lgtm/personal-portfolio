/**
 * Ayan Khan - AI Chatbot Client
 * Communicates securely with /api/chat (Vercel Serverless Function).
 * Contains fallback answers for offline / local static preview.
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

  // Knowledge base fallback for local static testing (when /api/chat server is offline)
  function getLocalFallback(query) {
    const q = query.toLowerCase();

    if (q.includes("who are you") || q.includes("introduce") || q.includes("about")) {
      return "I'm Ayan Khan's AI assistant! Ayan is a 2nd-year B.Tech CSE (Core) student at JECRC University, passionate about Python, software development, web engineering, and AI tools.";
    }
    if (q.includes("skill") || q.includes("tech") || q.includes("stack")) {
      return "Ayan's technical competencies include Python, C, C++, JavaScript (ES6+), HTML5, CSS3, DOM manipulation, LocalStorage, Git/GitHub, and prompt engineering in Cursor AI.";
    }
    if (q.includes("project") || q.includes("completed") || q.includes("work")) {
      return "Ayan has completed five core projects: 1) Python Programs Collection, 2) Messy Python Code Improvement, 3) Bug Fixing Using Cursor AI, 4) Interactive Quiz Application, and 5) Book Reading List Application.";
    }
    if (q.includes("python program") || q.includes("factorial") || q.includes("fibonacci")) {
      return "Ayan's Python Programs Collection (Lecture 4) demonstrates Factorial calculation, Fibonacci series generation, and C-Structure to Python-Dictionary conversion, developed in Google Colab with an audited README.";
    }
    if (q.includes("bug") || q.includes("cursor") || q.includes("corrected")) {
      return "In the Bug Fixing project (CW02), Ayan used Cursor AI with a 3-step chain prompting approach to fix 3 critical bugs in an array average algorithm: uninitialized sum variable, off-by-one buffer overflow (i <= n), and integer division truncation.";
    }
    if (q.includes("messy") || q.includes("clean") || q.includes("refactor")) {
      return "In the Messy Python Code Improvement project, Ayan refactored a monolithic student grade and attendance calculator with poor variable names and repeated code into a modular, type-annotated, PEP 8-compliant script with automated unit tests.";
    }
    if (q.includes("reading list") || q.includes("book")) {
      return "The Book Reading List Application (Lecture 11) is a responsive web app that allows visitors to add, filter, search, and track books across Want to Read, Reading, and Completed states with persistent browser LocalStorage.";
    }
    if (q.includes("quiz")) {
      return "The Interactive Quiz Application (Lecture 10) tests CS and AI concepts including LLM next-token prediction, Git commit formatting, and time complexity, featuring dynamic question rendering and instant feedback.";
    }
    if (q.includes("github") || q.includes("repo")) {
      return "You can check out all of Ayan's open-source repositories directly on his GitHub profile: https://github.com/ayankhanbebea-lgtm";
    }

    return "Ayan Khan is a 2nd-year B.Tech CSE student at JECRC University. You can explore his five coursework projects in the Projects section above, or visit his GitHub at https://github.com/ayankhanbebea-lgtm.";
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
      // Send to serverless API route
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
      } else if (response.status === 404 || response.status === 405 || response.status === 500) {
        // When running locally without Vercel CLI server or if GROQ_API_KEY is not yet configured,
        // use local fallback so the user can test the interface locally
        const errJson = await response.json().catch(() => ({}));
        if (errJson.error && errJson.error.includes("GROQ_API_KEY")) {
          appendMessage("assistant", `[Configuration Notice]: ${errJson.error}\n\nFallback Answer: ${getLocalFallback(question)}`);
        } else {
          // Local fallback
          const fallback = getLocalFallback(question);
          appendMessage("assistant", fallback);
          conversationHistory.push({ role: "assistant", content: fallback });
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        const errMessage = errData.error || "Unable to reach AI assistant right now. Please try again.";
        appendMessage("assistant", errMessage);
      }
    } catch (err) {
      console.warn("API request failed (using local response fallback):", err.message);
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

  // Clear chat
  if (clearChatBtn) {
    clearChatBtn.addEventListener("click", () => {
      chatMessages.innerHTML = `
        <div class="chat-message chat-assistant">
          Chat cleared. Ask me anything about Ayan's skills, coursework, or projects!
        </div>
      `;
      conversationHistory.length = 0;
      chatStatus.textContent = "";
    });
  }
});
