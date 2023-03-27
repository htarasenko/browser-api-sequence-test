import "./styles/main.css";
import initDragnDrop from "./dragnDrop";
import { apisMeta, runApis } from "./apisRunner";

function initApis() {
  const apiList = document.getElementById("api-list");
  Object.entries(apisMeta).forEach(([name, { color }]) => {
    const button = document.createElement("button");
    button.innerText = name;
    button.classList.add("api-box");
    button.classList.add(color);
    button.classList.add("draggable");
    button.classList.add("checked");
    button.setAttribute("draggable", "true");
    apiList.appendChild(button);
    button.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      if (target.classList.contains("checked")) {
        target.classList.remove("checked");
      } else {
        target.classList.add("checked");
      }
    });
  });
  new initDragnDrop();
}

document.getElementById("run").addEventListener("click", () => {
  const apisToCall = [];
  document
    .querySelectorAll(".draggable.api-box")
    .forEach((apiButton: HTMLButtonElement) => {
      if (apiButton.classList.contains("checked")) {
        apisToCall.push(apiButton.innerText);
      }
    });
  runApis(apisToCall);
});

(function main() {
  initApis();
})();
