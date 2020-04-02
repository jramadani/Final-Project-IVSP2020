class Map {
  constructor(state, setGlobal) {
    this.width = window.innerWidth * 0.4;
    this.height = window.innerHeight * 0.6;
    this.margin = { top: 20, bottom: 50, left: 60, right: 40 };

    let tooltip;

    tooltip = d3
      .select("#hover-content")
      .attr("class", "tooltip")
      .style("position", "sticky");

    this.svg = d3
      .select("#map")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    const projection = d3
      .geoAlbersUsa()
      .fitSize([this.width, this.height], state.districts);

    const path = d3.geoPath().projection(projection);

    this.svg
      .selectAll(".district")
      .data(state.districts.features)
      .join("path")
      .attr("d", path)
      .attr("class", "district")
      .attr("fill", "transparent")
      .attr("stroke", "black")
      // .on("mouseover", d => {
      //   state.hover = { geoid: d.properties.GEOID };
      //   console.log("geoid", state.hover.geoid);
      // })
      .on("click", d => {
        setGlobal({ geoid: d.properties.GEOID });
      })
      .call(
        d3.zoom().on("zoom", d => {
          this.svg.selectAll("path").attr("transform", d3.event.transform);
        })
      )
      .on("mouseover", d => {
        state.hover = {
          translate: [d.x, d.y]
        };
        draw();
      });
  }

  draw(state, setGlobal) {
    console.log("map time!!");

    //tooltip
    if (state.hover) {
      tooltip
        .html(
          `<div>Total amount spent on ${selectedCategory}: $placeholder </div>`
        )
        .transition()
        .duration(500)
        .style("background-color", "white")
        .style("color", "#A50026")
        .style("border-radius", "15px")
        .style("padding", "15px")
        .style("opacity", 0.85)
        .style(
          "transform",
          `translate(${state.hover.translate[0]}px, ${state.hover.translate[1]}px)`
        );
    }
  }
}

export { Map };
