import { GameManager } from "./classes/gameManager.js";

const gm = new GameManager(document.querySelector("canvas"));

const buttonSave = document.querySelector("#buttonSave");
buttonSave.addEventListener("click", (e) => gm.saveMap());
