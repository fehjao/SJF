document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("timeline-container");
  const template = document.getElementById("timeline-item-template");

  if (!container || !template || typeof watchedData === "undefined") return;

  const fragment = document.createDocumentFragment();

  watchedData.forEach((item, index) => {
    const clone = template.content.cloneNode(true);
    const rootDiv = clone.querySelector(".timeline-item");

    if (index % 2 !== 0) {
      rootDiv.classList.add("reverse");
    }

    const img = clone.querySelector("img");
    img.src = item.image;
    img.alt = item.title;

    clone.querySelector("h2").textContent = item.title;
    clone.querySelector("p").textContent = item.description;

    fragment.appendChild(clone);
  });

  container.appendChild(fragment);
});