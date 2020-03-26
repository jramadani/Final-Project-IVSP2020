import { Map } from "./map.js";
import { InfoPanel } from "./infopanel.js";
import { Donut } from "./donut.js";
import { Scatterplot } from "./scatterplot.js";

let map, infopanel, donut, scatterplot;

let svg;

let state = {
  districts: [],
  reps: [],
  spending: []
};

Promise.all([
  d3.json("../data/tl_2016_us_cd115.json", d3.autoType),
  d3.csv("../data/repinfo.csv", d3.autoType),
  d3.csv("../data/repdatafinal.csv", d3.autoType)
]).then(([districts, reps, spending]) => {
  state.districts = districts;
  state.reps = reps;
  state.spending = spending;
  console.log("state: ", state);
  init();
});

// init() {

// };

// function draw() {

// }

function setGlobalState() {}
