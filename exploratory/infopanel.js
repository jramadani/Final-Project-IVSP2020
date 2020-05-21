class InfoPanel {
  constructor(state, setGlobal) {
    this.container = d3.select("#infopanel");
  }
  draw(state, setGlobal) {
    console.log("here is the infopanel");

    //MAIN REP FILTER
    const filteredReps = state.reps.find((d) => state.rep == d.bioguide_id);

    //WORKING FILTERS
    const yearFinder = Array.from(new Set(state.spending.map((d) => d.YEAR)));
    const categorySelection = Array.from(
      new Set(state.spending.map((d) => d.CATEGORY))
    );

    //FILLING THE FILTERS

    // CATEGORY
    this.cat = d3.select(".category").on("change", function () {
      console.log("new selection is", this.value);
      setGlobal({ selectedCategory: (state.selectedCategory = this.value) });
    });

    const categor = this.cat
      .selectAll("option")
      .data(categorySelection)
      .join("option")
      .attr("value", (d) => d)
      .text((d) => d);

    //YEAR BUTTONS

    this.button = d3.select("#year");

    const years = this.button
      .selectAll("button")
      .data(yearFinder)
      .join("button")
      .attr("value", (d) => d)
      .text((d) => d)
      .attr("color", "white")
      .on("click", function () {
        console.log("new selection is", this.value);
        setGlobal({
          selectedYear: this.value,
          yearFiltered: state.spending.filter((d) => this.value == d.YEAR),
        });
      });

    this.container
      .selectAll(".info")
      .data(filteredReps)
      .join("div", (d) => {
        if (state.rep) {
          this.container
            .html(
              `<div>Hon. ${filteredReps.full_name} | ${filteredReps.party} | ${filteredReps.full_state} District ${filteredReps.district}</div><br>
                <div><i class="fab fa-facebook-f"></i> ${filteredReps.facebook}</div>
                <div><i class="fab fa-twitter"></i> @${filteredReps.twitter}</div>
                <div><a href="https://youtube.com/${filteredReps.youtube_id}"><i class="fab fa-youtube"></i> YouTube</a></div>
                <div><i class="fas fa-link"></i> ${filteredReps.url}</div>
                <div><i class="fas fa-envelope"></i> ${filteredReps.contact_form}</div><br>
                <div><i class="fas fa-map-marker-alt"></i> ${filteredReps.address}</div>
                <div><i class="fas fa-phone-alt"></i> ${filteredReps.phone}</div>`
            )
            .style("background-color", "white")
            .style("color", "green")
            .style("border-radius", "15px")
            .style("padding", "15px")
            .style("padding-top", "75px")
            .transition()
            .duration(1000)
            .style("opacity", 0.85);
        }
      });
  }
}

export { InfoPanel };
