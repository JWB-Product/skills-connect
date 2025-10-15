/* Minimal, accessible, weighted quiz for Skills Connect.
   No external deps. Edit copy below. */

// ---- Analytics wrapper (safe if GA not present)
function sendAnalytics(eventName, params = {}) {
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  } catch (_) {}
}

// ---- Quiz content (in JS, not JSON, per your request)
// Outcomes map directly to your sections.
const OUTCOMES = {
  earn_now: {
    title: "Start earning now",
    summary: "Get into paid work now. Try entry-level jobs or earn while you learn as an apprentice.",
    links: [
      { text: "Search jobs near you", href: "/skills/jobs" },
      { text: "Find apprenticeships", href: "/skills/apprenticeships" },
      { text: "Get advice", href: "/skills/support/advice" }
    ],
    accent: "var(--col12)"
  },
  learn_first: {
    title: "Learn first, then work",
    summary: "Keep learning at college or through higher-level routes, then move into work in that sector.",
    links: [
      { text: "Explore college courses", href: "/skills/college-courses" },
      { text: "Graduate routes and schemes", href: "/skills/graduate-routes" },
      { text: "Get advice", href: "/skills/support/advice" }
    ],
    accent: "var(--col5)"
  },
  confidence: {
    title: "Build confidence first",
    summary: "Short programmes and volunteering can build skills, confidence and experience before you apply.",
    links: [
      { text: "Pre-employment programmes", href: "/skills/pre-employment" },
      { text: "Find volunteering", href: "/skills/volunteering" },
      { text: "Get advice", href: "/skills/support/advice" }
    ],
    accent: "var(--col3)"
  },
  supported: {
    title: "Extra support at work",
    summary: "If you have additional needs, a supported internship combines work with extra help from a job coach.",
    links: [
      { text: "How supported internships work", href: "/skills/supported-internships" },
      { text: "Talk to a careers adviser", href: "/skills/support/advice" }
    ],
    accent: "var(--col10)"
  },
  self_employed: {
    title: "Start your own thing",
    summary: "Start a business or go freelance. Advice, mentoring and sometimes funding can help you set up.",
    links: [
      { text: "Startup guidance", href: "/growth-hub/start-a-business" },
      { text: "Book a business support session", href: "/growth-hub/book-support" }
    ],
    accent: "var(--col8)"
  },
  help_me: {
    title: "Get tailored support",
    summary: "Specialist services can give tailored advice, coaching and links to employers.",
    links: [
      { text: "Find local support services", href: "/skills/support/services" },
      { text: "Contact Skills Connect", href: "/skills/support/contact" }
    ],
    accent: "var(--col2)"
  }
};

