// Firebase Configuration (Replace with your Firebase credentials)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_APP.firebaseapp.com",
    projectId: "YOUR_APP",
    storageBucket: "YOUR_APP.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Quiz questions
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "London"],
      answer: "Paris"
    },
    {
      question: "Which language is used for web apps?",
      options: ["Python", "Java", "HTML", "All"],
      answer: "All"
    },
    {
      question: "Who is the founder of Microsoft?",
      options: ["Steve Jobs", "Bill Gates", "Elon Musk", "Mark Zuckerberg"],
      answer: "Bill Gates"
    }
  ];
  
  let currentQuestion = 0;
  let score = 0;
  let timer;
  let timeLeft = 10;
  
  // DOM elements
  const questionEl = document.getElementById('question');
  const answersEl = document.getElementById('answers');
  const nextBtn = document.getElementById('next');
  const resultEl = document.getElementById('result');
  const timerEl = document.getElementById('timer');
  const tryAgainBtn = document.getElementById('tryAgain');
  
  // Load the current question
  function loadQuestion() {
    const q = questions[currentQuestion];
    questionEl.textContent = q.question;
    answersEl.innerHTML = '';
  
    // Create list items for the options
    q.options.forEach(option => {
      const li = document.createElement('li');
      li.textContent = option;
      li.addEventListener('click', () => {
        document.querySelectorAll('li').forEach(el => el.classList.remove('selected'));
        li.classList.add('selected');
      });
      answersEl.appendChild(li);
    });
  
    startTimer();
  }
  
  // Start the timer for each question
  function startTimer() {
    timeLeft = 10;
    timerEl.textContent = `Time Left: ${timeLeft}s`;
    timer = setInterval(() => {
      timeLeft--;
      timerEl.textContent = `Time Left: ${timeLeft}s`;
      if (timeLeft === 0) {
        clearInterval(timer);
        handleNext();
      }
    }, 1000);
  }
  
  // Handle the next question or show the result
  function handleNext() {
    const selected = document.querySelector('li.selected');
    if (selected && selected.textContent === questions[currentQuestion].answer) {
      score++;
    }
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      showResult();
    }
  }
  
  // Show the result and save it to Firebase
  function showResult() {
    questionEl.classList.add('hidden');
    answersEl.classList.add('hidden');
    nextBtn.classList.add('hidden');
    timerEl.classList.add('hidden');
    resultEl.classList.remove('hidden');
    resultEl.textContent = `You scored ${score} out of ${questions.length}! 🎉`;
  
    // Save score to Firebase
    db.collection("quizScores").add({
      score: score,
      timestamp: new Date()
    })
    .then(() => console.log("Score saved!"))
    .catch(error => console.error("Error saving score:", error));
  
    // Show Try Again Button
    tryAgainBtn.classList.remove('hidden');
  }
  
  // Handle the next button click
  nextBtn.addEventListener('click', () => {
    clearInterval(timer);
    handleNext();
  });
  
  // Dark mode toggle
  document.getElementById('themeToggle').addEventListener('change', () => {
    document.body.classList.toggle('dark');
  });
  
  // Try Again functionality
  tryAgainBtn.addEventListener('click', () => {
    // Reset values and UI elements
    currentQuestion = 0;
    score = 0;
    resultEl.classList.add('hidden');
    tryAgainBtn.classList.add('hidden');
    questionEl.classList.remove('hidden');
    answersEl.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
    timerEl.classList.remove('hidden');
  
    // Reload the first question
    loadQuestion();
  });
  
  // Load the first question
  loadQuestion();
  