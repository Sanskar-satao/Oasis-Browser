

/* ---------- 1. Tab Navigation & Theme ---------- */
function switchTab(tab) {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelector(`.tab[onclick*="${tab}"]`).classList.add("active");
    document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));
    document.getElementById(tab + "Tab").classList.add("active");
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

/* ---------- 2. Math Solver Engine ---------- */
function solveProblem() {
    const input = document.getElementById('question').value;
    const solutionDiv = document.getElementById('solution');
    solutionDiv.innerHTML = '';

    try {
        let steps = [];
        let expr = input.replace(/\s+/g, '');
        steps.push(`Original: ${expr}`);

        while (/\([^\(\)]+\)/.test(expr)) {
            expr = expr.replace(/\([^\(\)]+\)/g, (match) => {
                let val = eval(match);
                steps.push(`Evaluated ${match} = ${val}`);
                return val;
            });
        }

        let final = eval(expr);
        steps.push(`Final result: ${expr} = ${final}`);
        solutionDiv.innerHTML = steps.map(s => `<div>${s}</div>`).join('');
    } catch (e) {
        solutionDiv.innerHTML = '❌ Invalid expression!';
    }
}

/* ---------- 3. Quiz Engine ---------- */
let currentAnswers = [];
let quizTime = 0;
let quizTimerInterval = null;

function generateQuiz() {
    const grade = parseInt(document.getElementById('class').value);
    const numQ = parseInt(document.getElementById('numQuestions').value);
    const type = document.getElementById('qType').value;
    const container = document.getElementById('quizQuestions');

    container.innerHTML = '';
    currentAnswers = [];

    for (let i = 0; i < numQ; i++) {
        const div = document.createElement('div');
        div.classList.add('quiz-question');
        let question = '', correct;

        if (type === 'mcq') {
            let a = Math.floor(Math.random() * (grade * 20)) + 1;
            let b = Math.floor(Math.random() * (grade * 20)) + 1;
            const op = ['+', '-', '*'][Math.floor(Math.random() * 3)];
            question = `${a} ${op} ${b}`;
            correct = eval(question);
            let choices = [correct, correct + 1, correct - 1, correct + 2].sort(() => 0.5 - Math.random());
            currentAnswers.push(correct);
            div.innerHTML = `<label>Q${i + 1}: ${question} = </label>
        <div class="quiz-options">
          ${choices.map(c => `<button onclick="checkAnswer(${i},${c}, this)">${c}</button>`).join('')}
        </div>
        <div class="feedback" id="feedback${i}"></div>`;
        }

        else if (type === 'tf') {
            let x = Math.floor(Math.random() * 50) + 1;
            let y = Math.floor(Math.random() * 50) + 1;
            question = `Is ${x}+${y} even?`;
            correct = ((x + y) % 2 === 0);
            currentAnswers.push(correct);
            div.innerHTML = `<label>Q${i + 1}: ${question}</label>
        <div class="quiz-options">
          <button onclick="checkAnswer(${i},true,this)">True</button>
          <button onclick="checkAnswer(${i},false,this)">False</button>
        </div>
        <div class="feedback" id="feedback${i}"></div>`;
        }

        container.appendChild(div);
    }

    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('quizResult').innerText = '';
    startQuizTimer(300); // 5 minutes
}

/* ---------- 4. Answer Checking ---------- */
function checkAnswer(i, val, btn) {
    const fb = document.getElementById(`feedback${i}`);
    btn.parentElement.querySelectorAll('button').forEach(b => b.disabled = true);

    if (val === currentAnswers[i]) {
        fb.innerText = '✅ Correct';
        fb.style.color = 'lime';
    } else {
        fb.innerText = '❌ Wrong';
        fb.style.color = 'red';
    }

    const correctCount = [...document.querySelectorAll('.feedback')]
        .filter(f => f.innerText.includes('✅')).length;
    const total = currentAnswers.length;

    document.getElementById('progressBar').style.width = `${(correctCount / total) * 100}%`;
    document.getElementById('quizResult').innerText = `Score: ${correctCount} / ${total}`;

    if (correctCount === total && total > 0) launchConfetti();
    showMotivation();
}

/* ---------- 5. Confetti Celebration ---------- */
function launchConfetti() {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.top = '0';
    confetti.style.left = '0';
    confetti.style.width = '100%';
    confetti.style.height = '100%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    document.body.appendChild(confetti);

    for (let i = 0; i < 100; i++) {
        let p = document.createElement('div');
        p.style.position = 'absolute';
        p.style.width = '10px';
        p.style.height = '10px';
        p.style.background = ['red', 'yellow', 'lime', 'cyan', 'magenta'][Math.floor(Math.random() * 5)];
        p.style.top = Math.random() * 100 + '%';
        p.style.left = Math.random() * 100 + '%';
        p.style.opacity = 0.8;
        p.style.borderRadius = '50%';
        p.style.animation = `fall${i} 3s linear forwards`;
        confetti.appendChild(p);

        let style = document.createElement('style');
        style.innerHTML = `@keyframes fall${i}{0%{transform:translateY(0) rotate(0deg);}100%{transform:translateY(600px) rotate(360deg);opacity:0;}}`;
        document.head.appendChild(style);
    }

    setTimeout(() => confetti.remove(), 3500);
}

