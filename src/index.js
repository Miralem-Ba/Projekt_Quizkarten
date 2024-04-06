const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestionBtn = document.getElementById("add-flashcard");
const introText = document.getElementById("intro-text");
const closeBtn = document.getElementById("close-btn");
const scoreDisplay = document.getElementById("score-display");
let editBool = false;
let editId = null;
let cardRatings = [];
let totalScore = 0;

document.addEventListener('DOMContentLoaded', () => {
  updateScoreDisplay();
});

function resetForm() {
  question.value = "";
  answer.value = "";
  errorMessage.classList.add("hide");
  addQuestionCard.classList.add("hide");
  container.classList.remove("hide");
  editBool = false;
  editId = null;
}

function toggleIntroText() {
  const flashcards = document.querySelectorAll('.card');
  introText.style.display = flashcards.length === 0 ? 'block' : 'none';
  if (flashcards.length === 0) {
    totalScore = 0;
    updateScoreDisplay();
  }
}

closeBtn.addEventListener("click", () => {
  resetForm();
  toggleIntroText();
});

addQuestionBtn.addEventListener("click", () => {
  addQuestionCard.classList.remove("hide");
  container.classList.add("hide");
  introText.style.display = 'none';
});

cardButton.addEventListener("click", () => {
  let tempQuestion = question.value.trim();
  let tempAnswer = answer.value.trim();
  if (!tempQuestion || !tempAnswer) {
    errorMessage.classList.remove("hide");
    return;
  }
  if (editBool && editId !== null) {
    const cardToUpdate = document.getElementById(editId);
    cardToUpdate.querySelector(".question-div").textContent = tempQuestion;
    cardToUpdate.querySelector(".answer-div").textContent = tempAnswer;
  } else {
    viewlist(tempQuestion, tempAnswer);
  }
  resetForm();
  toggleIntroText();
});

function viewlist(questionText, answerText) {
  const listCard = document.querySelector(".card-list-container");
  const div = document.createElement("div");
  const cardId = Date.now().toString();
  div.classList.add("card");
  div.setAttribute('id', cardId);
  div.innerHTML = `
    <p class="question-div">${questionText}</p>
    <a href="#" class="show-hide-btn">Show/Hide</a>
    <p class="answer-div hide">${answerText}</p>
    <div class="buttons-con">
      <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
      <button class="delete"><i class="fa-solid fa-trash-can"></i></button>
    </div>
    <div class="rating-con">
      <span class="rate" data-score="0">0 Punkte</span> |
      <span class="rate" data-score="1">1 Punkt</span> |
      <span class="rate" data-score="2">2 Punkte</span>
    </div>
  `;

  div.querySelector(".show-hide-btn").addEventListener("click", (e) => {
    e.preventDefault();
    div.querySelector(".answer-div").classList.toggle("hide");
  });

  const rateButtons = div.querySelectorAll('.rate');
rateButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    const score = parseInt(this.getAttribute('data-score'));
    rateCard(cardId, score);
    updateScoreDisplay();
  });
});

div.querySelector(".delete").addEventListener("click", () => {
  removeCardAndScore(cardId);
});

  div.querySelector(".edit").addEventListener("click", () => {
    editBool = true; 
    editId = div.id;
    question.value = div.querySelector(".question-div").textContent;
    answer.value = div.querySelector(".answer-div").textContent;
    addQuestionCard.classList.remove("hide");
    container.classList.add("hide");
  });

  div.querySelector(".delete").addEventListener("click", () => {
    removeCardAndScore(cardId);
  });

  listCard.appendChild(div);
  cardRatings.push({ id: cardId, score: -1 });
}

function rateCard(cardId, score) {
  const cardIndex = cardRatings.findIndex(card => card.id === cardId);
  if (cardIndex !== -1) {
    if (cardRatings[cardIndex].score !== -1) {
      totalScore -= cardRatings[cardIndex].score;
    }
    cardRatings[cardIndex].score = score;
    totalScore += score;
    updateScoreDisplay();
  }
}

function removeCardAndScore(cardId) {
  const index = cardRatings.findIndex(card => card.id === cardId);
  if (index !== -1) {
    if (cardRatings[index].score !== -1) {
      totalScore -= cardRatings[index].score;
    }
    cardRatings.splice(index, 1);
    document.getElementById(cardId).remove();
    updateScoreDisplay();
  }
  toggleIntroText();
}

function updateScoreDisplay() {
  scoreDisplay.textContent = 'Gesamtpunktzahl: ' + totalScore;
}

function sortCards() {
  const listCard = document.querySelector(".card-list-container");
  listCard.innerHTML = '';
  cardRatings.sort((a, b) => a.score - b.score);
  cardRatings.forEach(cardRating => {
    const cardElement = document.getElementById(cardRating.id);
    if (cardElement) {
      listCard.appendChild(cardElement);
    }
  });
}
