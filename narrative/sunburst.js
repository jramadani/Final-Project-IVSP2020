class Sunburst {
  constructor(state, setGlobalState) {
    this.width = window.innerWidth * 0.8;
    this.height = window.innerHeight * 0.8;
    this.margin = { top: 100, bottom: 50, left: 100, right: 40 };

    const container = d3.select("#sunburst");

    this.svg = container
      .append("svg")
      .attr("width", this.width / 2)
      .attr("height", this.width / 2);

    //tooltip is currently not working for some reason-come back to this

    this.tooltip = container
      .append("div")
      .attr("class", "suntooltip")
      .style("position", "relative")
      .attr("z-index", 99999);

    let data = state.spending.filter((d) => d.CATEGORY == "TRAVEL");

    //OFFICE HOURS APPROACH:

    const milliSecondsPerDay = 1000 * 60 * 60 * 24;
    const formatter = d3.timeFormat("%m/%d/%y");
    const parser = d3.timeParse("%m/%d/%y");
    const yearFormatter = d3.timeFormat("%Y");
    const yearParser = d3.timeParse("%Y");
    const numToInclude = 10;

    // DATA AGGREGATION AND MANIPULATION

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

    // HIERARCHY

    let hierarchy = d3
      .hierarchy([null, grouped], (d) => d[1])
      .sum((d) => d["AMOUNT"]);

    let radius = this.width / 2;

    let partition = (data) =>
      d3.partition().size([2 * Math.PI, radius])(hierarchy);

    //MAIN DRAWING

    let root = partition(topSpenders);

    let subset = root.descendants().filter((d) => d.depth < 3);

    //COLOR CONSTRUCTOR

    let scale = d3
      .scaleLinear()
      .domain(d3.extent(subset.slice(1, 10), (d) => d.value))
      .range(["#8bd086", "#3dad65"]);

    let colorOuter = d3.scaleOrdinal(d3.quantize(d3.interpolateYlGn, 8));
    let colorInner = d3.scaleSequential((d) => scale(d));

    //ARC CONSTRUCTION

    let arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.0025))
      .padRadius(radius / 2)
      .innerRadius((d) => d.y0 / 2)
      .outerRadius((d) => (d.y1 - 1) / 2);

    //SUNBURST DRAW

    this.svg
      .append("g")
      .selectAll("path")
      .data(subset)
      .join("path")
      .attr("class", "sunburstControls")
      .attr("transform", `translate(${radius / 2}, ${radius / 2})`)
      .on("mouseover", (d) => {
        console.log("hello");
        state.hoverSunburst = setGlobalState({
          translate: [d.x0, d.y0],
          name: d.data[0],
          value: d.value,
        });
      })
      .attr("fill", (d) => {
        if (d.height == 2) {
          //this is the representative's travel spending level
          return scale(d.value);
        } else if (d.height == 1) {
          //this is the purpose level
          return colorOuter(d.data[0]); //a certain color map based on value, remember to set opacity level at less than 1
        } else {
          return "transparent";
        }
      })
      .attr("fill-opacity", (d) => {
        if (d.height == 1) {
          // let opacityScale = d3
          //   .scaleLinear()
          //   .domain([d3.extent(d, (d) => d.value)])
          //   .range([0.3, 0.8]);
          // return opacityScale(d.value);
          return 0.8;
        } else {
          return 0.9;
        }
      })
      .attr("d", arc)
      .append("title")
      .text((d) => d.data[0]);
  }

  draw(state, setGlobalState) {
    if (state.hoverSunburst) {
      this.tooltip
        .html(
          `<div>Name: ${state.hoverSunburst.name}</div>
          <div>Value: ${state.hoverSunburst.value}</div>`
        )
        .transition()
        .duration(500)
        .style("background-color", "black")
        .style("color", "#A50026")
        .style("border-radius", "15px")
        .style("padding", "15px")
        .style("opacity", 0.85)
        .style("z-index", 9999999)
        .style(
          "transform",
          `translate(${state.translate[0]}px, ${state.translate[1]}px)`
        );

      //labels--deprecated, kept for reference

      // this.svg
      //   .append("g")
      //   .attr("pointer-events", "none")
      //   .attr("text-anchor", "middle")
      //   .attr("font-size", 10)
      //   .attr("font-family", "sans-serif")
      //   .selectAll("text")
      //   .data(
      //     root.descendants().filter((d) => d.depth < 3)
      //   )
      //   .join("text")
      //   .attr("transform", function (d) {
      //     const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
      //     const y = (d.y0 + d.y1) / 2;
      //     return `rotate(${
      //       x - 90
      //     }) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      //   })
      //   .attr("color", "black")
      //   .attr("dy", "0.35em")
      //   .text((d) => d.data[0])
      //   .attr("z-index", "9999");
      //remember to set the title's z-index to 9999 to make sure it shows up on top of everything else.
    }
  }
}
export { Sunburst };