/* ---------- 6. Motivation Popups ---------- */
function showMotivation() {
    const msgs = ['🌟 Keep Going!', '💡 You Can Do It!', '🚀 Almost There!', '🏆 Great Effort!'];
    const msgDiv = document.createElement('div');
    msgDiv.style.position = 'fixed';
    msgDiv.style.top = '20px';
    msgDiv.style.right = '20px';
    msgDiv.style.background = 'rgba(0,255,255,0.3)';
    msgDiv.style.padding = '15px';
    msgDiv.style.borderRadius = '15px';
    msgDiv.style.fontSize = '18px';
    msgDiv.style.zIndex = '999';
    msgDiv.innerText = msgs[Math.floor(Math.random() * msgs.length)];
    document.body.appendChild(msgDiv);
    setTimeout(() => msgDiv.remove(), 2500);
}

/* ---------- 7. Quiz Timer ---------- */
function startQuizTimer(seconds) {
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    quizTime = seconds;
    const timerDiv = document.getElementById('quizTimer');

    quizTimerInterval = setInterval(() => {
        if (quizTime <= 0) {
            clearInterval(quizTimerInterval);
            alert('⏰ Time Up!');
            return;
        }
        const m = Math.floor(quizTime / 60);
        const s = quizTime % 60;
        timerDiv.innerText = `Time Left: ${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        quizTime--;
    }, 1000);
}

/* ---------- 8. Tools Section ---------- */
function openUnitConverter() {
    document.getElementById("toolContainer").innerHTML = `
    <h3>📏 Unit Converter</h3>
    <input id="valueInput" placeholder="Enter value">
    <select id="unitSelect">
      <option value="cmToM">cm → m</option>
      <option value="mToKm">m → km</option>
      <option value="cToF">°C → °F</option>
      <option value="fToC">°F → °C</option>
    </select>
    <button onclick="convertUnit()">Convert</button>
    <div id="convertResult"></div>`;
}

function convertUnit() {
    const val = parseFloat(document.getElementById("valueInput").value);
    const unit = document.getElementById("unitSelect").value;
    let res = "";
    if (unit === "cmToM") res = (val / 100) + " m";
    else if (unit === "mToKm") res = (val / 1000) + " km";
    else if (unit === "cToF") res = ((val * 9 / 5) + 32) + " °F";
    else if (unit === "fToC") res = ((val - 32) * 5 / 9) + " °C";
    document.getElementById("convertResult").innerText = "Result: " + res;
}

function openFormulaSheet() {
    document.getElementById("toolContainer").innerHTML = `
    <h3>📚 Formula Sheet</h3>
    <ul>
      <li>Area of Circle = πr²</li>
      <li>Pythagoras = a² + b² = c²</li>
      <li>Speed = Distance / Time</li>
      <li>Force = Mass × Acceleration</li>
      <li>Volume of Cube = a³</li>
      <li>surface area of cube = 6a²</li>
    </ul>`;
}

function openNotes() {
    document.getElementById("toolContainer").innerHTML = `
    <h3>📝 Notes</h3>
    <textarea id="notesBox" rows="6" style="width:100%"></textarea>
    <button onclick="saveNotes()">Save Notes</button>`;
    document.getElementById("notesBox").value = localStorage.getItem("oasisNotes") || "";
}

function saveNotes() {
    const text = document.getElementById("notesBox").value;
    localStorage.setItem("oasisNotes", text);
    alert("✅ Notes Saved!");
}

function openDrawing() {
    document.getElementById("toolContainer").innerHTML = `
    <h3>🎨 Drawing Board</h3>
    <canvas id="drawCanvas" width="400" height="300" style="border:1px solid #fff; background:#222;"></canvas>
    <br>
    <button onclick="clearDrawing()">Clear</button>`;
    enableDrawing();
}

function enableDrawing() {
    const canvas = document.getElementById("drawCanvas");
    const ctx = canvas.getContext("2d");
    let drawing = false;

    canvas.onmousedown = () => drawing = true;
    canvas.onmouseup = () => drawing = false;
    canvas.onmousemove = (e) => {
        if (!drawing) return;
        ctx.fillStyle = "cyan";
        ctx.beginPath();
        ctx.arc(e.offsetX, e.offsetY, 3, 0, Math.PI * 2);
        ctx.fill();
    };
}

function clearDrawing() {
    const canvas = document.getElementById("drawCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
/* ---------- Extra Tools ---------- */

function openCalculator() {
    document.getElementById("toolContainer").innerHTML = `
    <h3>🧮 Scientific Calculator</h3>
    <input id="calcInput" placeholder="e.g. sin(30) + sqrt(16)">
    <button onclick="runCalculator()">Calculate</button>
    <div id="calcResult"></div>`;
}

function runCalculator() {
    const expr = document.getElementById("calcInput").value;
    try {
        const res = Function("with(Math){return " + expr + "}")();
        document.getElementById("calcResult").innerText = "Result: " + res;
    } catch {
        document.getElementById("calcResult").innerText = "❌ Invalid Expression!";
    }
}

function openLinearSolver() {
    document.getElementById("toolContainer").innerHTML = `
    <h3>📐 Linear Equation Solver (ax+b=0)</h3>
    <input id="aVal" placeholder="a"> x + 
    <input id="bVal" placeholder="b"> = 0
    <br><br>
    <button onclick="solveLinear()">Solve</button>
    <div id="linearResult"></div>`;
}

function solveLinear() {
    let a = parseFloat(document.getElementById("aVal").value);
    let b = parseFloat(document.getElementById("bVal").value);
    if (a === 0) {
        document.getElementById("linearResult").innerText = "❌ Not a valid equation!";
    } else {
        let x = -b / a;
        document.getElementById("linearResult").innerText = "Solution: x = " + x;
    }
}

function openQuadraticSolver() {
    document.getElementById("toolContainer").innerHTML = `
    <h3>📊 Quadratic Solver (ax²+bx+c=0)</h3>
    <input id="qa" placeholder="a"> x² +
    <input id="qb" placeholder="b"> x +
    <input id="qc" placeholder="c"> = 0
    <br><br>
    <button onclick="solveQuadratic()">Solve</button>
    <div id="quadResult"></div>`;
}

function solveQuadratic() {
    let a = parseFloat(document.getElementById("qa").value);
    let b = parseFloat(document.getElementById("qb").value);
    let c = parseFloat(document.getElementById("qc").value);
    let d = b * b - 4 * a * c;
    if (d < 0) {
        document.getElementById("quadResult").innerText = "❌ No real roots!";
    } else {
        let x1 = (-b + Math.sqrt(d)) / (2 * a);
        let x2 = (-b - Math.sqrt(d)) / (2 * a);
        document.getElementById("quadResult").innerText = `Solutions: x₁=${x1}, x₂=${x2}`;
    }
}

function openPrimeChecker() {
    document.getElementById("toolContainer").innerHTML = `
    <h3>🔢 Prime Number Checker</h3>
    <input id="primeInput" placeholder="Enter number">
    <button onclick="checkPrime()">Check</button>
    <div id="primeResult"></div>`;
}

function checkPrime() {
    let n = parseInt(document.getElementById("primeInput").value);
    if (n < 2) return document.getElementById("primeResult").innerText = "❌ Not Prime";
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return document.getElementById("primeResult").innerText = "❌ Not Prime";
    }
    document.getElementById("primeResult").innerText = "✅ Prime Number!";
}

function openRandomProblem() {
    document.getElementById("toolContainer").innerHTML = `
    <h3>🎲 Random Math Problem</h3>
    <button onclick="generateProblem()">New Problem</button>
    <div id="randomProb"></div>`;
}

function generateProblem() {
    let a = Math.floor(Math.random() * 20) + 1;
    let b = Math.floor(Math.random() * 20) + 1;
    let ops = ['+', '-', '*', '/'];
    let op = ops[Math.floor(Math.random() * 4)];
    let prob = `${a} ${op} ${b}`;
    document.getElementById("randomProb").innerText = `Solve: ${prob} = ?`;
}

function openPercentageCalc() {
    document.getElementById("toolContainer").innerHTML = `
    <h3>📈 Percentage Calculator</h3>
    <input id="percVal" placeholder="Value"> is what % of 
    <input id="percTotal" placeholder="Total"> ?
    <br><br>
    <button onclick="calcPercentage()">Calculate</button>
    <div id="percResult"></div>`;
}

function calcPercentage() {
    let val = parseFloat(document.getElementById("percVal").value);
    let total = parseFloat(document.getElementById("percTotal").value);
    if (isNaN(val) || isNaN(total) || total === 0) {
        document.getElementById("percResult").innerText = "❌ Invalid Input!";
    } else {
        let pct = (val / total * 100).toFixed(2);
        document.getElementById("percResult").innerText = `${val} is ${pct}% of ${total}`;
    }
}
