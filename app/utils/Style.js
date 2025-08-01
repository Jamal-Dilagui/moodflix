 // Dark mode toggle
 function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true' || 
    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
}

// Selection logic
let selectedMood = null;
let selectedTime = null;
let selectedSituation = null;

// Mood selection
document.querySelectorAll('.mood-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.mood-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selectedMood = this.dataset.mood;
        checkSelections();
    });
});

// Time selection
document.querySelectorAll('.time-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.time-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selectedTime = this.dataset.time;
        checkSelections();
    });
});

// Situation selection
document.querySelectorAll('.situation-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.situation-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selectedSituation = this.dataset.situation;
        checkSelections();
    });
});

// Check if all selections are made
function checkSelections() {
    const button = document.getElementById('getRecommendations');
    if (selectedMood && selectedTime && selectedSituation) {
        button.disabled = false;
        button.classList.add('animate-pulse-slow');
    } else {
        button.disabled = true;
        button.classList.remove('animate-pulse-slow');
    }
}

// Get recommendations
document.getElementById('getRecommendations').addEventListener('click', function() {
    if (selectedMood && selectedTime && selectedSituation) {
        // Store selections in localStorage for results page
        localStorage.setItem('userSelections', JSON.stringify({
            mood: selectedMood,
            time: selectedTime,
            situation: selectedSituation
        }));
        
        // Animate button click
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            window.location.href = 'results.html';
        }, 150);
    }
});

// Add hover animations
document.querySelectorAll('.card-hover').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});