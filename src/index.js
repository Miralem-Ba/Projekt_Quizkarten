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

// Function to reset form and hide/show appropriate elements
function resetForm() {
  question.value = "";
  answer.value = "";
  errorMessage.classList.add("hide");
  addQuestionCard.classList.add("hide");
  container.classList.remove("hide");
  editBool = false;
  editId = null;
}

// Toggle Intro Text based on presence of cards
function toggleIntroText() {
  const flashcards = document.querySelectorAll('.card');
  introText.style.display = flashcards.length === 0 ? 'block' : 'none';
}

// Hide Create flashcard Card and reset form
closeBtn.addEventListener("click", () => {
  resetForm();
  toggleIntroText();
});

// Add question when user clicks 'Add Flashcard' button
addQuestionBtn.addEventListener("click", () => {
  addQuestionCard.classList.remove("hide");
  container.classList.add("hide");
  introText.style.display = 'none';
});

// Submit Question
cardButton.addEventListener("click", () => {
  let tempQuestion = question.value.trim();
  let tempAnswer = answer.value.trim();
  if (!tempQuestion || !tempAnswer) {
    errorMessage.classList.remove("hide");
    return;
  }
  if (editBool && editId !== null) {
    // Update the existing card
    const cardToUpdate = document.getElementById(editId);
    cardToUpdate.querySelector(".question-div").textContent = tempQuestion;
    cardToUpdate.querySelector(".answer-div").textContent = tempAnswer;
  } else {
    // Add a new card
    viewlist(tempQuestion, tempAnswer);
  }
  resetForm();
  toggleIntroText();
});

// Card Generate
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

  // Event listeners for the buttons
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

  div.querySelector(".edit").addEventListener("click", () => {
    editBool = true; 
    editId = div.id;
    question.value = div.querySelector(".question-div").textContent;
    answer.value = div.querySelector(".answer-div").textContent;
    addQuestionCard.classList.remove("hide");
    container.classList.add("hide");
  });

  div.querySelector(".delete").addEventListener("click", () => {
    div.remove();
    // Remove the card from the cardRatings array
    const index = cardRatings.findIndex(card => card.id === cardId);
    if (index !== -1) {
      cardRatings.splice(index, 1);
    }
    toggleIntroText();
  });

  listCard.appendChild(div);
  // Initially store the card with a rating of -1 to signify unrated
  cardRatings.push({ id: cardId, score: -1 });
}

// Function to rate a card and sort the cards
function rateCard(cardId, score) {
  const cardIndex = cardRatings.findIndex(card => card.id === cardId);
  if (cardIndex !== -1) {
    if (cardRatings[cardIndex].score !== -1) {
      // Ziehe die alte Punktzahl ab, wenn sie bereits bewertet wurde
      totalScore -= cardRatings[cardIndex].score;
    }
    // Aktualisiere die Punktzahl der Karte
    cardRatings[cardIndex].score = score;
    // Addiere die neue Punktzahl zur Gesamtpunktzahl
    totalScore += score;
    // Aktualisiere die Punkteanzeige
    updateScoreDisplay();
  }

  // Sortiere die Karten basierend auf ihrer Bewertung
  sortCards();
}


function updateScoreDisplay() {
  scoreDisplay.textContent = 'Gesamtpunktzahl: ' + totalScore;
}

// Function to sort the cards
function sortCards() {
  const listCard = document.querySelector(".card-list-container");
  // Erstelle ein Array aus den DOM-Elementen (Flashcards)
  let cardsArray = Array.from(listCard.children);

  // Sortiere das Array basierend auf den gespeicherten Bewertungen
  cardsArray.sort((a, b) => {
    let scoreA = cardRatings.find(rating => rating.id === a.id).score;
    let scoreB = cardRatings.find(rating => rating.id === b.id).score;
    return scoreA - scoreB;
  });

  // Füge die sortierten Karten wieder in den Container ein
  cardsArray.forEach(card => {
    listCard.appendChild(card);
  });
}
