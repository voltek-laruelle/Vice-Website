const blueLayer = document.querySelector('[data-layer="blue"]');
const root = document.documentElement;

if (blueLayer) {
  const orangeLayer = blueLayer.cloneNode(true);
  orangeLayer.classList.remove("theme-blue");
  orangeLayer.classList.add("theme-orange");
  orangeLayer.dataset.layer = "orange";
  orangeLayer.setAttribute("aria-hidden", "true");
  orangeLayer.inert = true;

  orangeLayer.querySelectorAll("[id]").forEach((element) => {
    element.removeAttribute("id");
  });

  blueLayer.insertAdjacentElement("afterend", orangeLayer);
}

let pointerClientX = window.innerWidth * 0.72;
let pointerClientY = window.innerHeight * 0.34;

function placeReveal() {
  root.style.setProperty("--pointer-client-x", `${pointerClientX}px`);
  root.style.setProperty("--pointer-client-y", `${pointerClientY}px`);
  root.style.setProperty("--pointer-doc-x", `${pointerClientX}px`);
  root.style.setProperty("--pointer-doc-y", `${pointerClientY + window.scrollY}px`);
}

placeReveal();

window.addEventListener(
  "pointermove",
  (event) => {
    pointerClientX = event.clientX;
    pointerClientY = event.clientY;
    placeReveal();

    if (event.pointerType === "mouse") {
      root.classList.add("cursor-ready");
    }

    root.classList.toggle("pointer-active", Boolean(event.target.closest("a, button")));
  },
  { passive: true },
);

window.addEventListener("pointerenter", () => root.classList.add("cursor-ready"));
document.documentElement.addEventListener("mouseleave", () => root.classList.remove("cursor-ready"));
window.addEventListener("scroll", placeReveal, { passive: true });
window.addEventListener("resize", placeReveal, { passive: true });

document.querySelectorAll("[data-copy-button]").forEach((button) => {
  button.addEventListener("click", async () => {
    const command = button.dataset.command;
    const labels = document.querySelectorAll("[data-copy-label]");

    try {
      await navigator.clipboard.writeText(command);
      labels.forEach((label) => {
        label.textContent = "Copied";
      });
    } catch {
      labels.forEach((label) => {
        label.textContent = command;
      });
    }

    window.setTimeout(() => {
      labels.forEach((label) => {
        label.textContent = "Copy";
      });
    }, 1800);
  });
});
