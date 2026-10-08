// Knowledge base used by /api/chat and /api/match.
// Every experience / project / publication entry carries a stable [id: ...] tag.
// The same ids are set as data-id attributes on the cards in index.html
// (projects: the `id` field in script.js). Keep the three in sync.
//
// Only facts that are on the site or confirmed by Dhairya belong here.

export const PROFILE = `
DHAIRYA PARIKH
Software Engineer focused on AI/ML, backend, and security. Based in the NYC area.
Looking for: software engineering, AI/ML, and security engineering roles.
Contact: email dpparikhinfo@gmail.com | GitHub https://github.com/dhairya-eng | LinkedIn https://www.linkedin.com/in/dhairya-parikh-133aba1a7/
Resume: https://github.com/dhairya-eng/Resume

== EDUCATION ==
[id: edu-vt] Virginia Tech. MS in Computer Engineering, Aug 2023 - May 2025. GPA 3.80/4.0.
[id: edu-bvm] Birla Vishvakarma Mahavidyalaya (BVM), India. BTech in Electronics & Communication Engineering, Aug 2019 - May 2023. CPI 3.60/4.0.

== EXPERIENCE ==
[id: tmeic] TMEIC, USA. Jun 2025 - present. Title on site: Process Automation Engineer. Software development for industrial control systems.
- Commissioning and tuning C++ control/monitoring software.
- SQL Server-integrated client-server architecture.
- Profiling, logging, and performance analysis.
- Built a PKI security testing platform (EJBCA + OpenSSL, Flask) that automates the X.509 certificate lifecycle and OPC UA client-server authentication.
- Building an agentic RAG diagnostic system using the Claude and GPT APIs.
- AI models for anomaly detection and predictive maintenance in OT (operational technology) systems.
- Python telemetry pipelines for industrial time-series forecasting.
- Supporting security teams with behavior analytics in industrial environments.

[id: cci-booz] Commonwealth Cyber Initiative (CCI, Virginia Tech) with Booz Allen Hamilton. Graduate Research Assistant, May 2024 - Jun 2025.
- Designed Q-learning reinforcement learning (RL) fuzzers for 5G/O-RAN RRC (Radio Resource Control) messages.
- ASN.1-based RRC encoder/decoder validation tools for protocol-level testing.
- Adversarial protocol testing; identified vulnerabilities across O-RAN workflows in lab environments.

[id: cci-llm] Commonwealth Cyber Initiative (CCI, Virginia Tech). Graduate Researcher, Jan 2025 - May 2025.
- LLM post-training (RLHF, DPO).
- Knowledge graphs and recommender systems.

[id: isro] Indian Space Research Organisation (ISRO), Space Applications Centre (SAC), India. Researcher.
- Built an automated hardware test harness using Python, Raspberry Pi, and Zigbee, including multiplexer design.
- Integrated multi-device controls for real-time monitoring and validation.

== PUBLICATIONS ==
[id: pub-ieee-access] "Reinforcement Learning-Based Fuzzer for 5G RRC Security Evaluation", IEEE Access, 2026. RL-driven fuzzing framework for security evaluation of 5G RRC workflows. https://ieeexplore.ieee.org/document/11424421
[id: pub-milcom] "5G/O-RAN Security Automated Testing", IEEE MILCOM, 2024. Automated testing architecture for 5G/O-RAN security validation. https://ieeexplore.ieee.org/document/10774015
[id: pub-thesis] MS thesis: "Adaptive Reinforcement Learning-Based Fuzzer for 5G RRC Security Evaluation", Virginia Tech, 2025. Adaptive RL strategy design for 5G protocol fuzzing. https://vtechworks.lib.vt.edu/items/0189ff6d-bc89-46a9-ad24-49f5b5029c5f

== PROJECTS ==
[id: apex-f1] Apex F1 Atlas. Interactive Formula 1 dashboard with standings context, race predictions, and telemetry comparisons. JavaScript, data visualization, APIs. Live: https://apex-f1-atlas.vercel.app/
[id: crowdalpha] CrowdAlpha. AI sentiment trading platform integrating market/social signals with strategy workflows. LLM agents, finance APIs, Python. https://github.com/dhairya-eng/Crowdalpha
[id: rag-pdf] RAG-Based PDF Q&A. Document Q&A system with vector retrieval and fast semantic search over long PDFs. LangChain, FAISS, Gemini. https://github.com/dhairya-eng/LLM-PDFQ-A
[id: github-qa] GitHub QA Tool. Chat-based tool for navigating and querying codebases using retrieval and LLM reasoning. Live: https://huggingface.co/spaces/Dhairya9/chat-your-github-repo
[id: rl-env] Custom RL Environment. Gym-compatible penetration-testing simulation environment with reward shaping. Reinforcement learning, security. https://github.com/dhairya-eng/Creating-Custom-RL-environment
[id: lstm-mlp] LSTM & MLP Models. Deep learning experiments for time-series and tabular prediction benchmarks. PyTorch. https://github.com/dhairya-eng/LSTM-and-MLP-Pytorch
[id: mnist] MNIST Classifier. CNN pipeline for handwritten digit recognition. PyTorch, computer vision. https://github.com/dhairya-eng/MNIST-Pytorch
[id: rl-fuzzer-ueransim] RL Fuzzer for UERANSIM. Adaptive fuzzing framework for security-focused testing of 5G messaging flows. RL, 5G security, protocol testing. https://github.com/dhairya-eng/RL-Fuzzer-UERANSIM
[id: travel-decider] Travel Decider. Decision assistant prototype for trip planning based on user constraints. Python. https://github.com/dhairya-eng/Travel-decider

== OPEN SOURCE ==
[id: docsgpt] DocsGPT (arc53/DocsGPT). Contributed to the RAG pipeline and integration improvements. PR: https://github.com/arc53/DocsGPT/pull/1982
[id: llamafarm] LlamaFarm (llama-farm/llamafarm). Developer-experience enhancements and debugging contributions. https://github.com/llama-farm/llamafarm

== SKILLS ==
Languages: Python, C++, Go, JavaScript.
AI/ML: PyTorch, LangChain, RAG, reinforcement learning, RLHF/DPO, LLM agents.
Backend: FastAPI, Flask, gRPC.
Data: PostgreSQL, SQL Server, Redis.
Tooling: Docker, Linux, Git.
Cloud: Azure (Microsoft Certified: Azure AI Fundamentals), AWS.
Security: PKI/X.509, OpenSSL, EJBCA, TLS/mTLS, OPC UA, ASN.1, protocol fuzzing.
Telecom: 5G/O-RAN, RRC.
Domain: industrial automation, OT systems.
`.trim();

// Allowlist of valid ids, derived from the [id: ...] tags above so it can never drift.
export const PROFILE_IDS = Object.freeze([
  ...new Set([...PROFILE.matchAll(/\[id: ([a-z0-9-]+)\]/g)].map((m) => m[1])),
]);