// Questions: six, high-signal, mapped to outcomes with weights.
const QUESTIONS = [
  {
    id: "q1",
    text: "What matters most right now?",
    answers: [
      { id: "q1a1", label: "Getting paid soon", weights: { earn_now: 3 } },
      { id: "q1a2", label: "Feeling more ready and confident", weights: { confidence: 3 } },
      { id: "q1a3", label: "Getting a qualification first", weights: { learn_first: 3 } },
      { id: "q1a4", label: "Extra help at work or on placement", weights: { supported: 3 } },
      { id: "q1a5", label: "Starting my own thing", weights: { self_employed: 3 } }
    ]
  },
  {
    id: "q2",
    text: "How do you feel about studying in the next 6 to 12 months?",
    answers: [
      { id: "q2a1", label: "I’d rather work than study", weights: { earn_now: 2 } },
      { id: "q2a2", label: "I’m up for a course if it leads to a job", weights: { learn_first: 2 } },
      { id: "q2a3", label: "I’m not ready yet, I need to build up", weights: { confidence: 2 } },
      { id: "q2a4", label: "I want practical learning while I work", weights: { earn_now: 1, learn_first: 1 } }
    ]
  },
  {
    id: "q3",
    text: "What kind of help would be most useful?",
    answers: [
      { id: "q3a1", label: "Someone to coach me and link me to employers", weights: { help_me: 3 } },
      { id: "q3a2", label: "A paid role with training built in", weights: { earn_now: 2 } },
      { id: "q3a3", label: "A short programme to build skills", weights: { confidence: 2 } },
      { id: "q3a4", label: "Clear steps into a job after a course", weights: { learn_first: 2 } },
      { id: "q3a5", label: "Business mentoring or startup advice", weights: { self_employed: 2 } }
    ]
  },
  {
    id: "q4",
    text: "How soon do you need income?",
    answers: [
      { id: "q4a1", label: "Right away", weights: { earn_now: 3 } },
      { id: "q4a2", label: "Soon, after some prep", weights: { confidence: 2, earn_now: 1 } },
      { id: "q4a3", label: "I can study first", weights: { learn_first: 2 } }
    ]
  },
  {
    id: "q5",
    text: "Do you have an EHCP or think you may need workplace support?",
    answers: [
      { id: "q5a1", label: "Yes", weights: { supported: 3, help_me: 1 } },
      { id: "q5a2", label: "Not sure", weights: { help_me: 2 } },
      { id: "q5a3", label: "No", weights: {} }
    ]
  },
  {
    id: "q6",
    text: "Which sounds closest to you?",
    answers: [
      { id: "q6a1", label: "I want to apply for jobs now", weights: { earn_now: 2 } },
      { id: "q6a2", label: "I want to earn and learn", weights: { earn_now: 1, learn_first: 1 } },
      { id: "q6a3", label: "I want to study a course that leads to work", weights: { learn_first: 2 } },
      { id: "q6a4", label: "I need confidence and experience first", weights: { confidence: 2 } },
      { id: "q6a5", label: "I want to be self-employed or freelance", weights: { self_employed: 2 } }
    ]
  }
];

