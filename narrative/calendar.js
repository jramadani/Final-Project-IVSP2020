class Calendar {
  constructor(state, setGlobalState) {
    this.widthOverall = window.innerWidth * 0.6;
    this.heightOverall = window.innerHeight * 0.3;
    this.margin = { top: 20, bottom: 50, left: 60, right: 40 };
  }

  draw(state, setGlobalState) {
    let cellSize = 17;
    let width = 960;
    let height = 163;
    let formatMonth = d3.utcFormat("%b");
    let formatDay = (d) => "SMTWTFS"[d.getUTCDay()];
    let formatDate = d3.utcFormat("%x");
    let format = d3.format(",d");

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

    let data1 = state.caldata;

    console.log("data", data1);

    // const sumTotal = 0;

    let wrapper = data1.map(function (years) {
      return {
        year: years.key,
        dates: years.values
          .map(function (date) {
            return {
              date: parser(date.key),
              // total: ,
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

    wrapper[0].dates.splice([86], 1);

    //the below isn't perfect, but gets the job done re: getting a sum total value

    wrapper.forEach((year) =>
      year.dates.forEach((date) => {
        let sumTotal = 0;
        (date.reps || []).forEach((rep) => {
          (rep.purposes || []).forEach((purpose) => {
            if (!purpose) return;
            sumTotal += purpose.value[0].AMOUNT;
          });
        });
        Object.assign(date, { total: sumTotal });
      })
    );

    console.log("wrapper", wrapper);

    //color test

    let color = d3
      .scaleSequential()
      .domain([0, 500000])
      .interpolator(d3.interpolateGreens);

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
      .attr("class", "calendarsvg")
      .attr("width", this.widthOverall)
      .attr("height", this.heightOverall * 2)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);

    const year = svg
      .selectAll("g")
      .data(wrapper)
      .join("g")
      .attr(
        "transform",
        (d, i) => `translate(45, ${height * i + cellSize * 1.5})`
      );

    year
      .append("text")
      .attr("x", -5)
      .attr("y", -5)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text((d) => d.year);

    year
      .append("g")
      .attr("text-anchor", "end")
      .selectAll("text")
      .data(d3.range(7).map((i) => new Date(1995, 0, i)))
      .join("text")
      .attr("x", -5)
      .attr("y", (d) => (countDay(d) + 0.5) * cellSize)
      .attr("dy", "0.31em")
      .text(formatDay)
      .attr("color", "black");

    year
      .append("g")
      .attr("class", "dates")
      .selectAll("rect")
      .data((d) => d.dates)
      .join("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr(
        "x",
        (d) => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 0.5
      )
      .attr("y", (d) => countDay(d.date) * cellSize + 0.5)
      .attr("stroke", "white")
      .attr(
        "fill",
        //static color
        // "green"

        // dynamic color test
        // (d) => {

        (d) => color((d) => d.total)
        // }
      ) //the color scale here is dependent on the value
      .attr("padding", "5px")
      .append("title")
      .text(
        (d) =>
          `${formatDate(d.date)} | ${format(
            Number(Math.round(d.total + "e2") + "e-2")
          )}`
      );

    const month = year
      .append("g")
      .attr("class", "months")
      .selectAll("g")
      .data((d) =>
        d3.utcMonths(
          d3.utcMonth(d.dates.date),
          d.dates[d.dates.length - 1].date
        )
      )
      .join("g");

    console.log("month", month);

    month
      .filter((d, i) => i)
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .attr("d", pathMonth);

    console.log("month again", month);

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
