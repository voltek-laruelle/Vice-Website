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

const platformTrack = document.querySelector("[data-platform-track]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (platformTrack && !reducedMotion.matches) {
  let platformIndex = 0;
  let platformTimer;
  const platformCount = platformTrack.children.length - 1;

  const schedulePlatformChange = () => {
    window.clearTimeout(platformTimer);
    platformTimer = window.setTimeout(changePlatform, 2600);
  };

  const changePlatform = () => {
    platformIndex += 1;
    platformTrack.style.setProperty("--platform-index", platformIndex);
    schedulePlatformChange();
  };

  platformTrack.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "transform" || platformIndex !== platformCount) {
      return;
    }

    platformTrack.classList.add("no-transition");
    platformIndex = 0;
    platformTrack.style.setProperty("--platform-index", platformIndex);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => platformTrack.classList.remove("no-transition"));
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearTimeout(platformTimer);
      return;
    }

    schedulePlatformChange();
  });

  schedulePlatformChange();
}
