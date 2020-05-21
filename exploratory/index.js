import { Map } from "./map.js";
import { InfoPanel } from "./infopanel.js";
import { Donut } from "./donut.js";
import { Timescale } from "./timescale.js";

let map, infopanel, donut, timescale;

let state = {
  districts: [],
  reps: [],
  spending: [],
  year: null,
  geoid: null,
  rep: null,
  hover: null,
  hoverep: null,
  hovergeoid: null,
  selectedYear: null,
  selectedCategory: null,
  yearFiltered: [],
};

Promise.all([
  d3.json("../data/cb_2017_us_cd115_5m.json", d3.autoType),
  d3.csv("../data/repinfo.csv", d3.autoType),
  d3.csv("../data/spendingdatafinal.csv", d3.autoType),
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
  timescale = new Timescale(state, setGlobal);
  draw();
}

function draw() {
  map.draw(state, setGlobal);
  infopanel.draw(state, setGlobal);
  donut.draw(state, setGlobal);
  timescale.draw(state, setGlobal);
}

function setGlobal(nextState) {
  state = { ...state, ...nextState };
  console.log("new state:", state);
  draw();
}
