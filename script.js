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

// ---- Outcomes: exact titles/copy, only real links
const OUTCOMES = {
  direct_employment: {
    title: "Direct employment",
    summary:
      "Some people are ready to go straight into work. They can apply for entry-level jobs that don’t always need lots of qualifications, like retail, hospitality, customer service, or warehouse work. These jobs help them build experience and transferable skills.",
    links: [
      {
        text: "Entry-level opportunities",
        href: "https://www.skillsconnect.org.uk/entry-level-opportunities/"
      }
    ],
    accent: "var(--col12)"
  },
  apprenticeships: {
    title: "Apprenticeships",
    summary:
      "An apprenticeship means learning on the job while also studying towards a qualification.\n\nThey’re paid, so you can earn while you learn. Apprenticeships are available in almost every sector from construction, health and care, digital, business, creative industries, and more.",
    links: [
      {
        text: "Apprenticeship levels",
        href: "https://www.skillsconnect.org.uk/apprenticeships/#levels"
      }
    ],
    accent: "var(--col5)"
  },
  pre_employment: {
    title: "Pre-employment programmes",
    summary:
      "These are short programmes designed to help young people build confidence, improve skills like CV writing or interview techniques, and get some work experience. They’re often a stepping stone into apprenticeships or jobs.",
    links: [],
    accent: "var(--col3)"
  },
  supported_internships: {
    title: "Supported internships",
    summary:
      "For young people with additional needs, supported internships combine work placements with extra help from a job coach or mentor. They’re designed to make the transition into paid work smoother and more achievable.",
    links: [
      {
        text: "Guide to supported internships",
        href: "https://www.skillsconnect.org.uk/find-your-direction/internships/guide-to-supported-internships/"
      }
    ],
    accent: "var(--col10)"
  },
  college_training: {
    title: "College or further training leading to work",
    summary:
      "Some may choose to carry on with a course at college—like a vocational qualification (e.g. plumbing, childcare, health & social care, hairdressing) with a clear route into jobs in that sector.",
    links: [],
    accent: "var(--col2)"
  },
  volunteering: {
    title: "Work experience & volunteering",
    summary:
      "Although unpaid, volunteering and short work experience placements are a great way to build confidence, skills, and connections. It often makes a young person’s CV stand out to future employers.",
    links: [],
    accent: "var(--col6)"
  },
  graduate_routes: {
    title: "Graduate schemes or higher-level routes",
    summary:
      "For those who go on to university or higher education, graduate schemes and internships are a route into professional roles with structured training and progression.",
    links: [
      {
        text: "Internships",
        href: "https://www.skillsconnect.org.uk/find-your-direction/internships/"
      }
    ],
    accent: "var(--col7)"
  },
  self_employed: {
    title: "Self-employment or starting a business",
    summary:
      "Some young people may want to set up their own business or work freelance (common in areas like digital, design, or creative industries). There are schemes that offer advice, mentoring, and sometimes funding to help.",
    links: [],
    accent: "var(--col8)"
  },
  employment_support: {
    title: "Help from employment support services",
    summary:
      "There are also specialist services (like Jobcentre Plus Youth Hubs, local council projects, or voluntary organisations) that provide tailored advice, coaching, and links to employers for young people struggling to find the right path.\n\nSkills Connect can also help you find work, improve your CV and prepare for interviews.",
    links: [
      {
        text: "Speak to Skills Connect",
        href: "https://www.skillsconnect.org.uk/contact-us/speak-to-us/"
      }
    ],
    accent: "var(--col13)"
  }
};

// ---- Questions: six, high-signal, mapped to those outcomes with weights
const QUESTIONS = [
  {
    id: "q1",
    text: "What matters most right now?",
    answers: [
      { id: "q1a1", label: "Getting paid soon", weights: { direct_employment: 2, apprenticeships: 2 } },
      { id: "q1a2", label: "Building confidence first", weights: { pre_employment: 2, volunteering: 1 } },
      { id: "q1a3", label: "Getting a qualification first", weights: { college_training: 2, graduate_routes: 1 } },
      { id: "q1a4", label: "Extra help at work or on placement", weights: { supported_internships: 3 } },
      { id: "q1a5", label: "Starting my own thing", weights: { self_employed: 3 } }
    ]
  },
  {
    id: "q2",
    text: "How do you feel about studying in the next 6 to 12 months?",
    answers: [
      { id: "q2a1", label: "I’d rather work than study", weights: { direct_employment: 2, apprenticeships: 1 } },
      { id: "q2a2", label: "I’ll study if it leads to a job", weights: { college_training: 2, apprenticeships: 1 } },
      { id: "q2a3", label: "I need to build up first", weights: { pre_employment: 2, volunteering: 1 } }
    ]
  },
  {
    id: "q3",
    text: "What kind of help would be most useful?",
    answers: [
      { id: "q3a1", label: "Advice, coaching and links to employers", weights: { employment_support: 3 } },
      { id: "q3a2", label: "A paid role with training built in", weights: { apprenticeships: 2, direct_employment: 1 } },
      { id: "q3a3", label: "A short programme to build skills", weights: { pre_employment: 2 } },
      { id: "q3a4", label: "Clear steps after a course", weights: { college_training: 2, graduate_routes: 1 } },
      { id: "q3a5", label: "Business mentoring or startup advice", weights: { self_employed: 2 } }
    ]
  },
  {
    id: "q4",
    text: "How soon do you need income?",
    answers: [
      { id: "q4a1", label: "Right away", weights: { direct_employment: 2, apprenticeships: 2 } },
      { id: "q4a2", label: "Soon, after some prep", weights: { pre_employment: 2, volunteering: 1 } },
      { id: "q4a3", label: "I can study first", weights: { college_training: 2, graduate_routes: 1 } }
    ]
  },
  {
    id: "q5",
    text: "Do you have an EHCP or think you may need workplace support?",
    answers: [
      { id: "q5a1", label: "Yes", weights: { supported_internships: 3, employment_support: 1 } },
      { id: "q5a2", label: "Not sure", weights: { employment_support: 2 } },
      { id: "q5a3", label: "No", weights: {} }
    ]
  },
  {
    id: "q6",
    text: "Which sounds closest to you?",
    answers: [
      { id: "q6a1", label: "Apply for jobs now", weights: { direct_employment: 2 } },
      { id: "q6a2", label: "Earn and learn", weights: { apprenticeships: 2 } },
      { id: "q6a3", label: "Study a course that leads to work", weights: { college_training: 2 } },
      { id: "q6a4", label: "Build confidence and experience", weights: { pre_employment: 1, volunteering: 1 } },
      { id: "q6a5", label: "Be self-employed or freelance", weights: { self_employed: 2 } }
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
    const sorted = Object.entries(scores).sort((a,b) => b[1] - a[1]);
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
    if (top) results.append(renderResultCard(top[0]));
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
    (data.links || []).forEach(l => {
      const a = el("a", { class:"sc-link", href:l.href }, l.text);
      links.append(a);
    });
    wrap.append(h, p);
    if ((data.links || []).length) wrap.append(links);
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
