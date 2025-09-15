const projectData = {
  crowdalpha: {
    title: "CrowdAlpha – AI Sentiment Trading Platform",
    desc: "LLM-powered multi-agent trading platform integrating Reddit/YFinance APIs with Alpaca’s paper trading for automated strategy backtesting.",
    link: "https://github.com/dhairya-eng/CrowdAlpha"
  },
  ragqa: {
    title: "RAG-Based PDF Q&A",
    desc: "Built using LangChain, FAISS, and Gemini embeddings to provide 90%+ retrieval accuracy on 100+ page technical documents.",
    link: "https://github.com/dhairya-eng/LLM-PDFQ-A"
  },
  rlenv: {
    title: "Custom RL Environment for Penetration Testing",
    desc: "Gym-compatible RL environment simulating multi-stage penetration testing with dynamic reward modeling.",
    link: "https://github.com/dhairya-eng/Creating-Custom-RL-environment"
  },
  lstmmlp: {
    title: "LSTM & MLP PyTorch Models",
    desc: "Developed deep learning models for classification and regression on time-series and tabular datasets with benchmarking.",
    link: "https://github.com/dhairya-eng/LSTM-and-MLP-Pytorch"
  },
  mnist: {
    title: "MNIST Digit Classifier",
    desc: "PyTorch CNN achieving >99% accuracy using data augmentation and batch normalization.",
    link: "https://github.com/dhairya-eng/MNIST-Pytorch"
  },
  gpt_ta: {
    title: "GPT Teaching Assistant System",
    desc: "LLM-based assistant system to support ECE and CS teaching assistants in student interactions.",
    link: "#"
  },
  ignition: {
    title: "Automatic Ignition Locking System",
    desc: "Designed an alcohol detection system using MQ3 sensor + Arduino Uno to prevent drunk driving.",
    link: "#"
  },
  dns: {
    title: "DNS Attack Project",
    desc: "Configured and executed DNS cache poisoning and spoofing attacks in lab environment.",
    link: "#"
  },
  anpr: {
    title: "ANPR System (Review Work)",
    desc: "Studied YOLO-based ANPR for toll collection and character extraction.",
    link: "#"
  },
  fuzzing: {
    title: "5G RRC Fuzzing Framework",
    desc: "RL-driven fuzzing framework targeting RRC messages in OAI and UERANSIM.",
    link: "#"
  },
  pki: {
    title: "PKI Infrastructure Manager",
    desc: "Flask-based PKI system for certificate generation, revocation, and lifecycle management.",
    link: "#"
  },
  remote: {
    title: "Remote Work Security Assessment",
    desc: "Used Nessus to scan VPN & RDP vulnerabilities and assess remote work security.",
    link: "#"
  },
  ai_assistant: {
    title: "AI Knowledge Assistant with LangChain",
    desc: "Built a RAG assistant answering queries from PDF manuals & codebases using Gemini + FAISS.",
    link: "https://github.com/dhairya-eng/LLM-PDFQ-A"
  },
  githubqa: {
    title: "LLM-Powered GitHub Codebase QA Tool",
    desc: "Developed chatbot to answer repo questions using LangChain + Gemini with retrieval techniques.",
    link: "https://huggingface.co/spaces/Dhairya9/chat-your-github-repo"
  }
};


function openProject(key) {
  const data = projectData[key];
  if (!data) return;
  document.getElementById("projTitle").innerText = data.title;
  document.getElementById("projDesc").innerText = data.desc;
  document.getElementById("projLink").href = data.link;
  document.getElementById("projectPopup").style.display = "flex";
}

function closeProject() {
  document.getElementById("projectPopup").style.display = "none";
}
