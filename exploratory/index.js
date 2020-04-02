import { Map } from "./map.js";
import { InfoPanel } from "./infopanel.js";
import { Donut } from "./donut.js";
import { Scatterplot } from "./scatterplot.js";

let map, infopanel, donut, scatterplot;

let state = {
  districts: [],
  reps: [],
  spending: [],
  year: null,
  geoid: null,
  rep: null,
  hover: null,
  selectedYear: null,
  selectedCategory: null,
  selectedPurpose: null
};

Promise.all([
  d3.json("../data/cb_2017_us_cd115_5m.json", d3.autoType),
  d3.csv("../data/repinfo.csv", d3.autoType),
  d3.csv("../data/spendingdatafinal.csv", d3.autoType)
]).then(([districts, reps, spending]) => {
  state.districts = districts;
  state.reps = reps;
  state.spending = spending;
  console.log("state: ", state);
  init();
});

function init() {
  map = new Map(state, setGlobal);
  infopanel = new InfoPanel(state, setGlobal);
  donut = new Donut(state, setGlobal);
  scatterplot = new Scatterplot(state, setGlobal);
  draw();
}

function draw() {
  map.draw(state, setGlobal);
  infopanel.draw(state, setGlobal);
  donut.draw(state, setGlobal);
  scatterplot.draw(state, setGlobal);
}

function setGlobal(nextState) {
  state = { ...state, ...nextState };
  console.log("new state:", state);
  draw();
}
