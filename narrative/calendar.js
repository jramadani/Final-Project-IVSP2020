class Calendar {
  constructor(state, setGlobalState) {
    let widthOverall = window.innerWidth * 0.4;
    let heightOverall = window.innerHeight * 0.6;
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

    let data = state.spending.filter((d) => d.CATEGORY == "TRAVEL");

    // in essence, because my data is different from bostock's in that
    // i need to nest it by date, within each year.
    //it's the same concept as nesting the data by year.
    // i'll keep the dates/values arrays for now, but i get the feeling i don't need them

    //set up an array of all the dates in the data which we need to work out the range of the data
    let dates = new Array();
    let values = new Array();

    //parse the data
    data.forEach(function (d) {
      dates.push(d["START DATE"]);
      values.push(d.AMOUNT);
      d.date = new Date(d["START DATE"]);
      d.value = d.AMOUNT;
      d.year = d.YEAR; //extract the year from the data
    });

    dates.sort();

    let testy = new Set(dates.map((d) => (d ? d.replace(/\d/g, "0") : d)));
    console.log("dates", dates);
    console.log("values", values);
    console.log("testy", testy);

    data = data.filter((d) => d["START DATE"] != null);

    console.log("data", data);

    let years = d3
      .nest()
      .key((d) => d.YEAR)
      .key((d) => d["START DATE"])
      .rollup((d) => d3.sum(d, (d) => d.AMOUNT))
      .entries(data);

    // years = years[1].values.reduce(
    //   (o, d) => ((o[d.key] = (o[d.key] || 0) + 1), o),
    //   {}
    // );

    // years = years.filter((row) => new Date(row.date).endsWith("18"));
    // years = years.filter((d) => d.key.values[0].endsWith("18"));

    console.log("years", years);
    // console.log("yearSorted", yearSorted);

    // //pathMonth function -- does the work of creating each month.

    // function pathMonth(t) {
    //   const n = 7;
    //   const d = Math.max(0, Math.min(n, countDay(t)));
    //   const w = timeWeek.count(d3.utcYear(t), t);
    //   return `${
    //     d === 0
    //       ? `M${w * cellSize},0`
    //       : d === n
    //       ? `M${(w + 1) * cellSize},0`
    //       : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`
    //   }V${n * cellSize}`;
    // }

    // //STRUCTURE FROM BOSTOCK FOR A START

    // const container = d3.select("#calendar").style("position", "relative");

    // let svg = container
    //   .append("svg")
    //   // .attr("viewBox", [0, 0, this.width, this.height * years.length])
    //   .attr("width", this.widthOverall)
    //   .attr("height", this.heightOverall)
    //   .attr("font-family", "sans-serif")
    //   .attr("font-size", 10);

    // const year = svg
    //   .selectAll("g")
    //   .data(years)
    //   .join("g")
    //   .attr(
    //     "transform",
    //     (d, i) => `translate(40.5,${this.heightOverall * i + cellSize * 1.5})`
    //   );

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

    // year
    //   .append("g")
    //   .selectAll("rect")
    //   //it's difficult to pinpoint what exactly about this data isn't getting parsed right now
    //   //because it's very late, but something about this isn't getting accessed correctly
    //   .data(years)
    //   .join("rect")
    //   .attr("width", cellSize - 1)
    //   .attr("height", cellSize - 1)
    //   .attr(
    //     "x",
    //     (d) => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 0.5
    //   )
    //   .attr("y", (d) => countDay(d.date) * cellSize + 0.5)
    //   .attr("stroke", "black")
    //   // .attr("fill", (d) => color(d.value))
    //   .append("title")
    //   .text(
    //     (d) => `${formatDate(d.date)}
    // ${formatValue(d.value)}
    //     `
    //   );

    // const month = year
    //   .append("g")
    //   .selectAll("g")
    //   .data(([, values]) =>
    //     d3.utcMonths(
    //       d3.utcMonth(values[0].date),
    //       values[values.length - 1].date
    //     )
    //   )
    //   .join("g");

    // month
    //   .filter((d, i) => i)
    //   .append("path")
    //   .attr("fill", "none")
    //   .attr("stroke", "#fff")
    //   .attr("stroke-width", 3)
    //   .attr("d", pathMonth);

    // month
    //   .append("text")
    //   .attr(
    //     "x",
    //     (d) => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2
    //   )
    //   .attr("y", -5)
    //   .text(formatMonth);
  }
}
export { Calendar };
