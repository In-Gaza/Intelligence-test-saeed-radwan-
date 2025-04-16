const questions = [
  { type: 'hard', format: 'mcq', q: 'ما اسم أقدم جامعة في التاريخ لا تزال تعمل حتى اليوم؟', a: 'القرويين', choices: ['الأزهر', 'السوربون', 'القرويين'] },
  { type: 'hard', format: 'text', q: 'ما اسم العنصر الذي رمزه الكيميائي W؟', a: 'تنغستن' },
  { type: 'hard', format: 'mcq', q: 'في أي سنة وقعت معركة بلاط الشهداء؟', a: '732', choices: ['732', '1453', '1258'] },
  { type: 'hard', format: 'text', q: 'ما هو اسم المجرة الأقرب إلى درب التبانة؟', a: 'المراة المسلسلة' },
  { type: 'hard', format: 'mcq', q: 'ما هو العضو الذي لا يصله الدم في جسم الإنسان؟', a: 'قرنية العين', choices: ['الطحال', 'الكبد', 'قرنية العين'] },
  { type: 'hard', format: 'text', q: 'ما هو أعمق نقطة في محيطات العالم؟', a: 'خندق ماريانا' },
  { type: 'hard', format: 'mcq', q: 'من هو مؤسس علم الاجتماع؟', a: 'ابن خلدون', choices: ['ابن سينا', 'الخوارزمي', 'ابن خلدون'] },
  { type: 'hard', format: 'text', q: 'ما اسم أول قمر صناعي أُطلق إلى الفضاء؟', a: 'سبوتنيك' },
  { type: 'hard', format: 'mcq', q: 'من هو العالم الذي اكتشف البنسلين؟', a: 'ألكسندر فليمنغ', choices: ['لويس باستور', 'ألكسندر فليمنغ', 'روبرت كوخ'] },
  { type: 'hard', format: 'text', q: 'ما هي الدولة التي استُخدمت فيها القنبلة الذرية لأول مرة؟', a: 'اليابان' },
  { type: 'hard', format: 'mcq', q: 'ما اسم المعركة التي هزم فيها صلاح الدين الصليبيين؟', a: 'حطين', choices: ['حطين', 'عين جالوت', 'اليرموك'] },
  { type: 'hard', format: 'text', q: 'من هو الصحابي الذي أطلق عليه لقب سيف الله المسلول؟', a: 'خالد بن الوليد' },
  { type: 'hard', format: 'mcq', q: 'ما اسم القائد الذي حرر القدس؟', a: 'صلاح الدين الايوبي', choices: ['عمر بن الخطاب', 'صلاح الدين الأيوبي', 'طارق بن زياد'] },
  { type: 'hard', format: 'text', q: 'في أي عام وقعت نكبة فلسطين؟', a: '1948' },
  { type: 'hard', format: 'mcq', q: 'ما اسم المسجد الذي أُسري إليه النبي محمد؟', a: 'الأقصى', choices: ['النبوي', 'الحرام', 'الأقصى'] },
  { type: 'hard', format: 'text', q: 'من هو أول شهيد في الإسلام؟', a: 'سمية' },
  { type: 'hard', format: 'mcq', q: 'ما اسم الدولة التي كانت تُسمى أرض كنعان؟', a: 'فلسطين', choices: ['العراق', 'لبنان', 'فلسطين'] },
  { type: 'hard', format: 'text', q: 'ما اسم أول شهيد فلسطيني في انتفاضة الأقصى؟', a: 'محمد الدرة' },
  { type: 'hard', format: 'mcq', q: 'من هو الخليفة الذي بنى قبة الصخرة؟', a: 'عبد الملك بن مروان', choices: ['عمر بن الخطاب', 'عبد الملك بن مروان', 'الوليد بن عبد الملك'] },
  { type: 'hard', format: 'text', q: 'ما المدينة التي كانت تُعتبر عاصمة فلسطين قبل الاحتلال؟', a: 'القدس' }
];

let current = 0, score = 0, timer, timePassed = 0;
function speakQuestion(text) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    speechSynthesis.speak(utterance);
  }
}

function showQuestion() {
  const q = questions[current];
  const qText = document.getElementById('questionText');
  const options = document.getElementById('optionsContainer');
  const textInput = document.getElementById('textAnswer');
  const nextBtn = document.getElementById('nextButton');
  const feedback = document.getElementById('feedback');
  const timerDisplay = document.getElementById('timer');

  qText.textContent = q.q;
  speakQuestion(q.q);
  options.innerHTML = '';
  feedback.textContent = '';
  nextBtn.classList.add('hidden');
  clearInterval(window.counterInterval);
  textInput.classList.add('hidden');

  let timeLimit = 15;
  let secondsLeft = timeLimit;
  timePassed = 0;
  timerDisplay.textContent = `الوقت المتبقي: ${secondsLeft} ثانية`;

  let answered = false;

  window.counterInterval = setInterval(() => {
    secondsLeft--;
    timePassed++;
    timerDisplay.textContent = `الوقت المتبقي: ${secondsLeft} ثانية | المدة: ${timePassed} ثانية`;
    if (secondsLeft <= 0 && !answered) {
      clearInterval(window.counterInterval);
      feedback.textContent = '⏰ انتهى الوقت!';
      feedback.style.color = 'orange';
      setTimeout(nextQuestion, 1500);
    }
  }, 1000);

  if (q.format === 'mcq') {
    q.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.textContent = choice;
      btn.onclick = () => {
        if (!answered) {
          answered = true;
          checkAnswer(choice);
        }
      };
      options.appendChild(btn);
    });
  } else {
    textInput.classList.remove('hidden');
    textInput.value = '';
    textInput.onkeyup = (e) => {
      if (e.key === 'Enter' && !answered) {
        answered = true;
        checkAnswer(textInput.value);
      }
    };
  }
}

function checkAnswer(answer) {
  const q = questions[current];
  const feedback = document.getElementById('feedback');
  const nextBtn = document.getElementById('nextButton');
  const correct = answer.trim().toLowerCase() === q.a.toLowerCase();
  if (correct) score++;
  feedback.textContent = correct ? '✅ صحيح!' : '❌ خطأ';
  feedback.style.color = correct ? 'green' : 'red';
  nextBtn.classList.remove('hidden');
  clearInterval(window.counterInterval);
}

function nextQuestion() {
  current++;
  if (current >= questions.length) {
    const percent = Math.round((score / questions.length) * 100);
    let message = '', sticker = '';

    if (percent >= 90) {
      message = '😎 عبقري! نتيجتك رائعة';
    } else if (percent >= 70) {
      message = '👏 ممتاز! تابع التألق';
    } else if (percent >= 50) {
      message = '🙂 جيد، لكن بإمكانك الأفضل';
    } else {
      message = '🤣 حاول مجددًا! وينك من الذكاء؟';
      sticker = '<img src="https://i.imgur.com/2YfW9nC.png" alt="ملصق ساخر" style="max-width:100px;margin:10px auto">';
    }

    const qBox = document.getElementById('questionBox');
    qBox.innerHTML = `
<h2>✅ انتهى الاختبار</h2>
<p>أجبت ${score} من ${questions.length} سؤال بشكل صحيح</p>
<div style="font-size:1.3rem;margin:10px 0">🔢 معدل ذكائك: <strong>${percent}%</strong></div>
${sticker}
<div style="margin:15px 0;font-weight:bold;">${message}</div>
<button onclick="restartQuiz()">🔁 أعد المحاولة</button>
`;
    return;
  }
  showQuestion();
}

function restartQuiz() {
  location.reload();
}

window.onload = showQuestion;
