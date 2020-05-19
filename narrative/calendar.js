class Calendar {
  constructor(state, setGlobalState) {
    let widthOverall = window.innerWidth * 0.8;
    let heightOverall = window.innerHeight * 0.8;
    let margin = { top: 20, bottom: 50, left: 60, right: 40 };
  }

  draw(state, setGlobalState) {
    let cellSize = 17;
    let width = 960;
    let height = 163;
    let formatMonth = d3.utcFormat("%b");
    let formatDay = (d) => "SMTWTFS"[d.getUTCDay()];
    let formatDate = d3.utcFormat("%x");

    //these functions create the format for the datetime

    let countDay = (d) => d.getUTCDay();
    let timeWeek = d3.utcSunday;

    //OFFICE HOURS APPROACH:

    const milliSecondsPerDay = 1000 * 60 * 60 * 24;
    const formatter = d3.timeFormat("%m/%d/%y");
    const parser = d3.timeParse("%m/%d/%y");
    const yearFormatter = d3.timeFormat("%Y");
    const yearParser = d3.timeParse("%Y");
    const numToInclude = 10;

    let data = state.caldata;
    console.log("data", data);

    let wrapper = data.map(function (years) {
      return {
        year: years.key,
        dates: years.values
          .map(function (date) {
            return {
              date: parser(date.key),
              reps: date.values.map(function (rep) {
                return {
                  rep: rep.key,
                  purposes: rep.values.map(function (purpose) {
                    return {
                      purpose: purpose.key,
                      value: purpose.value,
                    };
                  }),
                };
              }),
            };
          })
          .sort((a, b) => d3.ascending(a.date, b.date)),
      };
    });
    console.log("wrapper", wrapper);

    //pathMonth function -- does the work of creating each month.

    function pathMonth(t) {
      const n = 7;
      const d = Math.max(0, Math.min(n, countDay(t)));
      const w = timeWeek.count(d3.utcYear(t), t);
      return `${
        d === 0
          ? `M${w * cellSize},0`
          : d === n
          ? `M${(w + 1) * cellSize},0`
          : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`
      }V${n * cellSize}`;
    }

    //STRUCTURE FROM BOSTOCK FOR A START

    const container = d3.select("#calendar").style("position", "relative");

    let svg = container
      .append("svg")
      .attr("width", this.widthOverall)
      .attr("height", this.heightOverall)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);

    const year = svg.selectAll("g").data(wrapper).join("g");
    // .attr("transform", `translate(40.5, ${})`);

    // year
    //   .append("text")
    //   .attr("x", -5)
    //   .attr("y", -5)
    //   .attr("font-weight", "bold")
    //   .attr("text-anchor", "end")
    //   .text((d) => d);

    // year
    //   .append("g")
    //   .attr("text-anchor", "end")
    //   .selectAll("text")
    //   .data(d3.range(7).map((i) => new Date(1995, 0, i)))
    //   .join("text")
    //   .attr("x", -5)
    //   .attr("y", (d) => (countDay(d) + 0.5) * cellSize)
    //   .attr("dy", "0.31em")
    //   .text(formatDay)
    //   .attr("color", "black");

    year
      .append("g")
      .selectAll("rect")
      .data(
        // (d) => {
        // for (const i in wrapper) {
        //   return d.dates;
        // }
        wrapper[1].dates
        // }
      )
      .join("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr(
        "x",
        (d) => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 0.5
      )
      .attr("y", (d) => countDay(d.date) * cellSize + 0.5)
      .attr("stroke", "black")
      .attr("fill", "white")
      .append("title")
      .text(
        (d) => `${formatDate(d.date)}
        `
      );

    const month = year
      .append("g")
      .selectAll("g")
      .data(([, values]) =>
        d3.utcMonths(
          d3.utcMonth(values[0].date),
          values[values.length - 1].date
        )
      )
      .join("g");

    month
      .filter((d, i) => i)
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .attr("d", pathMonth);

    month
      .append("text")
      .attr(
        "x",
        (d) => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2
      )
      .attr("y", -5)
      .text(formatMonth);
  }
}
export { Calendar };
