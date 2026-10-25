# Personal Portfolio Website with API-Based Chatbot Integration

An individual practical **Internal Assessment** project developed for the Computer Science & Engineering curriculum at JECRC University by **Ayan Khan**.

- **Author**: Ayan Khan
- **College**: JECRC University, Jaipur, Rajasthan
- **Degree**: B.Tech in Computer Science and Engineering (CSE Core)
- **Current Year**: 2nd Year
- **Expected Graduation**: 2029
- **Email**: [ayankhanbebea@gmail.com](mailto:ayankhanbebea@gmail.com)
- **GitHub Profile**: [https://github.com/ayankhanbebea-lgtm](https://github.com/ayankhanbebea-lgtm)
- **Live Deployed Portfolio**: [https://personal-portfolio-assessment.vercel.app](https://personal-portfolio-assessment.vercel.app) *(or active Vercel / GitHub Pages deployment)*

---

## 1. Project Overview
This repository contains a personalized, responsive portfolio website showcasing five coursework projects completed during the semester. The website incorporates modern UI/UX design, mobile responsiveness, a persistent light/dark mode toggle, an interactive project search and filter engine, and a secure API-based chatbot integrated with Groq.

---

## 2. The Five Coursework Projects

| # | Project Name | Description | Technologies | Repository & Live Links |
|:---:|:---|:---|:---|:---|
| **1** | **Python Programs Collection** | Core Python programs converting C algorithms into Python (Factorial calculation, Fibonacci series generator, and C-structure to Python-dictionary data mapping) with an audited fact-check README. | Python, C, Google Colab | [GitHub Repository](https://github.com/ayankhanbebea-lgtm/python-basics-rollno) |
| **2** | **Messy Python Code Improvement** | Practical case study refactoring an intentionally messy student grade and attendance calculator script with cryptic naming and duplicate logic into clean, modular, and tested Python using AI assistance. | Python, AI Tools, Refactoring, Unit Testing | [GitHub Repository](https://github.com/ayankhanbebea-lgtm/messy-python-code-improvement) |
| **3** | **Bug Fixing Using Cursor AI** | Case study identifying and correcting 3 runtime bugs (uninitialized variable, off-by-one buffer overflow, and integer division truncation) in an array average algorithm using 3-step chain prompting in Cursor AI. | C, Python, Cursor AI, Prompt Engineering | [GitHub Repository](https://github.com/ayankhanbebea-lgtm/bug-fixing-using-cursor-ai) |
| **4** | **Interactive Quiz Application** | Responsive quiz web application developed in Lecture 10 testing computer science and AI concepts with dynamic question rendering, instant visual feedback, and score tracking. | HTML, CSS, JavaScript, Web Development | [GitHub Repository](https://github.com/ayankhanbebea-lgtm/interactive-quiz-application) &bull; [Live Demo](https://ayankhanbebea-lgtm.github.io/interactive-quiz-application/) |
| **5** | **Book Reading List Application** | Reading tracker application developed in Lecture 11 with book creation, reading lifecycle statuses (Want to Read, Currently Reading, Completed), live search, status filtering, and LocalStorage persistence. | HTML, CSS, JavaScript, LocalStorage | [GitHub Repository](https://github.com/ayankhanbebea-lgtm/book-reading-list-application) &bull; [Live Demo](https://ayankhanbebea-lgtm.github.io/book-reading-list-application/) |

---

## 3. Implemented Features

### A. Dynamic Project Search & Filter (Task 3)
- Visitors can search projects in real time by **project name** or **technology** (e.g., `Python`, `Quiz`, `Book`).
- Category filter buttons (`All`, `Python`, `Web Development`, `AI Tools`) allow instant domain filtering.
- A dynamic counter updates live based on the entered search term (*"Showing 5 of 5 projects"*).

### B. Light & Dark Mode Toggle (Task 3)
- Smooth toggle switch in the sticky header accessible on both desktop and mobile devices.
- Automatically respects system preferences (`prefers-color-scheme`) and persists user preference across sessions using `localStorage`.

### C. Secure AI Chatbot Integration (Task 6)
- Allows visitors to ask questions about Ayan's academic background at JECRC University, his skills, and coursework projects.
- **Strict Security Architecture**: Secret API keys are **never** bundled into frontend client JavaScript or committed to GitHub.
- Communicates with `/api/chat`, a secure **Vercel Serverless Function** reading `process.env.GROQ_API_KEY`.
- Includes suggested question chips for quick testing (*"Who are you?"*, *"Where do you study?"*, *"What are your skills?"*, *"What projects have you completed?"*, *"Tell me about your Python Programs Collection"*, *"What was fixed in the Bug Fixing Using Cursor AI project?"*).
- Includes graceful client fallback handling for local static demonstrations.

---

## 4. Technologies Used
- **Frontend**: Semantic HTML5, CSS3 (Custom CSS variables, Grid, Flexbox, media queries), Vanilla JavaScript (ES6+).
- **Backend / Serverless**: Node.js Serverless Function (`api/chat.js`) on Vercel.
- **AI API**: Groq API (`openai/gpt-oss-20b`) with role-based system prompts.
- **Typography**: Google Fonts (`Bricolage Grotesque` and `IBM Plex Sans`).
- **DevOps & Hosting**: Git, GitHub, Vercel CLI, GitHub Pages.

---

## 5. Local Setup Instructions

### Step 1: Clone the Repository
```bash
git clone https://github.com/ayankhanbebea-lgtm/personal-portfolio.git
cd personal-portfolio
```

### Step 2: Running Frontend Locally
To view the frontend pages and interactive filters:
```bash
npx serve .
# Or using Python:
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Step 3: Running with Local Vercel Serverless Function (Optional)
To test the live Groq backend server locally:
```bash
# Add your GROQ_API_KEY to .env.local (this file is ignored by git)
echo GROQ_API_KEY=your_groq_api_key_here > .env.local

# Run Vercel development server
npx vercel dev
```

---

## 6. Vercel Deployment & Environment Variables

When deploying this project to Vercel:

1. **Import the repository** into Vercel from GitHub (`ayankhanbebea-lgtm/personal-portfolio`).
2. **Add Environment Variable**:
   - **Key**: `GROQ_API_KEY`
   - **Value**: Your private Groq API key (`gsk_...`)
3. **Deploy**: Vercel automatically deploys both the static assets and the serverless `/api/chat` route.

---

## 7. Author Information
- **Ayan Khan** (2nd Year B.Tech CSE Core)
- Department of Computer Science & Engineering, JECRC University, Jaipur
- Email: [ayankhanbebea@gmail.com](mailto:ayankhanbebea@gmail.com)
- GitHub: [@ayankhanbebea-lgtm](https://github.com/ayankhanbebea-lgtm)
