# Personal Portfolio Website with API-Based Chatbot Integration

An individual practical **Internal Assessment** project developed for the Computer Science & Engineering curriculum at JECRC University by **Ayan Khan**.

- **Author**: Ayan Khan
- **Enrolment No**: `25BCON1174`
- **Department**: Computer Science and Engineering (CSE Core), 2nd Year
- **Institution**: JECRC University, Jaipur, Rajasthan
- **GitHub Profile**: [https://github.com/ayankhanbebea-lgtm](https://github.com/ayankhanbebea-lgtm)
- **Live Deployed Portfolio**: [https://personal-portfolio-assessment.vercel.app](https://personal-portfolio-assessment.vercel.app) *(or active Vercel deployment)*

---

## 1. Project Overview
This repository contains a responsive, personalized portfolio website showcasing five coursework projects completed across the semester. In addition to clean UI/UX, responsive mobile layouts, and a theme switcher, the portfolio features an **interactive project search and filter engine** and an **API-integrated chatbot** grounded in personal coursework data with zero client-side secret exposure.

---

## 2. The Five Coursework Projects

| # | Project Name | Description | Technologies | Repository / Live Demo |
|:---:|:---|:---|:---|:---|
| **1** | **Python Programs Collection** | Core Python programs implementing factorial calculation, Fibonacci series generation, and C-structure to Python-dictionary data mapping with an audited fact-check table. | Python, Google Colab | [GitHub Repository](https://github.com/ayankhanbebea-lgtm/python-basics-rollno) |
| **2** | **Messy Python Code Improvement** | Practical case study refactoring an intentionally messy student grade and attendance calculator into modular, tested, PEP 8-compliant Python. | Python, Refactoring, PEP 8, Unit Testing | [GitHub Repository](https://github.com/ayankhanbebea-lgtm/messy-python-code-improvement) |
| **3** | **Bug Fixing Using Cursor AI** | Comparative analysis of bug diagnosis using single prompt vs. 3-step chain prompting in Cursor AI to detect and fix 3 critical runtime bugs in an array average algorithm. | C, Python, Cursor AI, Prompt Engineering | [GitHub Repository](https://github.com/ayankhanbebea-lgtm/bug-fixing-using-cursor-ai) |
| **4** | **Interactive Quiz Application** | Responsive quiz application from Lecture 10 evaluating concepts in LLMs, Git conventions, unit testing, and algorithm complexity with instant visual feedback and score calculation. | HTML5, CSS3, JavaScript (ES6+), GitHub Pages | [GitHub Repository](https://github.com/ayankhanbebea-lgtm/interactive-quiz-application) &bull; [Live Demo](https://ayankhanbebea-lgtm.github.io/interactive-quiz-application/) |
| **5** | **Book Reading List Application** | Reading tracker application from Lecture 11 featuring book creation, reading lifecycle statuses (Want to Read, Currently Reading, Completed), live search, status filtering, and LocalStorage persistence. | HTML5, CSS3, JavaScript, LocalStorage, GitHub Pages | [GitHub Repository](https://github.com/ayankhanbebea-lgtm/book-reading-list-application) &bull; [Live Demo](https://ayankhanbebea-lgtm.github.io/book-reading-list-application/) |

---

## 3. Implemented Features

### A. Dynamic Project Search & Filter (Task 3)
- Visitors can search projects in real time by **project name**, **description keywords**, or **technology tags** (e.g., `Python`, `Quiz`, `Book`, `Cursor`).
- Category filter pills (`All`, `Python`, `Web Apps`, `AI & Debugging`) allow one-click domain filtering.
- Dynamic project counter updates live (e.g., *"Showing 2 of 5 projects"*).

### B. Light & Dark Mode Toggle (Task 3)
- Smooth toggle switch in the sticky header accessible on both desktop and mobile devices.
- Auto-detects system preference (`prefers-color-scheme`) and persists user preference across visits using `localStorage`.

### C. Secure AI Chatbot Integration (Task 6)
- Allows visitors to ask questions about Ayan's academic background, skills, and projects.
- **Strict Security Architecture**: Secret API keys are **never** bundled into frontend client JavaScript or committed to GitHub.
- Communicates with `/api/chat`, a secure **Vercel Serverless Function** reading `process.env.GROQ_API_KEY`.
- Includes pre-configured question chips for quick testing (*"Who are you?"*, *"What are your skills?"*, *"Explain your Python programs"*, *"What was corrected in the buggy code project?"*).
- Includes graceful client fallback handling for local static demonstrations.

---

## 4. Technologies Used
- **Frontend**: Semantic HTML5, CSS3 (Custom CSS variables, Grid, Flexbox, media queries), Vanilla JavaScript (ES6+).
- **Backend / Serverless**: Node.js Serverless Function (`api/chat.js`) on Vercel.
- **AI API**: Groq Cloud API (`llama-3.3-70b-versatile`) with role-based system prompts.
- **Typography**: Google Fonts (`Bricolage Grotesque` and `IBM Plex Sans`).
- **DevOps & Hosting**: Git, GitHub, Vercel CLI, GitHub Pages.

---

## 5. Local Setup & Development Instructions

### Step 1: Clone the Repository
```bash
git clone https://github.com/ayankhanbebea-lgtm/personal-portfolio.git
cd personal-portfolio
```

### Step 2: Running Frontend Locally
To view the frontend pages and interactive filters:
```bash
# Using Python
python -m http.server 3000

# Or using Node.js
npx serve .
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 3: Running with Local Vercel Serverless Function (Optional)
If you want to run the live Groq backend server locally:
```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Create a local .env file (never commit this)
echo GROQ_API_KEY=your_groq_api_key_here > .env.local

# Run Vercel development server
vercel dev
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
- Department of Computer Science & Engineering, JECRC University
- Email: [ayankhanbebea@gmail.com](mailto:ayankhanbebea@gmail.com)
- GitHub: [@ayankhanbebea-lgtm](https://github.com/ayankhanbebea-lgtm)
