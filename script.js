const card = document.getElementById("card");
const bgm = document.getElementById("bgm");
const playArea = document.getElementById("play-area");


const startScreen = document.getElementById("screen-start");
const phraseScreen = document.getElementById("screen-phrase");
const letterScreen = document.getElementById("screen-letter");
const questionScreen = document.getElementById("screen-question");
const yesScreen = document.getElementById("screen-yes");

const btnStart = document.getElementById("btn-start");
const btnNext = document.getElementById("btn-next");
const btnNext2 = document.getElementById("btn-next2");
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");
const btnRestart = document.getElementById("btn-restart");

const heartsLayer = document.getElementById("hearts");

// Arranque desde 3:03 (183 segundos)
const START_AT = 183;

// Intento de autoplay al cargar (en móvil puede fallar)
window.addEventListener("load", () => {
  tryPlayMusic();
});

// Intenta reproducir música
async function tryPlayMusic() {
  try {
    bgm.volume = 0.6;             // volumen (0.0 a 1.0)
    bgm.currentTime = START_AT;  // empieza en 3:03
    await bgm.play();
  } catch (e) {
    // Autoplay bloqueado: se reintentará con interacción del usuario
  }
}

// FIX para algunos navegadores: esperar metadatos antes de setear el tiempo
bgm.addEventListener("loadedmetadata", () => {
  if (bgm.currentTime < START_AT) {
    bgm.currentTime = START_AT;
  }
});


function show(screen) {
  startScreen.classList.add("hidden");
  phraseScreen.classList.add("hidden");
  letterScreen.classList.add("hidden");
  questionScreen.classList.add("hidden");
  yesScreen.classList.add("hidden");
  screen.classList.remove("hidden");
}

/* -------- Música: intentar reproducir -------- */
async function tryPlayMusic() {
  try {
    bgm.volume = 0.6;     // ajusta volumen (0.0 a 1.0)
    await bgm.play();     // puede fallar si no hubo interacción
  } catch (_) {
    // Si el navegador bloquea autoplay, no hacemos nada.
    // Se volverá a intentar en el primer click/toque.
  }
}

// Intento apenas abre el link (a veces funciona, a veces no)
window.addEventListener("load", () => {
  tryPlayMusic();
});

/* -------- Pantalla 1 -> Pantalla 2 -------- */
function begin() {
  tryPlayMusic();  
  show(phraseScreen);
}


// comenzar: botón, click en pantalla, o space
btnStart.addEventListener("click", begin);
startScreen.addEventListener("pointerdown", () => begin());
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !startScreen.classList.contains("hidden")) begin();
});

/* -------- Pantalla 2 -> Pantalla 3 (nueva) -------- */
btnNext.addEventListener("click", () => {
  show(letterScreen);
  startHearts();
});

// opcional: tocar en cualquier parte de la pantalla frase avanza
phraseScreen.addEventListener("pointerdown", (e) => {
  if (e.target.id !== "btn-next") btnNext.click();
});

/* -------- Pantalla 3 -> Pantalla 4 (Sí/No) -------- */
btnNext2.addEventListener("click", () => {
  show(questionScreen);
  prepareNoButton();
});

// opcional: tocar en cualquier parte de la carta avanza
letterScreen.addEventListener("pointerdown", (e) => {
  if (e.target.id !== "btn-next2") btnNext2.click();
});

/* -------- Sí -> Pantalla final -------- */
btnYes.addEventListener("click", () => {
  show(yesScreen);
});

/* -------- Reinicio -------- */
function restart() {
  // reset NO
  btnNo.style.position = "relative";
  btnNo.style.left = "";
  btnNo.style.top = "";
  btnNo.style.transform = "";
  show(startScreen);
}
btnRestart.addEventListener("click", restart);

/* -------- Botón NO que se escapa dentro del cuadrito -------- */
let noReady = false;

function prepareNoButton() {
  if (!noReady) {
    btnNo.addEventListener("mouseover", () => moveNoButton());

    btnNo.addEventListener("touchstart", (e) => {
      e.preventDefault();
      moveNoButton();
    }, { passive: false });

    btnNo.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      moveNoButton();
    });

    noReady = true;
  }

  // Ahora el NO se posiciona dentro del play-area
  btnNo.style.position = "absolute";

  // Colócalo inicialmente donde está, pero relativo al play-area
  const areaRect = playArea.getBoundingClientRect();
  const btnRect = btnNo.getBoundingClientRect();

  btnNo.style.left = `${btnRect.left - areaRect.left}px`;
  btnNo.style.top  = `${btnRect.top  - areaRect.top}px`;

  // Primer ajuste seguro
  moveNoButton();
}

function moveNoButton() {
  const padding = 10;

  const areaRect = playArea.getBoundingClientRect();
  const btnW = btnNo.offsetWidth;
  const btnH = btnNo.offsetHeight;

  // límites estrictos dentro del área blanca
  const minX = padding;
  const minY = padding;

  const maxX = Math.max(minX, areaRect.width  - btnW - padding);
  const maxY = Math.max(minY, areaRect.height - btnH - padding);

  const x = minX + Math.random() * (maxX - minX);
  const y = minY + Math.random() * (maxY - minY);

  btnNo.style.left = `${x}px`;
  btnNo.style.top  = `${y}px`;

  btnNo.style.transform = "scale(1.03)";
  setTimeout(() => (btnNo.style.transform = "scale(1)"), 80);
}


window.addEventListener("resize", () => {
  if (!questionScreen.classList.contains("hidden") && btnNo.style.position === "absolute") {
    moveNoButton();
  }
});


/* -------- Corazones flotando -------- */
let heartsTimer = null;

function startHearts() {
  if (heartsTimer) return;
  heartsTimer = setInterval(spawnHeart, 220);
}

function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = "💖";

  const size = 12 + Math.random() * 18;
  heart.style.fontSize = `${size}px`;

  const x = Math.random() * window.innerWidth;
  const duration = 2.2 + Math.random() * 2.2;

  heart.style.left = `${x}px`;
  heart.style.top = `${window.innerHeight + 10}px`;
  heart.style.animationDuration = `${duration}s`;

  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000);
}
