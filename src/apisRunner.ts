const worker = new Worker("./my.worker.js");

interface BrowserApi {
  name: ApiNames;
  checked: boolean;
  dragOffset: { x: number; y: number };
}

export type ApiNames =
  | "setTimeout"
  | "setInterval"
  | "Web Worker"
  | "Indexed DB"
  | "RAF"
  | "promise"
  | "Synchronous";

export const apisMeta: { [K in ApiNames]: { url: string; color: string } } = {
  setTimeout: {
    url: "https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout",
    color: "green",
  },
  setInterval: {
    url: "https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval",
    color: "orange",
  },
  "Web Worker": {
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API",
    color: "yellow",
  },
  "Indexed DB": {
    url: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API",
    color: "red",
  },
  RAF: {
    url: "https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame",
    color: "blue",
  },
  promise: {
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
    color: "indigo",
  },
  Synchronous: {
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/sync_function",
    color: "violet",
  },
};

class FinishedApi {
  container: HTMLDivElement;
  many: Boolean;
  constructor(container: HTMLDivElement) {
    this.container = container;
    this.many = false;
  }
  add(api: ApiNames) {
    const apiBox = document.createElement("div");
    apiBox.classList.add("api-box");
    apiBox.classList.add(apisMeta[api].color);
    apiBox.classList.add("checked");
    apiBox.innerText = api;
    this.container.appendChild(apiBox);
  }
  clearContainer() {
    this.container.innerHTML = "";
  }
}
const finishedApi = new FinishedApi(
  document.getElementById("api-ready-list") as HTMLDivElement
);

worker.onmessage = () => {
  finishedApi.add("Web Worker");
};

const methodsContainer = {
  setTimeout: () => {
    setTimeout(() => {
      finishedApi.add("setTimeout");
    }, 0);
  },
  setInterval: () => {
    const interval = setInterval(() => {
      clearInterval(interval);
      finishedApi.add("setInterval");
    }, 0);
  },
  RAF: () => {
    requestAnimationFrame(() => {
      finishedApi.add("RAF");
    });
  },

  "Web Worker": () => {
    worker.postMessage({ action: "start" });
  },
  "Indexed DB": () => {
    const request = indexedDB.open("myDatabase", 1);
    request.onsuccess = (event: any) => {
      finishedApi.add("Indexed DB");
    };
  },
  promise: () => {
    new Promise<void>((resolve) => {
      resolve();
    }).then(() => {
      finishedApi.add("promise");
    });
  },
  Synchronous: () => {
    finishedApi.add("Synchronous");
  },
};

export const runApis = (apis: ApiNames[]) => {
  finishedApi.clearContainer();
  console.log(apis);
  apis.forEach((api) => {
    methodsContainer[api]();
  });
};
