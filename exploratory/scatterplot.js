class Scatterplot {
  constructor(state, setGlobal) {
    this.width = window.innerWidth * 0.4;
    this.height = window.innerHeight * 0.4;
    this.margins = { top: 20, bottom: 20, left: 20, right: 20 };

    let svg;
    let xScale;
    let yScale;
    let yAxis;

    //thinking of turning this into a bar chart instead, based on binning each month
    this.svg = d3
      .select("#scatterplot")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
  }
  draw(state, setGlobal) {
    console.log("here is the scatterplot!");

    // xScale = d3
    //   .scaleTime()
    //   .domain(d3.extent(state.spending, d => ))
    //   .range([margin.left, width - margin.right]);

    // yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);

    // const xAxis = d3.axisBottom(xScale);
    // yAxis = d3.axisLeft(yScale);

    // svg
    //   .append("g")
    //   .attr("class", "axis x-axis")
    //   .attr("transform", `translate(0,${height - margin.bottom})`)
    //   .call(xAxis)
    //   .append("text")
    //   .attr("class", "axis-label")
    //   .attr("x", "50%")
    //   .attr("dy", "3em")
    //   .text("Date")
    //   .attr("fill", "#259D98");

    // svg
    //   .append("g")
    //   .attr("class", "axis y-axis")
    //   .attr("transform", `translate(${margin.left},0)`)
    //   .call(yAxis)
    //   .append("text")
    //   .attr("transform", "rotate(-90)")
    //   .attr("y", 0 - margin.left / 2)
    //   .attr("x", 0 - height / 2)
    //   .attr("dy", "1em")
    //   .style("text-anchor", "middle")
    //   .text("Amount Spent")
    //   .attr("fill", "#259D98");
  }
}
export { Scatterplot };
