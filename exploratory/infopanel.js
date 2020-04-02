class InfoPanel {
  constructor(state, setGlobal) {
    this.container = d3.select("#infopanel");
  }
  draw(state, setGlobal) {
    console.log("here is the infopanel");

    //when map registers a click, grabbing a geoid, then we should match that geoid to state.reps

    //MAIN REP FILTER -- CURRENTLY NOT WORKING
    const filteredData = state.reps.map(d => state.geoid === d.geoid);

    //WORKING FILTERS
    const yearFinder = [
      ...Array.from(new Set(state.spending.map(d => d.YEAR)))
    ];
    const categorySelection = [
      ...Array.from(new Set(state.spending.map(d => d.CATEGORY)))
    ];
    const purposeSelection = [
      ...Array.from(new Set(state.spending.map(d => d.PURPOSE)))
    ];

    //FILLING THE FILTERS

    // CATEGORY
    this.cat = d3.select(".category").on("change", function() {
      console.log("new selection is", this.value);
      state.selectedCategory = this.value;
      draw();
    });

    const categor = this.cat
      .selectAll("option")
      .data(categorySelection)
      .join("option")
      .attr("value", d => d)
      .text(d => d);

    //PURPOSE -- will probably not use this one

    this.pur = d3.select(".purpose").on("change", function() {
      console.log("new selection is", this.value);
      state.selectedPurpose = this.value;
      draw();
    });

    const purpose = this.pur
      .selectAll("option")
      .data(purposeSelection)
      .join("option")
      .attr("value", d => d)
      .text(d => d);

    //YEAR BUTTONS

    this.button = d3.select("#year");

    const years = this.button
      .selectAll("button")
      .data(yearFinder)
      .join("button")
      .text(d => d)
      .attr("color", "white")
      .on("click", d => setGlobal({ selectedYear: d.YEAR }));

    // if (state.rep) {
    //   container
    //     .html(
    // <div>Hon. ${state.rep.full_name}</div>
    //     <div>${state.rep.party}</div>
    //     <div>${state.rep.facebook}</div>
    //     <div>${state.rep.twitter}</div>
    //     <div>${state.rep.youtube_id}</div>
    //     <div>${state.rep.url}</div>
    //     <div>${state.rep.contact_form}</div>
    //     <div>${state.rep.address}</div>
    //     <div>${state.rep.phone</div>`
    //     )
    //     .transition()
    //     .duration(500)
    //     .style("background-color", "white")
    //     .style("color", "#A50026")
    //     .style("border-radius", "15px")
    //     .style("padding", "15px")
    //     .style("opacity", 0.85)
  }
}

export { InfoPanel };
