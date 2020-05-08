//GRAPH LIST:
// - TREEMAP FOR OVERALL SPENDING BREAKDOWN
// - BAR CHART (STACKED?)
// - SCATTERPLOT WITH PURPOSE ONLY
// - CALENDAR BREAKDOWN

import { Treemap } from "./treemap.js";
import { HBarchart } from "./hbarchart.js";
import { Sunburst } from "./sunburst.js";
import { Calendar } from "./calendar.js";

// CONSTANTS

let treemap, hbarchart, sunburst, calendar;

// STATE
let state = {
  districts: [],
  reps: [],
  spending: [],
  nested: [],
  selectedRep: null,
  selectedPurpose: null,
};

//LOAD DATA

Promise.all([
  d3.csv("../data/repinfo.csv", d3.autoType),
  d3.csv("../data/spendingdatafinal.csv", d3.autoType),
]).then(([reps, spending]) => {
  state.reps = reps;
  state.spending = spending;
  console.log("state: ", state);
  init();
});

//INIT FUNCTION
function init() {
  treemap = new Treemap(state, setGlobalState);
  hbarchart = new HBarchart(state, setGlobalState);
  sunburst = new Sunburst(state, setGlobalState);
  calendar = new Calendar(state, setGlobalState);
  draw();
}

function draw() {
  treemap.draw(state, setGlobalState);
  hbarchart.draw(state, setGlobalState);
  sunburst.draw(state, setGlobalState);
  calendar.draw(state, setGlobalState);
}

function setGlobalState(nextState) {
  state = { ...state, ...nextState };
  console.log("new state:", state);
  draw();
}
