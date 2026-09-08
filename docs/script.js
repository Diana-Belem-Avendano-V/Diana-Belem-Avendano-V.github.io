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

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  if (!touchMode && Date.now() - lastEscape > 300) {
    const rect = noBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distance = Math.hypot(mouseX - centerX, mouseY - centerY);

    // The closer the cursor gets, the earlier the button escapes.
    const escapeRadius = Math.max(82 - escapeCount * 3, 48);

    if (distance < escapeRadius) {
      escapeButton();
    }
  }
});

noBtn.addEventListener("mouseenter", () => {
  if (!touchMode) escapeButton();
});

// Mobile: don't make the button impossible to tap accidentally.
// Instead, when touched, move it and show the joke.
noBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  touchMode = true;
  escapeButton();
}, { passive: false });

noBtn.addEventListener("click", (event) => {
  event.preventDefault();
  escapeButton();
});

let noOffsetX = 0;
let noOffsetY = 0;

function escapeButton() {
  const now = Date.now();

  if (now - lastEscape < 300) return;

  lastEscape = now;
  escapeCount++;

  const moveDistance = 50;
  const padding = 12;

  const rect = noBtn.getBoundingClientRect();

  const angle = Math.random() * Math.PI * 2;

  let moveX = Math.cos(angle) * moveDistance;
  let moveY = Math.sin(angle) * moveDistance;

  // Posición que tendría después de moverse
  let newLeft = rect.left + moveX;
  let newTop = rect.top + moveY;

  // Mantener dentro de la pantalla
  if (newLeft < padding) {
    moveX = padding - rect.left;
  }

  if (newLeft + rect.width > window.innerWidth - padding) {
    moveX = window.innerWidth - padding - rect.width - rect.left;
  }

  if (newTop < padding) {
    moveY = padding - rect.top;
  }

  if (newTop + rect.height > window.innerHeight - padding) {
    moveY = window.innerHeight - padding - rect.height - rect.top;
  }

  // Acumular el desplazamiento
  noOffsetX += moveX;
  noOffsetY += moveY;

  noBtn.style.transform =
    `translate(${noOffsetX}px, ${noOffsetY}px)`;

  const messageIndex = Math.min(
    escapeCount,
    messages.length - 1
  );

  hint.textContent = messages[messageIndex];

  if (escapeCount === 6) {
    hint.textContent =
      "Creo que ya entendiste cómo funciona esto. 😂";
  }

  if (escapeCount >= 10) {
    hint.textContent =
      "Aceptémoslo: la única respuesta razonable es la otra. 🚀";
  }
}

yesBtn.addEventListener("click", () => {
  // Hide the question and show the final state.
  questionWrap.style.display = "none";

  noBtn.style.display = "none";

  success.setAttribute("aria-hidden", "false");
  success.classList.add("show");

  // Small celebration without an external library.
  createParticles();
});

function createParticles() {
  const count = 26;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");

    particle.style.position = "fixed";
    particle.style.left = `${50 + random(-15, 15)}%`;
    particle.style.top = `${48 + random(-5, 5)}%`;
    particle.style.width = `${random(2, 5)}px`;
    particle.style.height = particle.style.width;
    particle.style.borderRadius = "50%";
    particle.style.background = "rgba(183,175,255,.85)";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "50";

    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const distance = random(80, 240);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    particle.animate(
      [
        {
          transform: "translate(-50%, -50%) scale(1)",
          opacity: 1
        },
        {
          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0)`,
          opacity: 0
        }
      ],
      {
        duration: random(700, 1200),
        easing: "cubic-bezier(.2,.8,.2,1)"
      }
    ).onfinish = () => particle.remove();
  }
}

// If the window changes size, bring the runaway button back into view.
window.addEventListener("resize", () => {
  if (!noBtn.classList.contains("escaping")) return;

  const rect = noBtn.getBoundingClientRect();

  const x = Math.min(
    Math.max(12, rect.left),
    window.innerWidth - rect.width - 12
  );

  const y = Math.min(
    Math.max(12, rect.top),
    window.innerHeight - rect.height - 12
  );

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
});
