class Donut {
  constructor(state, setGlobal) {
    this.width = window.innerWidth * 0.4;
    this.height = window.innerHeight * 0.4;
    this.margins = { top: 15, bottom: 15, left: 15, right: 15 };

    function arc() {
      const radius = Math.min(width, height) / 2;
      return d3
        .arc()
        .innerRadius(radius * 0.67)
        .outerRadius(radius - 1);
    }
    function pie() {
      d3.pie()
        .padAngle(0.005)
        .sort(null)
        .value(d => d.value);
    }

    this.svg = d3
      .select("#donut")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
  }

  draw(state, setGlobal) {
    console.log("donut drawing!");
  }
}
export { Donut };
