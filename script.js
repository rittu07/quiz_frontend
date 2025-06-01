const subjectsDiv = document.getElementById("subjects");
const quizContainer = document.getElementById("quiz-container");
const questionEl = document.getElementById("question");
const optionsForm = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const correctEl = document.getElementById("correct-answer");

let currentQuestion = 0;
let quizData = [];

async function loadSubjects() {
  const res = await fetch("https://quiz-backend-gxk4.onrender.com/subjects");
  const subjects = await res.json();

  subjects.forEach(subject => {
    const btn = document.createElement("button");
    btn.textContent = subject;
    btn.className = "subject-btn";
    btn.onclick = () => startQuiz(subject);
    subjectsDiv.appendChild(btn);
  });
}

async function startQuiz(subject) {
  const res = await fetch(`https://quiz-backend-gxk4.onrender.com/quiz/${subject}`);
  quizData = await res.json();

  subjectsDiv.style.display = "none";
  quizContainer.classList.remove("hidden");
  currentQuestion = 0;
  showQuestion();
}

function showQuestion() {
  correctEl.textContent = "";
  nextBtn.classList.add("hidden");

  const q = quizData[currentQuestion];
  questionEl.textContent = `Q${currentQuestion + 1}. ${q.question}`;

  optionsForm.innerHTML = "";
  for (let key in q.options) {
    const label = document.createElement("label");
    label.className = "option-label";
    label.innerHTML = `
      <input type="radio" name="option" value="${key}" style="display:none"> ${q.options[key]}
    `;
    label.onclick = () => {
      // Remove all highlights and selected classes first
      document.querySelectorAll('.option-label').forEach(l => {
        l.classList.remove("selected", "correct", "wrong");
      });
      label.classList.add("selected");
      showCorrectAnswer(q, key);
    };
    optionsForm.appendChild(label);
  }
}

function showCorrectAnswer(q, selectedKey) {
  const correctKey = q.correct_answer.match(/\((.)\)/)?.[1].toLowerCase();

  // Clear any previous classes on all options
  document.querySelectorAll('.option-label').forEach(label => {
    label.classList.remove("correct", "wrong");
  });

  if (selectedKey === correctKey) {
    correctEl.textContent = "✅ Correct!";
    // Highlight selected label as correct
    const selectedLabel = [...optionsForm.children].find(label => {
      return label.querySelector('input').value === selectedKey;
    });
    if (selectedLabel) selectedLabel.classList.add("correct");
  } else {
    correctEl.textContent = "❌ Wrong!";
    // Highlight selected label as wrong
    const selectedLabel = [...optionsForm.children].find(label => {
      return label.querySelector('input').value === selectedKey;
    });
    if (selectedLabel) selectedLabel.classList.add("wrong");

    // Also highlight correct option
    const correctLabel = [...optionsForm.children].find(label => {
      return label.querySelector('input').value === correctKey;
    });
    if (correctLabel) correctLabel.classList.add("correct");
  }
  nextBtn.classList.remove("hidden");
}

nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    quizContainer.innerHTML = "<h2 style='text-align:center'>🎉 Quiz Finished!</h2>";
  }
};

loadSubjects();
