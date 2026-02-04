const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const yesHint = document.getElementById("yesHint");
const envelope = document.getElementById("envelope");
const letterOverlay = document.getElementById("letterOverlay");
const letterTextNodes = letterOverlay
  ? letterOverlay.querySelectorAll(".letter-words")
  : [];

let noClickCount = 0;
let yesStage = 0;
let autoYesTriggered = false;
const NO_CLICKS_BEFORE_AUTO_YES = 7;
const YES_SCALE_STEP = 0.16;
const AUTO_COVER_SCALE = 2.6;
const NO_CLICK_MESSAGES = [
  "Why do you hate me? :(",
  "Nope. -_-",
  "Try again. 0_0",
];

const goToYesPage = () => {
  window.location.href = "yes.html";
};

const handleYes = () => {
  if (!yesBtn) return;
  if (autoYesTriggered) return;
  if (yesStage === 0) {
    yesStage = 1;
    yesBtn.textContent = "Yessss!";
    if (yesHint) {
      yesHint.textContent = "Good boy. Click again. :*";
      yesHint.classList.add("show");
    }
    return;
  }
  goToYesPage();
};

const triggerAutoYes = () => {
  if (!yesBtn || autoYesTriggered) return;
  autoYesTriggered = true;
  yesBtn.classList.add("auto-choose");
  yesBtn.classList.add("cover-no");
  const currentScale = Number.parseFloat(yesBtn.style.getPropertyValue("--btn-scale")) || 1;
  yesBtn.style.setProperty("--btn-scale", Math.max(currentScale, AUTO_COVER_SCALE).toFixed(2));
  yesBtn.textContent = "Yessss!";
  if (yesHint) {
    yesHint.textContent = "You were always choosing yes.";
    yesHint.classList.add("show");
  }
  window.setTimeout(goToYesPage, 420);
};

const handleNoClick = (event) => {
  event.preventDefault();
  if (!yesBtn || !noBtn || autoYesTriggered) return;

  noClickCount += 1;
  const scale = 1 + noClickCount * YES_SCALE_STEP;
  yesBtn.style.setProperty("--btn-scale", scale.toFixed(2));
  const noCoverPercent = Math.min((noClickCount / NO_CLICKS_BEFORE_AUTO_YES) * 88, 88);
  noBtn.style.setProperty("--no-cover", `${noCoverPercent.toFixed(1)}%`);
  noBtn.style.opacity = `${Math.max(1 - noClickCount * 0.08, 0.35)}`;
  noBtn.style.transform = `scale(${Math.max(1 - noClickCount * 0.03, 0.78).toFixed(2)})`;

  if (yesHint) {
    const messageIndex = (noClickCount - 1) % NO_CLICK_MESSAGES.length;
    yesHint.textContent = NO_CLICK_MESSAGES[messageIndex];
    yesHint.classList.add("show");
  }

  if (noClickCount >= NO_CLICKS_BEFORE_AUTO_YES) {
    triggerAutoYes();
  }
};

const openLetter = () => {
  if (!envelope) return;
  envelope.classList.add("open");
  envelope.setAttribute("aria-expanded", "true");
  if (letterOverlay) {
    letterOverlay.classList.add("show");
    letterOverlay.setAttribute("aria-hidden", "false");
  }
};

const closeLetter = () => {
  if (!envelope) return;
  envelope.classList.remove("open");
  envelope.setAttribute("aria-expanded", "false");
  if (letterOverlay) {
    letterOverlay.classList.remove("show");
    letterOverlay.setAttribute("aria-hidden", "true");
  }
};

const toggleEnvelope = () => {
  if (!envelope) return;
  const isOpen = envelope.classList.contains("open");
  if (isOpen) {
    closeLetter();
  } else {
    openLetter();
  }
};

if (yesBtn) {
  yesBtn.addEventListener("click", handleYes);
}

if (noBtn) {
  noBtn.addEventListener("click", handleNoClick);
}

if (envelope) {
  envelope.addEventListener("click", toggleEnvelope);
  envelope.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleEnvelope();
    }
  });
}

if (letterOverlay) {
  letterOverlay.addEventListener("click", closeLetter);
}

letterTextNodes.forEach((node) => {
  node.addEventListener("click", (event) => {
    event.stopPropagation();
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && letterOverlay && letterOverlay.classList.contains("show")) {
    closeLetter();
  }
});
