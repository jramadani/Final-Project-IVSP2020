class HBarchart {
  constructor(state, setGlobalState) {
    this.width = window.innerWidth * 0.8;
    this.height = window.innerHeight * 0.4;
    this.margin = { top: 70, bottom: 50, left: 200, right: 200 };
  }

  draw(state, setGlobalState) {
    //BAR CHART
    let data = state.spending;

    //DATA MANIPS FROM OFFICE HRS

    const milliSecondsPerDay = 1000 * 60 * 60 * 24;
    const formatter = d3.timeFormat("%m/%d/%y");
    const parser = d3.timeParse("%m/%d/%y");
    const yearFormatter = d3.timeFormat("%Y");
    const yearParser = d3.timeParse("%Y");
    const numToInclude = 10;
    const format = d3.format(",d");

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

    const nestedData = d3
      .nest()
      .key((d) => d.BIOGUIDE_ID)
      .rollup((d) => d3.sum(d, (d) => d.AMOUNT))
      .entries(filteredData);

    let topData = nestedData
      .sort(function (a, b) {
        return d3.descending(+a.value, +b.value);
      })
      .slice(0, 10);
    console.log("topData", topData);

    //SCALES
    const yScale = d3
      .scaleBand()
      .domain(topData.map((d) => d.key))
      .range([0, 225])
      .paddingInner(0.2);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(topData, (d) => d.value)])
      .range([this.margin.left, this.width - this.margin.right]);

    //AXES

    const xAxis = d3.axisBottom(xScale).ticks(topData.length);
    const yAxis = d3.axisLeft(yScale).ticks(topData.key).tickSizeOuter(1);

    //DRAW
    const svg = d3
      .select("#hbc")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    const rect = svg
      .selectAll("rect")
      .data(topData)
      .join("rect")
      .attr("class", "bars")
      .attr("y", (d) => yScale(d.key))
      .attr("x", xScale(0))
      .attr("height", yScale.bandwidth())
      .attr("width", (d) => xScale(d.value) - xScale(0))
      .attr("fill", "green")
      .on("mouseover", (d) => {});

    const text = svg
      .selectAll("text")
      .data(topData)
      .join("text")
      .attr("class", "label")
      .attr("y", (d) => yScale(d.key) + yScale.bandwidth() / 2)
      .attr("x", xScale(75))
      .text((d) => "$" + format(Number(Math.round(d.value + "e2") + "e-2")))
      .attr("dy", "5")
      .attr("dx", "2em")
      .attr("fill", "white")
      .attr("padding-left", "15px");

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, 230)`)
      .call(xAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", `translate(0, 15)`)
      .style("text-anchor", "end");

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${this.margin.left},0)`)
      .call(yAxis);
  }
}

export { HBarchart };
