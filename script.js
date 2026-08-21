async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.append(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

document.querySelectorAll("[data-copy-button]").forEach((button) => {
  button.addEventListener("click", async () => {
    const label = button.querySelector("[data-copy-label]");

    try {
      await copyText(button.dataset.command);
      label.textContent = "Copied";
      button.classList.add("is-copied");
    } catch {
      label.textContent = "Copy failed";
    }

    window.setTimeout(() => {
      label.textContent = "Copy";
      button.classList.remove("is-copied");
    }, 1800);
  });
});

const platformWord = document.querySelector("[data-platform-word]");
const platformNames = ["Discord", "Steam", "Telegram", "Slack"];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (platformWord && !reducedMotion.matches) {
  let platformIndex = 0;
  let platformTimer;

  const schedulePlatformChange = () => {
    window.clearTimeout(platformTimer);
    platformTimer = window.setTimeout(changePlatform, 2600);
  };

  const changePlatform = () => {
    platformWord.classList.add("is-exiting");

    window.setTimeout(() => {
      platformIndex = (platformIndex + 1) % platformNames.length;
      platformWord.textContent = platformNames[platformIndex];
      platformWord.classList.remove("is-exiting");
      platformWord.classList.add("is-entering");

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          platformWord.classList.remove("is-entering");
          schedulePlatformChange();
        });
      });
    }, 200);
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearTimeout(platformTimer);
      return;
    }

    schedulePlatformChange();
  });

  schedulePlatformChange();
}
