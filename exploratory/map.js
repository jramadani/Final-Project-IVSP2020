class Map {
  constructor(state, setGlobalState) {
    const width = window.innerWidth * 0.9,
      height = window.innerHeight * 0.7,
      margin = { top: 20, bottom: 50, left: 60, right: 40 };

    function init() {
      svg = d3
        .select("#d3-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      // + SET UP PROJECTION
      const projection = d3
        .geoAlbersUsa()
        .fitSize([width, height], state.districts);

      // + SET UP GEOPATH
      const path = d3.geoPath().projection(projection);

      // + DRAW BASE MAP PATH
      svg
        .selectAll(".borough")
        .data(state.districts.features)
        .join("path")
        .attr("d", path)
        .attr("class", "borough")
        .attr("fill", "transparent")
        .attr("stroke", "black");
      // draw(); // calls the draw function
    }
  }

  draw() {}
}

export { Map };
