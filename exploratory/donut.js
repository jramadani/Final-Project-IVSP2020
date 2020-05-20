class Donut {
  constructor(state, setGlobal) {
    this.width = window.innerWidth * 0.4;
    this.height = window.innerHeight * 0.4;
    this.margins = { top: 15, bottom: 15, left: 15, right: 15 };

    this.svg = d3
      .select("#donut")
      .append("svg")
      .attr("viewBox", [
        -this.width / 2,
        -this.height / 1.75,
        this.width,
        this.height,
      ]);
    // .attr("width", this.width)
    // .attr("height", this.width);
  }

  draw(state, setGlobal) {
    console.log("donut drawing!");

    //FILTER & AGGREGATE DATA

    let filteredSpending = state.spending.filter(
      (d) => state.rep == d.BIOGUIDE_ID
    );
    console.log(filteredSpending);

    let donutData = d3
      .nest()
      .key(function (d) {
        return d.CATEGORY;
      })
      .rollup(function (leaves) {
        return d3.sum(leaves, function (d) {
          return d.AMOUNT;
        });
      })
      .entries(filteredSpending);

    //COLOR SCALE

    let color = d3
      .scaleOrdinal()
      .domain(donutData.map((d) => d.key))
      .range(
        d3
          .quantize((t) => d3.interpolateCool(t * 0.8 + 0.1), donutData.length)
          .reverse()
      );

    //DRAW DONUT

    const pie = d3
      .pie()
      .padAngle(0.015)
      .value((d) => d.value);
    let pieData = pie(donutData);

    const radius = Math.min(this.width, this.height) / 2.75;

    let arc = d3
      .arc()
      .innerRadius(radius * 0.67)
      .outerRadius(radius - 1);

    this.svg
      .selectAll(".donut")
      .data(pieData)
      .join(
        (enter) =>
          enter
            .append("path")
            .attr("fill", (d) => color(d.data.key))
            .attr("d", arc)
            .append("title")
            .attr("opacity", 0)
            .text((d) => `${d.data.key}: ${d.data.value}`),
        (update) => update,
        (exit) => exit.remove()
      );
    // .call(
    //   (selection) =>
    //     selection
    //       .transition()
    //       .duration(1000)
    //       .attr("opacity", 1)
    //       .attr("d", (d) => arc(d)) // duration 1000ms / 1s
    // );

    this.svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(pieData)
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("transform", (d) => `translate(${arc.centroid(d)})`)
            .call((text) =>
              text
                .filter((d) => d.endAngle - d.startAngle > 0.25)
                .append("tspan")
                .attr("x", 0)
                .attr("y", "0.7em")
                .attr("fill-opacity", 0.7)
                .text((d) => d.data.key)
            ),
        (update) => update,
        (exit) => exit.remove()
      );
  }
}
export { Donut };
