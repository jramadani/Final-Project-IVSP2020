class Map {
  constructor(state, setGlobal) {
    this.width = window.innerWidth * 0.4;
    this.height = window.innerHeight * 0.6;
    this.margin = { top: 20, bottom: 50, left: 60, right: 40 };

    this.tooltip = d3
      .select("#summarystats")
      .attr("class", "tooltip")
      .style("position", "relative");

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
      .on("click", (district) => {
        const geoid = district.properties.GEOID;
        const rep = state.reps.find((rep) => rep.geoid == geoid);
        setGlobal({
          geoid: geoid,
          rep: rep.bioguide_id,
        });
      })
      .call(
        d3.zoom().on("zoom", (d) => {
          this.svg.selectAll("path").attr("transform", d3.event.transform);
          tooltip.attr("display", "none");
        })
      );
  }

  draw(state, setGlobal) {
    console.log("map time!!");

    this.svg
      .selectAll(".district")
      .data(state.districts.features)
      .on("mouseover", (d) => {
        const hovergeoid = d.properties.GEOID;
        const hoverep = state.reps.find(
          (hoverep) => hoverep.geoid == hovergeoid
        );
        setGlobal({
          hovergeoid: hovergeoid,
          hoverep: hoverep.bioguide_id,
        });

        const filteredSpending = state.spending.filter(
          (d) => state.hoverep == d.BIOGUIDE_ID
        );
        const format = d3.format(",d");

        state.hover = { total: d3.sum(filteredSpending, (d) => d.AMOUNT) };
        if (state.hover) {
          this.tooltip.html(
            `<div>Hon. ${hoverep.full_name} <br> ${hoverep.party} <br> ${
              hoverep.full_state
            } District ${hoverep.district}</div><br>
          <div>Total amount spent: <span id="granular">${format(
            Number(Math.round(state.hover.total + "e2") + "e-2")
          )} </span></div>`
          );
        }
      });
  }
}

export { Map };
