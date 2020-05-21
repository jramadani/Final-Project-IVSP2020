class Treemap {
  constructor(state, setGlobalState) {
    this.width = window.innerWidth * 0.5;
    this.height = window.innerHeight * 0.7;
    this.margin = { top: 20, bottom: 50, left: 60, right: 40 };

    const container = d3.select("#treemap").style("position", "relative");

    this.svg = container
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
  }

  draw(state, setGlobalState) {
    let data = state.spending;

    //below from office hours, modified for use in all four graphs

    const milliSecondsPerDay = 1000 * 60 * 60 * 24;
    const formatter = d3.timeFormat("%m/%d/%y");
    const parser = d3.timeParse("%m/%d/%y");
    const yearFormatter = d3.timeFormat("%Y");
    const yearParser = d3.timeParse("%Y");
    let newData = state.spending.map((d) => ({
      ...d,
      normalized_amount:
        d.AMOUNT /
        Math.max(
          1, // can't be less than 1 day
          (parser(d["END DATE"]) - parser(d["START DATE"])) / milliSecondsPerDay
        ),
    }));
    let filteredData = newData.filter(
      (d) =>
        d["START DATE"] &&
        yearFormatter(yearParser(d.YEAR)) ==
          yearFormatter(parser(d["START DATE"]))
    );

    //normalized data ends here; begin nesting

    const nestedData = d3
      .nest()
      .key((d) => d.CATEGORY)
      .rollup((d) => d3.sum(d, (d) => d.AMOUNT))
      .entries(filteredData);

    console.log("nestedData", nestedData);

    let scale = d3
      .scaleLinear()
      .domain(d3.extent(nestedData, (d) => d.value))
      .range([0.25, 1]);

    let color = d3.scaleSequential((d) => d3.interpolateGreens(scale(d)));

    let wrapper = { children: nestedData };
    let format = d3.format(",d");

    let root = d3
      .hierarchy(wrapper)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);
    console.log("root", root);

    let tree = d3
      .treemap()
      .size([this.width, this.height])
      .padding(1)
      .round(true);

    tree(root);

    let leaf = this.svg
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    leaf
      .append("rect")
      .attr("stroke", "white")
      .attr("fill", (d) => color(d.data.value))
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0);

    this.svg
      .selectAll("text")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("x", (d) => d.x0 + 5)
      .attr("y", (d) => d.y0 + 20)
      .text((d) => d.data.key)
      .attr("font-size", "12px")
      .attr("fill", "white");

    this.svg
      .selectAll("values")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("x", (d) => d.x0 + 5)
      .attr("y", (d) => d.y0 + 35)
      .text((d) => format(Number(Math.round(d.data.value + "e2") + "e-2")))
      .attr("font-size", "10px")
      .attr("fill", "white");
  }
}

export { Treemap };
