import React, { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import styles from "./SpeedScatterPlot.module.scss";

const margin = { top: 10, right: 30, bottom: 30, left: 60 };
const widthDesktop = 640 - margin.left - margin.right;
const heightDesktop = 400 - margin.top - margin.bottom;
const widthMobile = 360 - margin.left - margin.right;
const heightMobile = 250 - margin.top - margin.bottom;
const tresholdVast = 168;
const tresholdMobiel = 84;
const topCountriesVast = ["South Korea", "United States", "China"];
const topCountriesMobile = ["Qatar", "Cyprus"];
const redLanternCountries = ["Lithuania", "Slovenia", "Cuba", "Sudan"];
const countriesTranslation = {
  "South Korea": "Zuid Korea",
  "United States": "VS",
  China: "China",
  Qatar: "Qatar",
  Cyprus: "Cyprus",
  Lithuania: "Litouwen",
  Slovenia: "Slovenië",
  Cuba: "Cuba",
  Sudan: "Soedan",
};

export interface Props {
  currentPart: string;
  isMobileSize: boolean;
  title: string;
  active: boolean;
}

function SpeedScatterPlot(props: Props) {
  const scatterRef = useRef(null);
  const title = props.title;

  useEffect(() => {
    let svg: any;

    if (scatterRef.current && props.active) {
      if (scatterRef.current.childNodes.length > 0) {
        scatterRef.current.childNodes.forEach((childnode) => {
          childnode.tagName == "H2" || childnode.tagName == "P"
            ? ""
            : scatterRef.current.removeChild(childnode);
        });
      }

      svg = d3
        .select(scatterRef.current)
        .append("svg")
        .attr(
          "width",
          `${
            props.isMobileSize
              ? widthMobile + margin.left + margin.right
              : widthDesktop + margin.left + margin.right
          }`
        )
        .attr(
          "height",
          `${
            props.isMobileSize
              ? heightMobile + margin.top + margin.bottom
              : heightDesktop + margin.top + margin.bottom
          }`
        )
        .append("g")
        .attr("class", "containerG")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const containerWidth = d3.select(scatterRef.current).select("svg").node()
        .parentElement.clientWidth;
      const offsetLeft = (containerWidth - widthMobile) / 2;

      //Read the data
      d3.csv("/data/webSpeedsCountry.csv").then(function (data) {
        // Add X axis
        const x = d3
          .scaleLinear()
          .domain([0, 250])
          .range([0, `${props.isMobileSize ? widthMobile : widthDesktop}`]);
        const xAxisGrid = d3
          .axisBottom(x)
          .ticks(4)
          .tickSize(-`${props.isMobileSize ? heightMobile : heightDesktop}`);

        svg
          .append("g")
          .attr("class", "x axis-grid")
          .attr(
            "transform",
            `translate(0,${props.isMobileSize ? heightMobile : heightDesktop})`
          )
          .call(xAxisGrid);

        // Add Y axis
        const y = d3
          .scaleLinear()
          .domain([0, 200])
          .range([`${props.isMobileSize ? heightMobile : heightDesktop}`, 0]);

        const yAxis = d3.axisLeft(y).ticks(5);
        svg.append("g").attr("class", "y axis").call(yAxis);

        const yAxisGrid = d3
          .axisLeft(y)
          .tickSize(-`${props.isMobileSize ? widthMobile : widthDesktop}`)
          .tickFormat("")
          .ticks(5);
        svg.append("g").attr("class", "y axis-grid").call(yAxisGrid);

        svg
          .selectAll(".tick line")
          .attr("stroke", "grey")
          .attr("stroke-dasharray", "4");

        svg
          .selectAll("path.domain")
          .attr("stroke", "grey")
          .attr("stroke-dasharray", "4");

        svg
          .append("text")
          .attr("text-anchor", "middle")
          .attr(
            "x",
            `${props.isMobileSize ? widthMobile / 2 : widthDesktop / 2}`
          )
          .attr(
            "y",
            `${
              (props.isMobileSize ? heightMobile : heightDesktop) +
              margin.top +
              18
            }`
          )
          .text("Mbit per seconde vast")
          .style("font-family", "ProximaNovaRegular")
          .style("fill", "var(--content-copy)");

        // Y axis label:
        svg
          .append("text")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-90)")
          .attr("y", -margin.left + 20)
          .attr("x", -margin.top)
          .text("Mbit per seconde mobiel")
          .style("fill", "var(--content-copy)")
          .style("font-family", "ProximaNovaRegular");

        const helpLines = svg.append("g").attr("class", "helpLines");
        helpLines
          .append("rect")
          .attr("class", "topMobiel helpLine")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", x(tresholdVast))
          .attr("height", y(tresholdMobiel))
          .style("fill", "#F05031")
          .style("opacity", 0);

        helpLines
          .append("text")
          .text("Alleen mobiel in de top 20")
          .attr("class", "topMobiel helpLine rectLabel")
          .attr("x", x(tresholdVast) / 2)
          .attr("y", y(tresholdMobiel) / 2)
          .attr("text-anchor", "middle")
          .style("opacity", 0)
          .style("font-family", "ProximaNovaRegular")
          .style("fill", "#F05031");

        helpLines
          .append("rect")
          .attr("class", "topVastMobiel helpLine")
          .attr("x", x(tresholdVast))
          .attr("y", 0)
          .attr(
            "width",
            `${
              (props.isMobileSize ? widthMobile : widthDesktop) -
              x(tresholdVast)
            }`
          )
          .attr("height", y(tresholdMobiel))
          .style("fill", "#F05031")
          .style("opacity", 0);

        helpLines
          .append("text")
          .attr("text-anchor", "middle")
          .attr("class", "topVastMobiel helpLine rectLabel")
          .style("opacity", 0)
          .style("font-family", "ProximaNovaRegular")
          .style("fill", "#a3180f");

        helpLines
          .selectAll(".topVastMobiel.rectLabel")
          .append("tspan")
          .text("Zowel vast")
          .attr(
            "x",
            `${
              parseInt(x(tresholdVast)) +
              ((props.isMobileSize ? widthMobile : widthDesktop) -
                x(tresholdVast)) /
                2
            }`
          )
          .attr("y", y(tresholdMobiel) / 2);

        helpLines
          .selectAll(".topVastMobiel.rectLabel")
          .append("tspan")
          .text("als mobiel")
          .attr(
            "x",
            `${
              parseInt(x(tresholdVast)) +
              ((props.isMobileSize ? widthMobile : widthDesktop) -
                x(tresholdVast)) /
                2
            }`
          )
          .attr("y", y(tresholdMobiel) / 2 + 20);

        helpLines
          .selectAll(".topVastMobiel.rectLabel")
          .append("tspan")
          .text("in top 20")
          .attr(
            "x",
            `${
              parseInt(x(tresholdVast)) +
              ((props.isMobileSize ? widthMobile : widthDesktop) -
                x(tresholdVast)) /
                2
            }`
          )
          .attr("y", y(tresholdMobiel) / 2 + 40);

        helpLines
          .append("rect")
          .attr("class", "redLantern helpLine")
          .attr("x", 0)
          .attr("y", y(tresholdMobiel))
          .attr("width", x(tresholdVast))
          .attr(
            "height",
            `${
              (props.isMobileSize ? heightMobile : heightDesktop) -
              y(tresholdMobiel)
            }`
          )
          .style("fill", "#F05031")
          .style("opacity", 0);

        helpLines
          .append("text")
          .text("Achterblijvers")
          .attr("class", "redLantern helpLine rectLabel")
          .attr("x", x(tresholdVast) / 1.5)
          .attr(
            "y",
            `${
              (props.isMobileSize ? heightMobile : heightDesktop) -
              y(tresholdMobiel) / 5
            }`
          )
          .attr("text-anchor", "middle")
          .style("opacity", 0)
          .style("font-family", "ProximaNovaRegular")
          .style("fill", "#a3180f");

        helpLines
          .append("line")
          .attr("class", "topLine helpLine")
          .attr("x1", x(tresholdVast))
          .attr("y1", 0)
          .attr("x2", x(tresholdVast))
          .attr("y2", `${props.isMobileSize ? heightMobile : heightDesktop}`)
          .style("stroke", "var(--content-copy)")
          .style("stroke-width", "2px")
          .style("stroke-dasharray", "5,5")
          .style("opacity", 0);

        helpLines
          .append("line")
          .attr("class", "topLine helpLine")
          .attr("x1", 0)
          .attr("y1", y(tresholdMobiel))
          .attr("x2", `${props.isMobileSize ? widthMobile : widthDesktop}`)
          .attr("y2", y(tresholdMobiel))
          .style("stroke", "var(--content-copy)")
          .style("stroke-width", "2px")
          .style("stroke-dasharray", "5,5")
          .style("opacity", 0);

        // Add dots
        svg
          .append("g")
          .selectAll("dot")
          .data(data)
          .join("circle")
          .attr("cx", 0)
          .attr("cy", `${props.isMobileSize ? heightMobile : heightDesktop}`)
          .attr("r", (d) => {
            return d.Country == "Germany"
              ? 6
              : d.Country == "Netherlands"
              ? 6
              : 4;
          })
          .attr("id", (d) => `circle_${d.Country}`)
          .attr("stroke", "#FFEADB")
          .attr("stroke-width", 1)
          .style("fill", (d) => {
            return d.Country == "Germany"
              ? "#a3180f"
              : d.Country == "Netherlands"
              ? "#F05031"
              : "#A6988F";
          });

        svg
          .selectAll("circle")
          .transition()
          .delay((_, i) => {
            return i * 3;
          })
          .duration(1000)
          .attr("cx", (d) => {
            return x(d.Mbps_vast);
          })
          .attr(
            "cy",
            `${(props.isMobileSize ? heightMobile : heightDesktop) - 4}`
          );

        d3.select(scatterRef.current)
          .append("div")
          .data(data.filter((d) => d.Country == "Germany"))
          .attr("class", "tooltip")
          .attr("id", "ttDE")
          .html("Duitsland");

        d3.select(scatterRef.current)
          .append("div")
          .data(data.filter((d) => d.Country == "Netherlands"))
          .attr("class", "tooltip")
          .attr("id", "ttNL")
          .html("Nederland");

        d3.selectAll(".tooltip")
          .style("opacity", 0)
          .style("background-color", (d) =>
            d.Country == "Germany"
              ? "#a3180f"
              : d.Country == "Netherlands"
              ? "#F05031"
              : "black"
          )
          .style("color", "#FFEADB")
          .style("padding", "5px")
          .style("font-family", "ProximaNovaRegular")
          .style("position", "absolute")
          .style("top", () => {
            const topTemp = props.isMobileSize
              ? heightMobile + 9
              : heightDesktop + 13;
            return `${topTemp}px`;
          })
          .transition()
          .duration(1000)
          .style("opacity", 1)
          .style("left", (d) => {
            const leftMargin = props.isMobileSize
              ? d.Country == "Germany"
                ? -36 + offsetLeft
                : 12 + offsetLeft
              : 60;
            return `${parseFloat(x(parseFloat(d.Mbps_vast))) + leftMargin}px`;
          });

        svg
          .append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", props.isMobileSize ? 10 : 14)
          .selectAll("text")
          .data(data)
          .join("text")
          .attr("dy", "0.35em")
          .attr("x", (d) => parseFloat(x(d.Mbps_vast)) + 7)
          .attr("y", (d) => y(d.Mbps_mobiel))
          .text((d) => {
            return topCountriesMobile.indexOf(d.Country) > -1
              ? countriesTranslation[d.Country]
              : topCountriesVast.indexOf(d.Country) > -1
              ? countriesTranslation[d.Country]
              : redLanternCountries.indexOf(d.Country) > -1
              ? countriesTranslation[d.Country]
              : "";
          })
          .attr("class", (d) => {
            return topCountriesMobile.indexOf(d.Country) > -1
              ? "topCountriesMobile"
              : topCountriesVast.indexOf(d.Country) > -1
              ? "topCountriesVast"
              : redLanternCountries.indexOf(d.Country) > -1
              ? "redLanternCountries"
              : "";
          })
          .style("font-family", "ProximaNovaRegular")
          .style("fill", "var(--content-copy)")
          .style("opacity", 0);
      });
    }
  }, [props.isMobileSize, props.active]);

  const changeOpacity = useCallback(
    (classString: string, duration = 200, opacity = 0) => {
      d3.selectAll(classString)
        .transition()
        .duration(duration)
        .style("opacity", opacity);
    },
    []
  );

  useEffect(() => {
    if (scatterRef.current && props.active) {
      const containerWidth = d3.select(scatterRef.current).select("svg").node()
        .parentElement.clientWidth;
      const offsetLeft = (containerWidth - widthMobile) / 2;
      if (scatterRef.current) {
        const svg = d3
          .select(scatterRef.current)
          .select("svg")
          .select(".containerG");
        const x = d3
          .scaleLinear()
          .domain([0, 250])
          .range([0, `${props.isMobileSize ? widthMobile : widthDesktop}`]);
        const y = d3
          .scaleLinear()
          .domain([0, 200])
          .range([`${props.isMobileSize ? heightMobile : heightDesktop}`, 0]);

        if (props.currentPart == `7_${title}`) {
          svg.selectAll(".helpLine").style("opacity", 0);

          svg
            .selectAll("circle")
            .transition()
            .delay((_, i) => {
              return i * 3;
            })
            .duration(400)
            .attr("cx", (d) => {
              return x(d.Mbps_vast);
            })
            .attr(
              "cy",
              `${(props.isMobileSize ? heightMobile : heightDesktop) - 4}`
            )
            .attr("class", "");

          svg
            .selectAll(".label")
            .attr("x", (d) => x(d.Mbps_vast) + 7)
            .attr("y", () => y(0))
            .attr("opacity", (d) => {
              if (d.Country == "Germany") {
                return 1;
              } else return 0;
            })
            .text((d) => d.Country);

          d3.selectAll(".tooltip")
            .transition()
            .duration(500)
            .style("top", () => {
              const topTemp = props.isMobileSize
                ? heightMobile + 9
                : heightDesktop + 13;
              return `${topTemp}px`;
            });
        }

        if (
          props.currentPart == `8_${title}` ||
          props.currentPart == `10_${title}`
        ) {
          changeOpacity(".helpLine");
          changeOpacity(".topCountriesVast", 300, 0);
          changeOpacity(".topCountriesMobile", 300, 0);
          changeOpacity(".redLanternCountries", 300, 0);

          svg
            .selectAll("circle")
            .transition()
            .delay((_, i) => {
              return i * 3;
            })
            .duration(400)
            .attr("cx", (d) => {
              return x(d.Mbps_vast);
            })
            .attr("cy", (d) => {
              return y(d.Mbps_mobiel);
            })
            .attr("class", "hasHeight");

          svg
            .selectAll(".label")
            .transition()
            .attr("x", (d) => x(d.Mbps_vast) + 7)
            .attr("y", (d) => y(d.Mbps_mobiel))
            .attr("opacity", (d) => {
              if (d.Country == "Germany") {
                return 1;
              } else return 0;
            })
            .text((d) => d.Country);

          d3.selectAll(".tooltip")
            .transition()
            .duration(500)
            .style("top", (d) => {
              return `${y(parseFloat(d.Mbps_mobiel)) + 13}px`;
            })
            .style("left", (d) => {
              const leftMargin = props.isMobileSize
                ? d.Country == "Germany"
                  ? -36 + offsetLeft
                  : 12 + offsetLeft
                : 60;
              return `${parseFloat(x(parseFloat(d.Mbps_vast))) + leftMargin}px`;
            })
            .style("opacity", 1);
        }

        if (props.currentPart == `9_${title}`) {
          changeOpacity(".helpLine");
          changeOpacity(".topLine", 200, 1);
          changeOpacity(".topVastMobiel", 200, 0.4);
          changeOpacity(".rectLabel.topVastMobiel", 300, 1);
          changeOpacity(".topCountriesVast", 300, 1);
          changeOpacity(".topCountriesMobile", 300, 0);
          changeOpacity(".redLanternCountries", 300, 0);

          props.isMobileSize && changeOpacity(".tooltip", 400, 0);
        }

        if (props.currentPart == `10_${title}`) {
          changeOpacity(".helpLine");
          changeOpacity(".topLine", 200, 1);
          changeOpacity(".redLantern", 200, 0.4);
          changeOpacity(".rectLabel.redLantern", 300, 1);
          changeOpacity(".topCountriesMobile", 300, 0);
          changeOpacity(".topCountriesVast", 300, 0);
          changeOpacity(".redLanternCountries", 300, 1);
        }
      }
    }
  }, [
    props.currentPart,
    changeOpacity,
    props.isMobileSize,
    title,
    props.active,
  ]);

  return (
    <div
      ref={scatterRef}
      className={`${styles.scatterContainer} ${
        props.active ? styles.active : ""
      }`}
    >
      <h2 className={styles.title}>Duitsland niet de snelste</h2>
      <p className={styles.title}>
        Gemiddelde snelheid voor vast en mobiel internet, in juli 2021
      </p>
      {!props.isMobileSize && (
        <p className={styles.disclaimer}>
          *Niet voor alle landen is een vaste én mobiele snelheid bekend
        </p>
      )}
    </div>
  );
}

export { SpeedScatterPlot };
