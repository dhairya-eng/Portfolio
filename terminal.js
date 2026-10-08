// Hacker-terminal hero. Built-in commands run instantly; anything else is sent
// to /api/chat. SECURITY: all output is rendered with textContent / createElement,
// never innerHTML, so model output can't inject markup.

(function () {
  const body = document.getElementById("termBody");
  const output = document.getElementById("termOutput");
  const form = document.getElementById("termForm");
  const input = document.getElementById("termInput");
  const chips = document.getElementById("termChips");
  if (!body || !output || !form || !input) return;

  const PROMPT = "guest@dhairya:~$";
  const EMAIL = "dpparikhinfo@gmail.com";
  const LINKS = {
    github: "https://github.com/dhairya-eng",
    linkedin: "https://www.linkedin.com/in/dhairya-parikh-133aba1a7/",
    resume: "https://github.com/dhairya-eng/Resume",
  };
  const PUBLICATIONS = [
    ["Reinforcement Learning-Based Fuzzer for 5G RRC Security Evaluation (IEEE Access, 2026)", "https://ieeexplore.ieee.org/document/11424421"],
    ["5G/O-RAN Security Automated Testing (MILCOM, 2024)", "https://ieeexplore.ieee.org/document/10774015"],
    ["Adaptive RL-Based Fuzzer for 5G RRC Security Evaluation (MS thesis, Virginia Tech, 2025)", "https://vtechworks.lib.vt.edu/items/0189ff6d-bc89-46a9-ad24-49f5b5029c5f"],
  ];
  const MAX_TURNS = 8;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let busy = false;
  const conversation = []; // { role: "user" | "assistant", content }
  const history = [];
  let historyIndex = 0;

  // ---------- rendering helpers (textContent only) ----------

  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function line(text = "", className = "") {
    const el = document.createElement("div");
    el.className = "term-line" + (className ? " " + className : "");
    el.textContent = text;
    output.appendChild(el);
    scrollToBottom();
    return el;
  }

  // A line made of plain-text and link segments: [["text"], ["label", "https://..."]]
  function richLine(segments, className = "") {
    const el = line("", className);
    segments.forEach(([text, href]) => {
      if (href) {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = text;
        if (!href.startsWith("mailto:")) {
          a.target = "_blank";
          a.rel = "noopener";
        }
        el.appendChild(a);
      } else {
        el.appendChild(document.createTextNode(text));
      }
    });
    scrollToBottom();
    return el;
  }

  function echo(cmd) {
    const el = line("", "term-echo");
    const prompt = document.createElement("span");
    prompt.className = "term-prompt";
    prompt.textContent = PROMPT + " ";
    el.appendChild(prompt);
    el.appendChild(document.createTextNode(cmd));
  }

  // Types text out character by character. Screen readers get the full text at once
  // via a visually-hidden copy; the animated copy is aria-hidden.
  function typeLine(text, className = "") {
    const el = line("", className);
    if (reducedMotion) {
      el.textContent = text;
      scrollToBottom();
      return Promise.resolve(el);
    }
    const srCopy = document.createElement("span");
    srCopy.className = "sr-only";
    srCopy.textContent = text;
    const visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");
    el.append(srCopy, visual);

    // Long replies type faster so they finish in ~2.5s.
    const step = Math.max(1, Math.ceil(text.length / 200));
    let i = 0;
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        i = Math.min(text.length, i + step);
        visual.textContent = text.slice(0, i);
        scrollToBottom();
        if (i >= text.length) {
          clearInterval(timer);
          resolve(el);
        }
      }, 12);
    });
  }

  function loader() {
    const el = line("", "term-loader");
    const cursor = document.createElement("span");
    cursor.className = "term-cursor";
    cursor.textContent = "▌";
    el.append(cursor, document.createTextNode(" querying knowledge base..."));
    return el;
  }

  // ---------- built-in commands ----------

  const commands = {
    help() {
      line("Built-in commands:", "term-accent");
      [
        ["whoami", "who is Dhairya?"],
        ["ls", "list sections  (ls projects for projects)"],
        ["experience", "work history"],
        ["publications", "papers and thesis"],
        ["contact", "email, GitHub, LinkedIn"],
        ["resume", "open the resume"],
        ["match", "jump to Recruiter Mode (paste a job description)"],
        ["clear", "clear the screen"],
      ].forEach(([cmd, desc]) => line("  " + cmd.padEnd(14) + desc));
      line("Anything else is answered by an AI that only knows Dhairya's profile.", "term-muted");
    },

    whoami() {
      line("Dhairya Parikh: Software Engineer (AI/ML, backend, security), NYC area.");
      line("MS Computer Engineering, Virginia Tech (2025). Now at TMEIC building industrial");
      line("control software, a PKI security testing platform, and an agentic RAG diagnostic system.");
      line("Published RL-based 5G fuzzing research (IEEE Access 2026, MILCOM 2024).");
      line("Open to software engineering, AI/ML, and security engineering roles.", "term-accent");
    },

    ls(args) {
      if (args[0] === "projects" || args[0] === "projects/") {
        const list = typeof projects !== "undefined" ? projects : [];
        list.forEach((p) => {
          const href = p.live || p.repo;
          richLine([["  " + p.title.padEnd(26)], [p.live ? "live" : "repo", href]]);
        });
        line("Tip: ask 'which project is most relevant to security?'", "term-muted");
        return;
      }
      line("recruiter/  about/  education/  experience/  projects/  opensource/  publications/  contact/", "term-accent");
      line("Try: ls projects", "term-muted");
    },

    experience() {
      [
        ["TMEIC, USA", "Jun 2025 - present", "C++ industrial control software, PKI/OPC UA security testing, agentic RAG, OT anomaly detection"],
        ["CCI + Booz Allen Hamilton", "May 2024 - Jun 2025", "Q-learning RL fuzzers for 5G/O-RAN RRC, ASN.1 encoder/decoder validation"],
        ["CCI Graduate Researcher", "Jan - May 2025", "LLM post-training (RLHF, DPO), knowledge graphs, recommender systems"],
        ["ISRO Space Applications Centre", "", "automated hardware test harness (Python, Raspberry Pi, Zigbee)"],
      ].forEach(([org, when, what]) => {
        line(org + (when ? "  (" + when + ")" : ""), "term-accent");
        line("  " + what);
      });
    },

    publications() {
      PUBLICATIONS.forEach(([title, href]) => richLine([["- "], [title, href]]));
    },

    contact() {
      richLine([["email     "], [EMAIL, "mailto:" + EMAIL]]);
      richLine([["github    "], [LINKS.github, LINKS.github]]);
      richLine([["linkedin  "], [LINKS.linkedin, LINKS.linkedin]]);
    },

    resume() {
      richLine([["Opening resume... "], [LINKS.resume, LINKS.resume]]);
      window.open(LINKS.resume, "_blank", "noopener");
    },

    match() {
      line("Jumping to Recruiter Mode...", "term-accent");
      const target = document.getElementById("recruiter");
      if (target) {
        target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
        setTimeout(() => document.getElementById("jdInput")?.focus({ preventScroll: true }), 600);
      }
    },

    clear() {
      output.replaceChildren();
    },

    async sudo(args) {
      if (args.join(" ") !== "hire dhairya") {
        line("guest is not in the sudoers file. This incident will be reported.", "term-error");
        return;
      }
      line("[sudo] password for guest: ********");
      await typeLine("Verifying credentials... ✔  Checking references... ✔  Running background check... ✔", "term-muted");
      await typeLine("ACCESS GRANTED. Excellent decision.", "term-success");
      richLine([["Next step: "], [EMAIL, "mailto:" + EMAIL]]);
    },
  };

  // ---------- AI fallback ----------

  async function askAI(question) {
    conversation.push({ role: "user", content: question });
    const pending = loader();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: conversation.slice(-MAX_TURNS) }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      pending.remove();

      if (!res.ok) {
        conversation.pop(); // don't keep a question that never got an answer
        if (res.status === 429) {
          line("Rate limit reached. Try again later, or use the built-in commands (type 'help').", "term-error");
        } else {
          line("The AI assistant is unavailable right now. Built-in commands still work (type 'help').", "term-error");
        }
        return;
      }

      const data = await res.json();
      const reply = typeof data.reply === "string" ? data.reply : "";
      conversation.push({ role: "assistant", content: reply });
      for (const paragraph of reply.split("\n")) {
        await typeLine(paragraph);
      }
    } catch {
      pending.remove();
      conversation.pop();
      line("Network error. Check your connection and try again.", "term-error");
    }
  }

  // ---------- input handling ----------

  async function run(raw) {
    const cmd = raw.trim();
    if (!cmd || busy) return;
    busy = true;
    form.classList.add("is-busy");

    echo(cmd);
    history.push(cmd);
    historyIndex = history.length;

    const [name, ...args] = cmd.split(/\s+/);
    const builtin = Object.prototype.hasOwnProperty.call(commands, name.toLowerCase())
      ? commands[name.toLowerCase()]
      : null;

    try {
      if (builtin && (name.toLowerCase() === "ls" || name.toLowerCase() === "sudo" || args.length === 0)) {
        await builtin(args.map((a) => a.toLowerCase()));
      } else {
        await askAI(cmd);
      }
    } finally {
      busy = false;
      form.classList.remove("is-busy");
      scrollToBottom();
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value;
    input.value = "";
    run(value);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      if (!history.length) return;
      event.preventDefault();
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex];
    } else if (event.key === "ArrowDown") {
      if (!history.length) return;
      event.preventDefault();
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] || "";
    }
  });

  // Click anywhere in the terminal to focus, unless the user is selecting text or clicking a link.
  body.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    if (window.getSelection().toString()) return;
    input.focus({ preventScroll: true });
  });

  chips?.addEventListener("click", (event) => {
    const chip = event.target.closest(".term-chip");
    if (!chip || busy) return;
    run(chip.dataset.cmd);
  });

  // ---------- boot sequence ----------

  async function boot() {
    busy = true;
    form.classList.add("is-busy");
    await typeLine("Initializing secure session... [TLS 1.3 ✔]", "term-muted");
    await typeLine("Loading profile: dhairya.parikh ✔", "term-muted");
    await typeLine("Welcome! Type 'help' for commands, or just ask anything about Dhairya.", "term-accent");
    busy = false;
    form.classList.remove("is-busy");
  }

  boot();
})();
