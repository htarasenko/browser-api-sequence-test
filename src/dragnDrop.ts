let instance = null;

export default class DragnDrop {
  children: NodeListOf<HTMLDivElement>;
  constructor() {
    if (!instance) {
      instance = this;
    }

    this.children = document.querySelectorAll(".draggable");
    this.children.forEach((child) => {
      child.addEventListener("dragstart", this.dragStart);
      child.addEventListener("dragend", this.dragEnd);
      document.addEventListener("dragover", (e) => {
        this.dragOver(e);
      });
    });
    return instance;
  }

  dragStart(e: DragEvent) {
    (e.target as HTMLDivElement).classList.add("dragging");
  }

  dragEnd(e: DragEvent) {
    e.preventDefault();
    (e.target as HTMLDivElement).classList.remove("dragging");
  }

  dragOver(e: DragEvent) {
    e.preventDefault();
    const afterElement = this.getDragAfterElement(e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      draggable?.parentElement?.appendChild(draggable as Node);
    } else {
      draggable?.parentElement?.insertBefore(draggable as Node, afterElement);
    }
  }

  getDragAfterElement(y: number) {
    const draggableElements = [...this.children];
    return draggableElements.reduce(
      (closest, child) => {
        if (child.classList.contains("dragging")) return closest;
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY, element: null }
    ).element;
  }
}
