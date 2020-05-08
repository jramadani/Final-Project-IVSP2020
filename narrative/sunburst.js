class Sunburst {
  constructor(state, setGlobalState) {
    this.width = window.innerWidth * 0.8;
    this.height = window.innerHeight * 0.8;
    this.margin = { top: 20, bottom: 50, left: 60, right: 40 };

    const container = d3.select("#sunburst").style("position", "relative");

    this.svg = container
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
  }

  draw(state, setGlobalState) {
    let traveldata = state.spending.filter((d) => d.CATEGORY == "TRAVEL");
    console.log("data", traveldata);

    //NEST APPROACH

    const nestedData = {
      key: "outer-layer",
      values: d3
        .nest()
        .key((d) => d.BIOGUIDE_ID)
        .key((d) => d.PURPOSE)
        .rollup((d) => d3.sum(d, (d) => d.AMOUNT))
        .entries(traveldata),
    };

    console.log("hier", nestedData);

    let wrapper = {
      name: "outer-layer",
      children: nestedData.values.map(function (reps) {
        return {
          name: reps.key,
          children: reps.values.map(function (purpose) {
            return {
              name: purpose.key,
              value: purpose.value,
            };
          }),
        };
      }),
    };

    console.log("wrapper", wrapper);

    //END NEST APPROACH

    let color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow));

    let hierData = d3
      .hierarchy(wrapper)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);
    console.log("hierdata", hierData);

    let slicedData = hierData.children.slice(0, 10);
    console.log("slicedData", slicedData);

    let data = { children: slicedData };

    let radius = this.width / 3;

    let partition = (data) =>
      d3.partition().size([2 * Math.PI, radius])(
        d3
          .hierarchy(data)
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value)
      );

    // let partition = (data) =>
    //   d3.partition().size([2 * Math.PI, radius])(
    //     d3
    //       .hierarchy(wrapper)
    //       .sum((d) => d.value)
    //       .sort((a, b) => b.value - a.value)
    //   );

    //MAIN DRAWING

    // NOW the problem is that it's very big hahahaaaaa i love to code

    let root = partition(data);

    console.log("root", root);

    let arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.0025))
      .padRadius(radius / 2)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1 - 1);

    this.svg
      .append("g")
      .attr("fill-opacity", 0.6)
      .selectAll("path")
      .data(root.descendants().filter((d) => d.depth))
      .join("path")
      .attr("fill", (d) => {
        while (d.depth > 1) d = d.parent;
        return color(d.data.value);
      })
      .attr("d", arc)
      .append("title")
      .text((d) => d);

    this.svg
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .selectAll("text")
      .data(
        root
          .descendants()
          .filter((d) => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
      )
      .join("text")
      .attr("transform", function (d) {
        const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${
          x - 90
        }) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr("color", "black")
      .attr("dy", "0.35em")
      .text((d) => d.data.name);
  }
}
export { Sunburst };
