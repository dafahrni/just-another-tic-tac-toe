import { View } from "./view.js";
import { Model } from "./model.js";
import  { Controller} from "./controller.js";

const model = new Model();
const view = new View(model);
const controller = new Controller(model, view);
controller.run();
