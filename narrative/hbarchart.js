class HBarchart {
  constructor(state, setGlobalState) {
    this.width = window.innerWidth * 0.8;
    this.height = window.innerHeight * 0.6;
    this.margin = { top: 20, bottom: 50, left: 200, right: 40 };
  }

  draw(state, setGlobalState) {
    //BAR CHART

    //DATA AGGREGATION
    let traveldata = state.spending.filter((d) => d.CATEGORY == "TRAVEL");

    const nestedData = d3
      .nest()
      .key((d) => d.BIOGUIDE_ID)
      .rollup((d) => d3.sum(d, (d) => d.AMOUNT))
      .entries(traveldata);

    console.log("data", nestedData);

    //   let sumData = d3.sum((d) => d.value);

    //   const data = {
    //     children: originalData.map(item => ({value: item}))
    // };

    let topData = nestedData
      .sort(function (a, b) {
        return d3.descending(+a.value, +b.value);
      })
      .slice(0, 10);

    console.log("testing", topData);

    // topData.forEach((d) => d.key);

    // let namesMap = {
    //   children: topData.map((d) => (d.key = state.reps.bioguide_id)),
    // };

    // console.log("reps", namesMap);

    // let finalData = topData.find((d) => d.key == state.reps.bioguide_id);

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
      .attr("y", (d) => yScale(d.key))
      .attr("x", xScale(0))
      .attr("height", yScale.bandwidth())
      .attr("width", (d) => xScale(d.value) - xScale(0))
      .attr("fill", "green");

    const text = svg
      .selectAll("text")
      .data(topData)
      .join("text")
      .attr("class", "label")
      .attr("y", (d) => yScale(d.key) + yScale.bandwidth() / 2)
      .attr("x", xScale(75))
      .text((d) => d.value)
      .attr("dy", "5")
      .attr("dx", "2em")
      .attr("fill", "white")
      .attr("padding-left", "15px");

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, 275)`)
      .call(xAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${this.margin.left},0)`)
      .call(yAxis);
  }
}

export { HBarchart };