// ---- Render + logic
(function initQuiz(){
  const root = document.getElementById("quiz-root");
  if (!root) return;

  const quizId = root.getAttribute("data-quiz-id") || "skillsconnect-quiz";
  let stepIndex = 0;
  const answers = {}; // questionId -> answerId
  const scores = {};  // outcomeId -> score

  // Skeleton
  const card = el("section", { class: "sc-card", role: "region", "aria-live": "polite" });
  const progress = el("div", { class: "sc-progress", id: "sc-progress" });
  const stepWrap = el("div", { class: "sc-step", id: "sc-step" });
  const actions = el("div", { class: "sc-actions" });
  const backBtn = btn("Back", "secondary");
  const nextBtn = btn("Next", "primary");
  backBtn.disabled = true;

  actions.append(backBtn, nextBtn);
  card.append(progress, stepWrap, actions);
  root.append(card);

  sendAnalytics("quiz_start", { quiz_id: quizId });

  function renderStep(){
    // Completed?
    if (stepIndex >= QUESTIONS.length) {
      renderResults();
      return;
    }

    const q = QUESTIONS[stepIndex];
    progress.textContent = `Question ${stepIndex + 1} of ${QUESTIONS.length}`;
    stepWrap.replaceChildren();

    const qh = el("h2", { class: "sc-q", id: `label-${q.id}` }, q.text);
    const list = el("ul", { class: "sc-list", role: "list" });

    q.answers.forEach(a => {
      const li = el("li");
      const label = el("label", { class: "sc-option" });
      const input = el("input", {
        type: "radio",
        name: q.id,
        value: a.id,
        "aria-labelledby": `label-${q.id}`,
        required: "required"
      });
      if (answers[q.id] === a.id) input.checked = true;

      label.append(input, el("span", {}, a.label));
      li.append(label);
      list.append(li);

      input.addEventListener("change", () => {
        answers[q.id] = a.id;
        nextBtn.disabled = false;
        sendAnalytics("quiz_answer", { quiz_id: quizId, question_id: q.id, answer_id: a.id });
      });
    });

    stepWrap.append(qh, list);

    // Buttons state
    backBtn.disabled = stepIndex === 0;
    nextBtn.textContent = stepIndex === QUESTIONS.length - 1 ? "See results" : "Next";
    nextBtn.disabled = !answers[q.id];

    // Keyboard: Enter moves next if selection present
    stepWrap.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && answers[q.id]) {
        e.preventDefault();
        goNext();
      }
    }, { once: true });
  }

  function goNext(){
    if (!answers[QUESTIONS[stepIndex].id]) return;
    stepIndex += 1;
    renderStep();
  }
  function goBack(){
    if (stepIndex === 0) return;
    stepIndex -= 1;
    renderStep();
  }

  nextBtn.addEventListener("click", goNext);
  backBtn.addEventListener("click", goBack);

  renderStep();

  function renderResults(){
    // Score
    Object.keys(OUTCOMES).forEach(k => scores[k] = 0);

    QUESTIONS.forEach(q => {
      const ansId = answers[q.id];
      const ans = q.answers.find(a => a.id === ansId);
      if (!ans) return;
      Object.entries(ans.weights || {}).forEach(([outcome, val]) => {
        scores[outcome] = (scores[outcome] || 0) + Number(val || 0);
      });
    });

    // Sort outcomes
    const sorted = Object.entries(scores)
      .sort((a,b) => b[1] - a[1]);

    const top = sorted[0];
    const second = sorted[1];
    const showSecond = second && (top[1] - second[1] <= 2);

    sendAnalytics("quiz_complete", {
      quiz_id: quizId,
      top_outcome: top ? top[0] : null,
      second_outcome: showSecond ? second[0] : null,
      question_count: QUESTIONS.length
    });

    // Replace UI with results
    progress.textContent = "Your suggested routes";
    stepWrap.replaceChildren();

    const results = el("div", { class: "sc-results" });
    results.append(renderResultCard(top[0]));

    if (showSecond) results.append(renderResultCard(second[0]));

    // “Why these results?”
    const why = el("details", { class: "sc-card" });
    const whySum = el("summary", {}, "Why these results?");
    const whyList = el("ul");
    Object.entries(answers).forEach(([qid, aid]) => {
      const Q = QUESTIONS.find(q => q.id === qid);
      const A = Q?.answers.find(a => a.id === aid);
      if (Q && A) whyList.append(el("li", {}, `${Q.text} — ${A.label}`));
    });
    why.append(whySum, whyList);

    stepWrap.append(results, why);

    // Actions: retake
    actions.replaceChildren();
    const retake = btn("Start again", "secondary");
    retake.addEventListener("click", () => {
      Object.keys(answers).forEach(k => delete answers[k]);
      stepIndex = 0;
      actions.replaceChildren(backBtn, nextBtn);
      renderStep();
      sendAnalytics("quiz_restart", { quiz_id: quizId });
    });
    actions.append(retake);
  }

  function renderResultCard(key){
    const data = OUTCOMES[key];
    const wrap = el("section", { class: "sc-card sc-result", style:`border-left-color:${data.accent}` });
    const h = el("h3", {}, data.title);
    const p = el("p", {}, data.summary);
    const links = el("div", { class: "sc-links" });
    data.links.forEach(l => {
      const a = el("a", { class:"sc-link", href:l.href }, l.text);
      links.append(a);
    });
    wrap.append(h, p, links);
    return wrap;
  }

  // Small helper to create elements
  function el(tag, attrs = {}, text){
    const node = document.createElement(tag);
    for (const [k,v] of Object.entries(attrs)) {
      if (v === null || v === undefined) continue;
      node.setAttribute(k, v);
    }
    if (text) node.appendChild(document.createTextNode(text));
    return node;
  }
  function btn(label, variant="primary"){
    const b = el("button", { type:"button", class:`sc-btn sc-btn--${variant}` }, label);
    b.addEventListener("keyup", e => { if (e.key === "Enter" || e.key === " ") b.click(); });
    return b;
  }
})();
