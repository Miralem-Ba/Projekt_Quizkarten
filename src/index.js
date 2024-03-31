const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById( "save-btn" );
const question = document.getElementById("question");
const answer = document.getElementById("answer") ;
const errorMessage = document.getElementById( "error" ) ;
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
let editBool = false;


//Add question when user clicks 'Add Flashcard' button
addQuestion.addEventListener("click", () => { 
  container.classList.add("hide");
  question.value = "";
  answer.value = "" ;
  addQuestionCard.classList.remove("hide");
});
