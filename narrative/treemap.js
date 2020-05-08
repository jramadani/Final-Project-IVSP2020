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
    const colorScale = d3.scaleOrdinal(d3.schemeSet3);
    let data = state.spending;
    const nestedData = d3
      .nest()
      .key((d) => d.CATEGORY)
      .rollup((d) => d3.sum(d, (d) => d.AMOUNT))
      .entries(data);

    let wrapper = { children: nestedData };

    let root = d3
      .hierarchy(wrapper)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);

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
      .attr("stroke", "black")
      .attr("fill", (d) => {
        const maxSum = d.ancestors().find((d) => d.value);
        return colorScale();
      })
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0);
  }
}

export { Treemap };
