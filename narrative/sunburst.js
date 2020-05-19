class Sunburst {
  constructor(state, setGlobalState) {
    this.width = window.innerWidth * 0.8;
    this.height = window.innerHeight * 0.8;
    this.margin = { top: 100, bottom: 50, left: 100, right: 40 };

    const container = d3.select("#sunburst").style("position", "relative");

    this.svg = container
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height * 1.25);
  }

  draw(state, setGlobalState) {
    let data = state.spending.filter((d) => d.CATEGORY == "TRAVEL");

    //OFFICE HOURS APPROACH:

    const milliSecondsPerDay = 1000 * 60 * 60 * 24;
    const formatter = d3.timeFormat("%m/%d/%y");
    const parser = d3.timeParse("%m/%d/%y");
    const yearFormatter = d3.timeFormat("%Y");
    const yearParser = d3.timeParse("%Y");
    const numToInclude = 10;

    let newData = data.map((d) => ({
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
          yearFormatter(parser(d["START DATE"])) &&
        d["CATEGORY"] === "TRAVEL"
    );

    let topSpenders = d3
      .rollups(
        filteredData,
        (v) => d3.sum(v, (d) => d["AMOUNT"]),
        (d) => d["BIOGUIDE_ID"]
      )
      .sort((a, b) => d3.descending(a[1], b[1]))
      .slice(0, numToInclude)
      .map((d) => d[0]);

    let topSpendersData = filteredData.filter((d) =>
      topSpenders.includes(d["BIOGUIDE_ID"])
    );

    let grouped = d3.groups(
      topSpendersData,
      (d) => d["BIOGUIDE_ID"],
      (d) => d["PURPOSE"]
    );

    let hierarchy = d3
      .hierarchy([null, grouped], (d) => d[1])
      .sum((d) => d["AMOUNT"]);

    console.log("hierarchy", hierarchy);
    //NEST APPROACH

    // const nestedData = {
    //   key: "outer-layer",
    //   values: d3
    //     .nest()
    //     .key((d) => d.BIOGUIDE_ID)
    //     .key((d) => d.PURPOSE)
    //     .rollup((d) => d3.sum(d, (d) => d.AMOUNT))
    //     .entries(traveldata),
    // };

    // console.log("hier", nestedData);

    // let wrapper = {
    //   name: "outer-layer",
    //   children: nestedData.values.map(function (reps) {
    //     return {
    //       name: reps.key,
    //       children: reps.values.map(function (purpose) {
    //         return {
    //           name: purpose.key,
    //           value: purpose.value,
    //         };
    //       }),
    //     };
    //   }),
    // };

    // console.log("wrapper", wrapper);

    //END NEST APPROACH

    let color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow));

    // let hierData = d3
    //   .hierarchy(wrapper)
    //   .sum((d) => d.value)
    //   .sort((a, b) => b.value - a.value);
    // console.log("hierdata", hierData);

    // let slicedData = hierData.children.slice(0, 10);
    // console.log("slicedData", slicedData);

    // let data = { children: slicedData };

    let radius = this.width / 2;

    // let partition = (data) =>
    //   d3.partition().size([2 * Math.PI, radius])(
    //     d3
    //       .hierarchy(data)
    //       .sum((d) => d.value)
    //       .sort((a, b) => b.value - a.value)
    //   );

    let partition = (data) =>
      d3.partition().size([2 * Math.PI, radius])(hierarchy);

    //MAIN DRAWING

    let root = partition(topSpenders);

    console.log("root", root);

    let arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.0025))
      .padRadius(radius / 2)
      .innerRadius((d) => d.y0 / 2)
      .outerRadius((d) => (d.y1 - 1) / 2);

    this.svg
      .append("g")
      .attr("fill-opacity", 0.6)
      .selectAll("path")
      .data(root.descendants().filter((d) => d.depth < 3))
      .join("path")
      // .attr("transform", "scale(0.5)")
      .attr("fill", (d) => {
        if (d.height == 2) {
          //this is the Category level
          return color(Math.max((d) => d.value));
        } else if (d.height == 1) {
          //this is the Purpose level
          return color(Math.max((d) => d.value)); //a certain color map based on value, remember to set opacity level at less than 1
        } else {
          return "transparent";
        }
      })
      .attr("d", arc)
      .append("title")
      .text((d) => d.descendants().filter((d) => d.depth))
      .attr("color", "black");

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
    //remember to set the title's z-index to 9999 to make sure it shows up on top of everything else.
  }
}
export { Sunburst };
