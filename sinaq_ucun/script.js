let questions = []; 
let currentIdx = 0; 
let answers = []; 
let shown = [];
let timer; 
let seconds = 0;
let starredIds = JSON.parse(localStorage.getItem('starred-questions') || '[]');

// Fisher-Yates Shuffle Alqoritmi (Tam qarışdırma)
function shuffleArray(array) {
    let newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

function initTheme() {
    const saved = localStorage.getItem('bio-theme') || 'light-theme';
    document.body.className = saved;
    document.getElementById('themeBtn').innerText = saved === 'light-theme' ? '🌙 Dark Mode' : '☀️ Light Mode';
}
initTheme();

function toggleTheme() {
    const body = document.body;
    const current = body.classList.contains('light-theme') ? 'dark-theme' : 'light-theme';
    body.className = current;
    localStorage.setItem('bio-theme', current);
    document.getElementById('themeBtn').innerText = current === 'light-theme' ? '🌙 Dark Mode' : '☀️ Light Mode';
}

function updateStarUI() {
    const count = starredIds.length;
    document.getElementById('starCountDisplay').innerText = `Ulduzlu suallar: ${count}`;
    document.getElementById('starModeBtn').style.display = count > 0 ? 'block' : 'none';
}
updateStarUI();

function startTest(starMode) {
    let source = starMode ? questionsData.filter(q => starredIds.includes(q.question_number)) : [...questionsData];
    
    if (!starMode) {
        const s = parseInt(document.getElementById('startRange').value);
        const e = parseInt(document.getElementById('endRange').value);
        source = source.filter(q => {
            let num = parseInt(q.question_number);
            return num >= s && num <= e;
        });
    }

    const n = parseInt(document.getElementById('numQuestions').value);
    
    if (document.getElementById('orderType').value === 'random') {
        source = shuffleArray(source);
    }
    
    questions = source.slice(0, n);
    if (questions.length === 0) { alert("Sual tapılmadı!"); return; }

    answers = new Array(questions.length).fill(null);
    shown = new Array(questions.length).fill(false);
    
    questions.forEach(q => {
        q.opts = shuffleArray([q.correct_answer, ...q.other_answers]);
    });

    document.getElementById('settings').style.display = 'none';
    document.getElementById('test').style.display = 'block';
    
    timer = setInterval(() => {
        seconds++;
        const m = Math.floor(seconds/60).toString().padStart(2,'0');
        const sec = (seconds%60).toString().padStart(2,'0');
        document.getElementById('timerDisplay').innerText = `${m}:${sec}`;
    }, 1000);
    showQuestion();
}

function showQuestion() {
    const q = questions[currentIdx];
    const userAns = answers[currentIdx];
    const isAuto = document.getElementById('autoCheck').checked;

    document.getElementById('counterText').innerText = `Sual ${currentIdx + 1} / ${questions.length} (№${q.question_number})`;
    document.getElementById('progressBar').style.width = `${((currentIdx + 1) / questions.length) * 100}%`;
    document.getElementById('currentStarBtn').className = `star-btn ${starredIds.includes(q.question_number) ? 'active' : ''}`;

    let html = `<h2 style="margin-top:20px; line-height:1.4; padding-right:50px;">${q.question}</h2>`;
    q.opts.forEach(opt => {
        let cls = "";
        if (shown[currentIdx] || (isAuto && userAns)) {
            if (opt === q.correct_answer) cls = "correct-box";
            else if (opt === userAns) cls = "wrong-box";
        } else if (userAns === opt) cls = "selected-box";
        html += `<div class="opt-card ${cls}" onclick="selectAnswer('${opt.replace(/'/g, "\\'")}')">${opt}</div>`;
    });
    document.getElementById('questionContainer').innerHTML = html;
    document.getElementById('prevBtn').disabled = (currentIdx === 0);
    document.getElementById('nextBtn').disabled = (currentIdx === questions.length - 1);
}

function toggleStar() {
    const id = questions[currentIdx].question_number;
    if (starredIds.includes(id)) {
        starredIds = starredIds.filter(i => i !== id);
    } else {
        starredIds.push(id);
    }
    localStorage.setItem('starred-questions', JSON.stringify(starredIds));
    showQuestion();
    updateStarUI();
}

function selectAnswer(ans) {
    if (shown[currentIdx] || (document.getElementById('autoCheck').checked && answers[currentIdx])) return;
    answers[currentIdx] = ans;
    showQuestion();
}

function forceShowAnswer() { shown[currentIdx] = true; showQuestion(); }
function nextQuestion() { if(currentIdx < questions.length-1) { currentIdx++; showQuestion(); window.scrollTo(0,0); } }
function prevQuestion() { if(currentIdx > 0) { currentIdx--; showQuestion(); window.scrollTo(0,0); } }

function finishTest() {
    clearInterval(timer);
    let c = 0, w = 0, e = 0, list = "";
    questions.forEach((q, i) => {
        if (!answers[i]) e++;
        else if (answers[i] === q.correct_answer) c++;
        else {
            w++;
            list += `<div style="border-left:5px solid red; background:rgba(0,0,0,0.02); padding:15px; margin-bottom:10px; border-radius:10px;">
                <b>Sual ${q.question_number}:</b> ${q.question}<br>
                <span style="color:#10b981">✔ Düz: ${q.correct_answer}</span><br>
                <span style="color:#ef4444">✖ Sizin: ${answers[i]}</span></div>`;
        }
    });
    document.getElementById('test').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('statsSummary').innerHTML = `
        <div class="res-grid">
            <div class="res-item" style="background:#dcfce7; color:#166534">Düz: ${c}</div>
            <div class="res-item" style="background:#fee2e2; color:#991b1b">Səhv: ${w}</div>
            <div class="res-item" style="background:#f1f5f9; color:#475569">Boş: ${e}</div>
        </div>`;
    document.getElementById('wrongQuestionsList').innerHTML = list;
    window.scrollTo(0,0);
}