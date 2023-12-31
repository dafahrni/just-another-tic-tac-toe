
import { ModalDialog, Board } from "./view.js";
import { Logic } from "./model.js";

const ressources = {
  click: new Audio("resources/click.mp3"),
  clack: new Audio("resources/clack.mp3"),
  wrong: new Audio("resources/buzz.mp3"),
  bell: new Audio("resources/success.mp3"),
  draw: new Audio("resources/draw.mp3"),
};
const dialog = new ModalDialog();
const logic = new Logic();
const board = new Board(ressources, dialog, logic);
