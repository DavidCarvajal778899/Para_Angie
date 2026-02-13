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

// Música: empezar en 3:03 (183s) SOLO la primera vez que se reproduce
const START_AT = 183;
let startedOnceAtOffset = false;

/* -------------------- Música -------------------- */
window.addEventListener("load", () => {
  // Intento de autoplay (en móvil puede fallar)
  tryPlayMusic();
});

async function tryPlayMusic() {
  try {
    bgm.volume = 0.6;

    // Setear el offset solo una vez (primera reproducción)
    if (!startedOnceAtOffset) {
      // Si aún no están los metadatos, este set puede fallar; lo reforzamos abajo con loadedmetadata
      bgm.currentTime = START_AT;
      startedOnceAtOffset = true;
    }

    await bgm.play();
  } catch (_) {
    // Autoplay bloqueado: se reintenta con interacción (COMENZAR)
  }
}

// Refuerzo: cuando ya haya metadatos, fijamos el tiempo si aún no arrancó
bgm.addEventListener("loadedmetadata", () => {
  if (!startedOnceAtOffset) {
    bgm.currentTime = START_AT;
    startedOnceAtOffset = true;
  }
});

/* -------------------- Navegación de pantallas -------------------- */
function show(screen) {
  startScreen.classList.add("hidden");
  phraseScreen.classList.add("hidden");
  letterScreen.classList.add("hidden");
  questionScreen.classList.add("hidden");
  yesScreen.classList.add("hidden");
  screen.classList.remove("hidden");
}

/* Pantalla 1 -> Pantalla 2 */
function begin() {
  // Primer toque/click permite audio en móvil
  tryPlayMusic();
  show(phraseScreen);
}

btnStart.addEventListener("click", begin);
startScreen.addEventListener("pointerdown", () => begin());
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !startScreen.classList.contains("hidden")) begin();
});

/* Pantalla 2 -> Pantalla 3 */
btnNext.addEventListener("click", () => {
  show(letterScreen);
  startHearts();
});

phraseScreen.addEventListener("pointerdown", (e) => {
  if (e.target.id !== "btn-next") btnNext.click();
});

/* Pantalla 3 -> Pantalla 4 (Sí/No) */
btnNext2.addEventListener("click", () => {
  show(questionScreen);
  prepareNoButton();
});

letterScreen.addEventListener("pointerdown", (e) => {
  if (e.target.id !== "btn-next2") btnNext2.click();
});

/* Sí -> Pantalla final */
btnYes.addEventListener("click", () => {
  show(yesScreen);
});

/* Reiniciar */
function restart() {
  resetNoButton();
  show(startScreen);
}
btnRestart.addEventListener("click", restart);

/* -------------------- Botón NO (mobile-proof) -------------------- */
let noReady = false;

function prepareNoButton() {
  if (!playArea) return; // por si el id no existe aún

  if (!noReady) {
    // PC
    btnNo.addEventListener("mouseover", () => moveNoButton());
    btnNo.addEventListener("pointerenter", () => moveNoButton());

    // Móvil
    btnNo.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        moveNoButton();
      },
      { passive: false }
    );

    btnNo.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      moveNoButton();
    });

    noReady = true;
  }

  // Posición absoluta RELATIVA al playArea
  btnNo.style.position = "absolute";

  // Colócalo en un punto seguro dentro del área (no dependemos de getBoundingClientRect)
  btnNo.style.left = "50%";
  btnNo.style.top = "140px";
  btnNo.style.transform = "translateX(-50%)";

  // Un pequeño delay para asegurar medidas correctas (móvil)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      moveNoButton();
    });
  });
}

function moveNoButton() {
  const padding = 10;

  // Tamaño real del contenedor (más estable en móvil que rects)
  const areaW = playArea.clientWidth;
  const areaH = playArea.clientHeight;

  const btnW = btnNo.offsetWidth;
  const btnH = btnNo.offsetHeight;

  const minX = padding;
  const minY = padding;

  const maxX = Math.max(minX, areaW - btnW - padding);
  const maxY = Math.max(minY, areaH - btnH - padding);

  const x = minX + Math.random() * (maxX - minX);
  const y = minY + Math.random() * (maxY - minY);

  btnNo.style.left = `${x}px`;
  btnNo.style.top = `${y}px`;

  // micro animación
  btnNo.style.transform = "scale(1.03)";
  setTimeout(() => (btnNo.style.transform = "scale(1)"), 80);
}

function resetNoButton() {
  btnNo.style.position = "relative";
  btnNo.style.left = "";
  btnNo.style.top = "";
  btnNo.style.transform = "";
}

window.addEventListener("resize", () => {
  if (!questionScreen.classList.contains("hidden") && btnNo.style.position === "absolute") {
    moveNoButton();
  }
});

/* -------------------- Corazones -------------------- */
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
