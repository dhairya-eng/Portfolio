// Recruiter Mode: paste a job description, get an honest fit analysis from /api/match.
// SECURITY: model output is rendered only via textContent / createElement.

(function () {
  const form = document.getElementById("jdForm");
  const input = document.getElementById("jdInput");
  const counter = document.getElementById("jdCounter");
  const sampleBtn = document.getElementById("jdSample");
  const analyzeBtn = document.getElementById("jdAnalyze");
  const errorEl = document.getElementById("jdError");
  const resultEl = document.getElementById("jdResult");
  if (!form || !input || !resultEl) return;

  const MAX = 6000;
  const SVG_NS = "http://www.w3.org/2000/svg";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const SAMPLE_JD = `Security Engineer, AI Systems

About the role
We are a growing cybersecurity company protecting critical infrastructure and industrial networks. We are hiring a Security Engineer to help build AI-assisted detection and testing tools for our platform.

What you'll do
- Design and build backend services in Python that ingest and analyze telemetry from industrial (OT) and enterprise networks
- Develop ML models for anomaly detection and threat prioritization
- Build LLM-powered tooling (RAG over internal docs and alerts) to help analysts triage faster
- Run protocol-level security testing and fuzzing; triage and report vulnerabilities
- Manage PKI and certificate workflows (X.509, TLS/mTLS) for device authentication
- Work with Docker and cloud infrastructure (AWS or Azure)

Requirements
- BS/MS in Computer Science, Computer Engineering, or related field
- 2+ years of software engineering or security engineering experience
- Strong Python; familiarity with C++ or Go
- Experience with ML frameworks (PyTorch) and LLM application frameworks (LangChain or similar)
- Understanding of network protocols and applied cryptography
- Experience with Linux, Git, and SQL databases

Nice to have
- Experience with OT/ICS protocols (OPC UA, Modbus) or 5G/telecom security
- Published security research
- Kubernetes and infrastructure-as-code (Terraform)
- Security certifications (OSCP, CISSP)`;

  // ---------- input ----------

  function updateCounter() {
    const n = input.value.length;
    counter.textContent = `${n} / ${MAX}`;
    counter.classList.toggle("is-full", n >= MAX);
  }

  input.addEventListener("input", updateCounter);
  sampleBtn.addEventListener("click", () => {
    input.value = SAMPLE_JD;
    updateCounter();
    input.focus();
  });
  updateCounter();

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }

  function setLoading(loading) {
    analyzeBtn.disabled = loading;
    analyzeBtn.setAttribute("aria-busy", String(loading));
    analyzeBtn.textContent = loading ? "Analyzing…" : "Analyze fit";
    form.classList.toggle("is-loading", loading);
  }

  // ---------- page highlights ----------

  function cardFor(id) {
    return document.querySelector(`[data-id="${CSS.escape(id)}"]`);
  }

  function labelFor(id) {
    const heading = cardFor(id)?.querySelector("h3");
    if (!heading) return id;
    const text = heading.textContent.trim();
    return text.length > 38 ? text.slice(0, 36) + "…" : text;
  }

  function clearHighlights() {
    document.querySelectorAll(".jd-match").forEach((el) => el.classList.remove("jd-match"));
  }

  function highlight(ids) {
    clearHighlights();
    ids.forEach((id) => cardFor(id)?.classList.add("jd-match"));
  }

  function scrollToCard(id) {
    const card = cardFor(id);
    if (!card) return;
    // Cards inside .reveal sections are invisible until scrolled into view; force them visible.
    card.closest(".reveal")?.classList.add("in-view");
    card.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    card.classList.remove("jd-flash");
    void card.offsetWidth; // restart the animation
    card.classList.add("jd-flash");
  }

  // ---------- rendering (createElement + textContent only) ----------

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function scoreBand(score) {
    if (score >= 75) return { cls: "band-strong", label: "Strong fit" };
    if (score >= 50) return { cls: "band-good", label: "Good fit" };
    if (score >= 30) return { cls: "band-partial", label: "Partial fit" };
    return { cls: "band-low", label: "Low fit" };
  }

  function scoreRing(score) {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const band = scoreBand(score);

    const wrap = el("div", `jd-ring ${band.cls}`);
    wrap.setAttribute("role", "img");
    wrap.setAttribute("aria-label", `Fit score ${score} out of 100: ${band.label}`);

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 120 120");
    svg.setAttribute("aria-hidden", "true");
    const track = document.createElementNS(SVG_NS, "circle");
    const arc = document.createElementNS(SVG_NS, "circle");
    [track, arc].forEach((c) => {
      c.setAttribute("cx", "60");
      c.setAttribute("cy", "60");
      c.setAttribute("r", String(radius));
    });
    track.setAttribute("class", "jd-ring-track");
    arc.setAttribute("class", "jd-ring-arc");
    arc.style.strokeDasharray = String(circumference);
    arc.style.strokeDashoffset = String(circumference);
    svg.append(track, arc);

    const number = el("div", "jd-ring-number", "0");
    number.setAttribute("aria-hidden", "true");
    const small = el("span", "jd-ring-band", band.label);
    small.setAttribute("aria-hidden", "true");
    wrap.append(svg, number, small);

    // Animate after insertion so the CSS transition runs.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        arc.style.strokeDashoffset = String(circumference * (1 - score / 100));
        if (reducedMotion) {
          number.textContent = String(score);
          return;
        }
        const start = performance.now();
        const duration = 1100;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          number.textContent = String(Math.round(score * (1 - Math.pow(1 - t, 3))));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      })
    );
    return wrap;
  }

  function idChips(ids) {
    const row = el("div", "jd-chip-row");
    ids.forEach((id) => {
      if (!cardFor(id)) {
        row.appendChild(el("span", "jd-chip is-static", id));
        return;
      }
      const chip = el("button", "jd-chip", "↳ " + labelFor(id));
      chip.type = "button";
      chip.title = "Scroll to this item";
      chip.addEventListener("click", () => scrollToCard(id));
      row.appendChild(chip);
    });
    return row;
  }

  function render(data) {
    resultEl.replaceChildren();

    // Summary: ring + verdict
    const summary = el("div", "jd-summary");
    summary.appendChild(scoreRing(data.score));
    const text = el("div", "jd-summary-text");
    if (data.role_title) text.appendChild(el("p", "jd-role", data.role_title));
    if (data.verdict) text.appendChild(el("p", "jd-verdict", data.verdict));
    const actions = el("div", "jd-actions");
    if (data.highlight_ids.length) {
      actions.appendChild(el("span", "jd-highlight-note", `${data.highlight_ids.length} matching items highlighted on the page.`));
      const clearBtn = el("button", "link-btn", "Clear highlights");
      clearBtn.type = "button";
      clearBtn.addEventListener("click", () => {
        clearHighlights();
        clearBtn.disabled = true;
        clearBtn.textContent = "Highlights cleared";
      });
      actions.appendChild(clearBtn);
    }
    text.appendChild(actions);
    summary.appendChild(text);
    resultEl.appendChild(summary);

    // Two columns: fits + gaps
    const cols = el("div", "jd-columns");

    const fits = el("div", "jd-col jd-fits");
    fits.appendChild(el("h3", "", "Why he fits"));
    if (data.matched.length) {
      const list = el("ul", "jd-list");
      data.matched.forEach((m) => {
        const li = el("li");
        li.appendChild(el("p", "jd-req", m.requirement));
        li.appendChild(el("p", "jd-evidence", "→ " + m.evidence));
        if (m.ids.length) li.appendChild(idChips(m.ids));
        list.appendChild(li);
      });
      fits.appendChild(list);
    } else {
      fits.appendChild(el("p", "jd-empty", "No clear matches found for this role."));
    }

    const gaps = el("div", "jd-col jd-gaps");
    gaps.appendChild(el("h3", "", "Gaps (honest)"));
    if (data.gaps.length) {
      const list = el("ul", "jd-list");
      data.gaps.forEach((g) => {
        const li = el("li");
        li.appendChild(el("p", "jd-req", g.requirement));
        if (g.note) li.appendChild(el("p", "jd-note", g.note));
        list.appendChild(li);
      });
      gaps.appendChild(list);
    } else {
      gaps.appendChild(el("p", "jd-empty", "No significant gaps identified."));
    }

    cols.append(fits, gaps);
    resultEl.appendChild(cols);
    resultEl.appendChild(
      el("p", "jd-disclaimer", "AI-generated from Dhairya's profile. It can make mistakes; the cards below are the source of truth.")
    );

    resultEl.hidden = false;
    highlight(data.highlight_ids);
  }

  // ---------- submit ----------

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const jd = input.value.trim();
    showError("");
    if (!jd) {
      showError("Paste a job description first, or try the sample.");
      input.focus();
      return;
    }
    if (jd.length > MAX) {
      showError(`That's over ${MAX} characters. Please trim it down.`);
      return;
    }

    setLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 35000);
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jd }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.status === 429) {
        showError("You've hit the hourly limit for analyses. Please try again later, or email dpparikhinfo@gmail.com.");
        return;
      }
      if (res.status === 400) {
        const body = await res.json().catch(() => ({}));
        showError(typeof body.error === "string" ? body.error : "That job description couldn't be processed.");
        return;
      }
      if (!res.ok) {
        showError("The analyzer is having trouble right now. Please try again in a minute.");
        return;
      }

      const data = await res.json();
      if (typeof data.score !== "number") throw new Error("bad shape");
      render({
        score: data.score,
        verdict: data.verdict || "",
        role_title: data.role_title || "",
        matched: Array.isArray(data.matched) ? data.matched : [],
        gaps: Array.isArray(data.gaps) ? data.gaps : [],
        highlight_ids: Array.isArray(data.highlight_ids) ? data.highlight_ids : [],
      });
      resultEl.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
    } catch {
      showError("Something went wrong reaching the analyzer. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  });
})();
