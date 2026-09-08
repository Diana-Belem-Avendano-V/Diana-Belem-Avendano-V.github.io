const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const buttonsArea = document.getElementById("buttonsArea");
const questionWrap = document.getElementById("questionWrap");
const success = document.getElementById("success");
const hint = document.getElementById("hint");

let escapeCount = 0;
let lastEscape = 0;
let mouseX = 0;
let mouseY = 0;
let touchMode = false;

// Desplazamiento acumulado del botón
let noOffsetX = 0;
let noOffsetY = 0;

const messages = [
  "Elige sabiamente. 👀",
  "Hmm... esa respuesta no parece estar disponible.",
  "¿Seguro? 👀",
  "Creo que ese botón está evitando tomar decisiones.",
  "Interesante estrategia...",
  "Ese botón tiene otros planes.",
  "No creo que quieras presionar ese. 😌",
  "Okay, esto ya es personal.",
  "Última oportunidad... para elegir el correcto. 🚀"
];


// =========================================================
// MOUSE
// =========================================================

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  if (!touchMode && Date.now() - lastEscape > 300) {
    const rect = noBtn.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distance = Math.hypot(
      mouseX - centerX,
      mouseY - centerY
    );

    // Qué tan cerca debe estar el mouse para que escape
    const escapeRadius = Math.max(
      82 - escapeCount * 3,
      48
    );

    if (distance < escapeRadius) {
      escapeButton();
    }
  }
});


// =========================================================
// MOUSE ENTER
// =========================================================

noBtn.addEventListener("mouseenter", () => {
  if (!touchMode) {
    escapeButton();
  }
});


// =========================================================
// MOBILE / TOUCH
// =========================================================

noBtn.addEventListener(
  "touchstart",
  (event) => {
    event.preventDefault();

    touchMode = true;

    escapeButton();
  },
  { passive: false }
);


// =========================================================
// CLICK
// =========================================================

noBtn.addEventListener("click", (event) => {
  event.preventDefault();

  escapeButton();
});


// =========================================================
// ESCAPE BUTTON
// =========================================================

function escapeButton() {
  const now = Date.now();

  // Evita que se mueva demasiadas veces seguidas
  if (now - lastEscape < 300) return;

  lastEscape = now;
  escapeCount++;

  // =======================================================
  // CONFIGURACIÓN
  // =======================================================

  const moveDistance = 50;
  const padding = 15;

  // =======================================================
  // POSICIÓN ACTUAL DEL BOTÓN
  // =======================================================

  const rect = noBtn.getBoundingClientRect();

  const currentLeft = rect.left;
  const currentTop = rect.top;

  // =======================================================
  // DIRECCIÓN ALEATORIA
  // =======================================================

  const angle = Math.random() * Math.PI * 2;

  let moveX = Math.cos(angle) * moveDistance;
  let moveY = Math.sin(angle) * moveDistance;

  // =======================================================
  // POSICIÓN QUE TENDRÍA DESPUÉS DEL MOVIMIENTO
  // =======================================================

  let nextLeft = currentLeft + moveX;
  let nextTop = currentTop + moveY;

  // =======================================================
  // LÍMITE IZQUIERDO
  // =======================================================

  if (nextLeft < padding) {
    moveX = padding - currentLeft;
  }

  // =======================================================
  // LÍMITE DERECHO
  // =======================================================

  if (
    nextLeft + rect.width >
    window.innerWidth - padding
  ) {
    moveX =
      window.innerWidth -
      padding -
      rect.width -
      currentLeft;
  }

  // =======================================================
  // LÍMITE SUPERIOR
  // =======================================================

  if (nextTop < padding) {
    moveY = padding - currentTop;
  }

  // =======================================================
  // LÍMITE INFERIOR
  // =======================================================

  if (
    nextTop + rect.height >
    window.innerHeight - padding
  ) {
    moveY =
      window.innerHeight -
      padding -
      rect.height -
      currentTop;
  }

  // =======================================================
  // ACUMULAR DESPLAZAMIENTO
  // =======================================================

  noOffsetX += moveX;
  noOffsetY += moveY;

  // =======================================================
  // APLICAR MOVIMIENTO
  // =======================================================

  noBtn.classList.add("escaping");

  noBtn.style.transform =
    `translate3d(${noOffsetX}px, ${noOffsetY}px, 0)`;


  // =======================================================
  // MENSAJES
  // =======================================================

  const messageIndex = Math.min(
    escapeCount,
    messages.length - 1
  );

  hint.textContent = messages[messageIndex];


  // =======================================================
  // MENSAJES ESPECIALES
  // =======================================================

  if (escapeCount === 6) {
    hint.textContent =
      "Creo que ya entendiste cómo funciona esto. 😂";
  }

  if (escapeCount >= 10) {
    hint.textContent =
      "Aceptémoslo: la única respuesta razonable es la otra. 🚀";
  }
}


// =========================================================
// RANDOM
// =========================================================

function random(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}


// =========================================================
// DISTANCE TO ELEMENT
// =========================================================

function distanceToElement(
  x,
  y,
  width,
  height,
  element
) {
  const target = element.getBoundingClientRect();

  const targetX =
    target.left + target.width / 2;

  const targetY =
    target.top + target.height / 2;

  return Math.hypot(
    x + width / 2 - targetX,
    y + height / 2 - targetY
  );
}


// =========================================================
// YES BUTTON
// =========================================================

yesBtn.addEventListener("click", () => {

  // Ocultar la pregunta
  questionWrap.style.display = "none";

  // Ocultar botón NO
  noBtn.style.display = "none";

  // Mostrar éxito
  success.setAttribute(
    "aria-hidden",
    "false"
  );

  success.classList.add("show");

  // Celebración
  createParticles();
});


// =========================================================
// PARTICLES
// =========================================================

function createParticles() {
  const count = 26;

  for (let i = 0; i < count; i++) {

    const particle =
      document.createElement("span");

    particle.style.position = "fixed";

    particle.style.left =
      `${50 + random(-15, 15)}%`;

    particle.style.top =
      `${48 + random(-5, 5)}%`;

    particle.style.width =
      `${random(2, 5)}px`;

    particle.style.height =
      particle.style.width;

    particle.style.borderRadius =
      "50%";

    particle.style.background =
      "rgba(183,175,255,.85)";

    particle.style.pointerEvents =
      "none";

    particle.style.zIndex = "50";

    document.body.appendChild(particle);


    // Dirección de la partícula
    const angle =
      Math.random() * Math.PI * 2;

    const distance =
      random(80, 240);

    const x =
      Math.cos(angle) * distance;

    const y =
      Math.sin(angle) * distance;


    // Animación
    particle.animate(
      [
        {
          transform:
            "translate(-50%, -50%) scale(1)",

          opacity: 1
        },

        {
          transform:
            `translate(
              calc(-50% + ${x}px),
              calc(-50% + ${y}px)
            ) scale(0)`,

          opacity: 0
        }
      ],
      {
        duration: random(700, 1200),

        easing:
          "cubic-bezier(.2,.8,.2,1)"
      }
    ).onfinish = () => {
      particle.remove();
    };
  }
}
