const habitForm = document.getElementById('habit-form');
const habitInput = document.getElementById('habit-input');
const habitList = document.getElementById('habit-list');
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');
const quoteText = document.getElementById('quote-text');
const themeToggle = document.getElementById('theme-toggle');

let habits = JSON.parse(localStorage.getItem('habits')) || [];

const quotes = [
  "Discipline is the bridge between goals and accomplishment.",
  "Success is the sum of small efforts, repeated daily.",
  "Your future is created by what you do today, not tomorrow.",
  "Motivation gets you going, habit keeps you growing."
];

function displayQuote() {
  quoteText.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

displayQuote();

// Daily reset logic
const today = new Date().toDateString();
const lastUpdated = localStorage.getItem('lastUpdated');
if (today !== lastUpdated) {
  habits = habits.map(h => ({ ...h, completed: false }));
  localStorage.setItem('lastUpdated', today);
  localStorage.setItem('habits', JSON.stringify(habits));
}

function updateProgress() {
  const total = habits.length;
  const completed = habits.filter(h => h.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressText.textContent = `${percent}% Completed`;
  progressBar.style.width = `${percent}%`;
}

function saveHabits() {
  localStorage.setItem('habits', JSON.stringify(habits));
}

function renderHabits() {
  habitList.innerHTML = '';
  habits.forEach((habit, index) => {
    const habitEl = document.createElement('div');
    habitEl.classList.add('habit');
    if (habit.completed) habitEl.classList.add('completed');

    habitEl.innerHTML = `
      <div>
        <span>${habit.text}</span>
        <div class="streak">🔥 Streak: ${habit.streak || 0} day(s)</div>
      </div>
      <button onclick="toggleHabit(${index})">${habit.completed ? 'Undo' : 'Done'}</button>
    `;
    habitList.appendChild(habitEl);
  });
  updateProgress();
}

function toggleHabit(index) {
  if (!habits[index].completed) {
    habits[index].streak = (habits[index].streak || 0) + 1;
  } else {
    habits[index].streak = 0;
  }
  habits[index].completed = !habits[index].completed;
  saveHabits();
  renderHabits();
}

habitForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = habitInput.value.trim();
  if (text !== '') {
    habits.push({ text, completed: false, streak: 0 });
    habitInput.value = '';
    saveHabits();
    renderHabits();
  }
});

// Theme toggle
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') document.body.classList.add('light-mode');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
});

renderHabits();
