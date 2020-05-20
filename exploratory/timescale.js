class Timescale {
  constructor(state, setGlobal) {
    this.width = window.innerWidth * 0.4;
    this.height = window.innerHeight * 0.4;
    this.margins = { top: 20, bottom: 20, left: 120, right: 90 };

    this.svg = d3
      .select("#timescale")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
  }
  draw(state, setGlobal) {
    console.log("here is the timescale!");

    const formatter = d3.timeFormat("%m/%d/%y");
    const parser = d3.timeParse("%m/%d/%y");
    let xScale, yScale, xAxis, yAxis;
    let radius = 5;

    let data = state.yearFiltered.filter((d) => d["START DATE"] != null);

    let filteredSpending = data.filter((d) => state.rep == d.BIOGUIDE_ID);

    let catFiltered = filteredSpending.filter(
      (d) => state.selectedCategory == d.CATEGORY
    );

    let consolidated = d3
      .nest()
      .key((d) => formatter(parser(d["START DATE"])))
      .rollup((d) => d3.sum(d, (d) => d.AMOUNT))
      .entries(catFiltered);

    console.log("consolidated", consolidated);

    xScale = d3
      .scaleTime()
      .domain(d3.extent(filteredSpending, (d) => parser(d["START DATE"])))
      // .domain(d3.extent(consolidated, (d) => parser(d.key)))
      .range([this.margins.left, this.width - this.margins.right]);

    yScale = d3
      .scaleLinear()
      .range([this.height - this.margins.bottom, this.margins.top]);

    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);

    this.svg
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0,${this.height - this.margins.bottom})`)
      .call(xAxis)
      .append("text")
      .attr("class", "axis-label")
      .attr("x", "50%")
      .attr("dy", "3em")
      .text("Date")
      .attr("fill", "#259D98");

    this.svg
      .append("g")
      .attr("class", "axis y-axis")
      .attr("transform", `translate(${this.margins.left},0)`)
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margins.left / 2)
      .attr("x", 0 - this.height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Amount Spent")
      .attr("fill", "green");

    // scale update
    yScale.domain([0, d3.max(consolidated, (d) => d.value)]);

    // axis update
    d3.select("g.y-axis").transition().duration(1000).call(yAxis.scale(yScale));

    const dot = this.svg
      .selectAll(".dot")
      .data(consolidated, (d) => d.key)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("class", "dot")
            .attr("r", radius)
            .attr("cy", (d) => yScale(d.value))
            .attr("cx", (d) => xScale(new Date(d.key)))
            .attr("fill", "green"),
        (update) => update,
        (exit) =>
          exit.call((exit) =>
            exit
              .transition()
              .delay((d, i) => i * 10)
              .duration(500)
              .attr("cy", this.height - this.margins.bottom)
              .remove()
          )
      )
      .call((selection) =>
        selection
          .transition()
          .duration(1000)
          .attr("cy", (d) => yScale(d.value))
      );
  }
}
export { Timescale };
