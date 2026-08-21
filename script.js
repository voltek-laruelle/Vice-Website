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
