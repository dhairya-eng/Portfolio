const projects = [
  {
    id: "apex-f1",
    title: "Apex F1 Atlas",
    summary: "Interactive Formula 1 dashboard with standings context, race predictions, and telemetry comparisons.",
    tech: "JavaScript · Data Visualization · APIs",
    live: "https://apex-f1-atlas.vercel.app/",
    featured: true
  },
  {
    id: "crowdalpha",
    title: "CrowdAlpha",
    summary: "AI sentiment trading platform integrating market/social signals with strategy workflows.",
    tech: "LLM Agents · Finance APIs · Python",
    repo: "https://github.com/dhairya-eng/Crowdalpha"
  },
  {
    id: "rag-pdf",
    title: "RAG-Based PDF Q&A",
    summary: "Document Q&A system with vector retrieval and fast semantic search over long PDFs.",
    tech: "LangChain · FAISS · Gemini",
    repo: "https://github.com/dhairya-eng/LLM-PDFQ-A"
  },
  {
    id: "github-qa",
    title: "GitHub QA Tool",
    summary: "Chat-based tool for navigating and querying codebases using retrieval and LLM reasoning.",
    tech: "LLM · Retrieval · Developer Tools",
    live: "https://huggingface.co/spaces/Dhairya9/chat-your-github-repo"
  },
  {
    id: "rl-env",
    title: "Custom RL Environment",
    summary: "Gym-compatible penetration-testing simulation environment with reward shaping.",
    tech: "Reinforcement Learning · Security",
    repo: "https://github.com/dhairya-eng/Creating-Custom-RL-environment"
  },
  {
    id: "lstm-mlp",
    title: "LSTM & MLP Models",
    summary: "Deep learning experiments for time-series and tabular prediction benchmarks.",
    tech: "PyTorch · Time Series · ML",
    repo: "https://github.com/dhairya-eng/LSTM-and-MLP-Pytorch"
  },
  {
    id: "mnist",
    title: "MNIST Classifier",
    summary: "CNN pipeline with high-accuracy handwritten digit recognition.",
    tech: "PyTorch · Computer Vision",
    repo: "https://github.com/dhairya-eng/MNIST-Pytorch"
  },
  {
    id: "rl-fuzzer-ueransim",
    title: "RL Fuzzer for UERANSIM",
    summary: "Adaptive fuzzing framework for security-focused testing in 5G messaging flows.",
    tech: "RL · 5G Security · Protocol Testing",
    repo: "https://github.com/dhairya-eng/RL-Fuzzer-UERANSIM"
  },
  {
    id: "travel-decider",
    title: "Travel Decider",
    summary: "Decision assistant prototype for trip planning based on user constraints.",
    tech: "Python · Decision Logic",
    repo: "https://github.com/dhairya-eng/Travel-decider"
  }
];

function projectCardMarkup(project) {
  const links = [];
  if (project.live) {
    links.push(`<a class="text-link" href="${project.live}" target="_blank" rel="noopener">Live Demo</a>`);
  }
  if (project.repo) {
    links.push(`<a class="text-link" href="${project.repo}" target="_blank" rel="noopener">GitHub</a>`);
  }

  return `
    <article class="project-card ${project.featured ? "featured" : ""}" data-id="${project.id}">
      <div class="card-top">
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <p class="tech-line">${project.tech}</p>
      </div>
      <div class="card-links">
        ${links.join("")}
      </div>
    </article>
  `;
}

function renderProjects() {
  const grid = document.getElementById("projectGrid");
  grid.innerHTML = projects.map(projectCardMarkup).join("");
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function setupMobileNav() {
  const button = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  button.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");
    button.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

function setupCardTilt() {
  document.addEventListener("mousemove", (event) => {
    const cards = document.querySelectorAll(".project-card");
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) {
        card.style.transform = "";
        return;
      }

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateX = ((event.clientY - centerY) / rect.height) * -6;
      const rotateY = ((event.clientX - centerX) / rect.width) * 6;

      card.style.transform = `perspective(850px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
    });
  });

  document.addEventListener("mouseleave", () => {
    document.querySelectorAll(".project-card").forEach((card) => {
      card.style.transform = "";
    });
  });
}

function setYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

renderProjects();
setupReveal();
setupMobileNav();
setupCardTilt();
setYear();
