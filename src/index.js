const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestionBtn = document.getElementById("add-flashcard");
const introText = document.getElementById("intro-text");
const closeBtn = document.getElementById("close-btn");
let editBool = false;
let editId = null;

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
    return; // Prevent further actions if fields are empty
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
  div.classList.add("card");
  div.setAttribute('id', Date.now().toString()); // Unique ID for the card
  div.innerHTML = `
    <p class="question-div">${questionText}</p>
    <a href="#" class="show-hide-btn">Show/Hide</a>
    <p class="answer-div hide">${answerText}</p>
    <div class="buttons-con">
      <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
      <button class="delete"><i class="fa-solid fa-trash-can"></i></button>
    </div>
  `;

  // Event listeners for the buttons
  div.querySelector(".show-hide-btn").addEventListener("click", (e) => {
    e.preventDefault();
    div.querySelector(".answer-div").classList.toggle("hide");
  });
  div.querySelector(".edit").addEventListener("click", () => {
    editBool = true; // Set editing state
    editId = div.id; // Set the id for the edit
    question.value = div.querySelector(".question-div").textContent;
    answer.value = div.querySelector(".answer-div").textContent;
    addQuestionCard.classList.remove("hide");
    container.classList.add("hide");
  });
  div.querySelector(".delete").addEventListener("click", () => {
    div.remove();
    toggleIntroText();
  });

  listCard.appendChild(div);
}