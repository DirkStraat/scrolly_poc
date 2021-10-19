import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import styles from "./DesiBarChart.module.scss";

const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const widthDesktop = 640 - margin.left - margin.right;
const heightDesktop = 400 - margin.top - margin.bottom;
const widthMobile = 360 - margin.left - margin.right;
const heightMobile = 250 - margin.top - margin.bottom;
const options2 = ["Toegang", "Vaardigheden", "Internetgebruik"];
const options3 = ["Digitale integratie"];
const options4 = ["Digitale overheid"];

export interface Props {
  currentPart: string;
  isMobileSize: boolean;
  title: string;
  active: boolean;
}

function DesiBarChart(props: Props) {
  const desiBarChartRef = useRef(null);
  const [currentPart, setCurrentPart] = useState(null);
  const [visible, setVisible] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const chapterTitle = props.title;

  useEffect(() => {
    if (props.currentPart) {
      const currentPartIndex = parseInt(
        props.currentPart.substring(0, props.currentPart.indexOf("_"))
      );
      setCurrentPart(currentPartIndex);
    }
  }, [props.currentPart]);

  useEffect(() => {
    currentPart > 0 && currentPart < 4 ? setVisible(true) : setVisible(false);
  }, [currentPart]);

  const adjustAfterTransition = useCallback(
    (svg) => {
      svg
        .selectAll("rect")
        .transition()
        .duration(400)
        .style("opacity", (d) => {
          switch (props.currentPart) {
            case `1_${chapterTitle}`:
              return options2.indexOf(d.key) > -1 ? 1 : 0.2;
            case `3_${chapterTitle}`:
              return options3.indexOf(d.key) > -1 ? 1 : 0.2;
            case `2_${chapterTitle}`:
              return options4.indexOf(d.key) > -1 ? 1 : 0.2;
          }
        });

      svg
        .selectAll(".bar-label")
        .transition()
        .duration(400)
        .style("opacity", (d) => {
          switch (props.currentPart) {
            case `1_${chapterTitle}`:
              return options2.indexOf(d.key) > -1 ? 1 : 0;
            case `3_${chapterTitle}`:
              return options3.indexOf(d.key) > -1 ? 1 : 0;
            case `2_${chapterTitle}`:
              return options4.indexOf(d.key) > -1 ? 1 : 0;
          }
        });
    },
    [chapterTitle, props.currentPart]
  );

  useEffect(() => {
    if (desiBarChartRef.current && props.active) {
      if (desiBarChartRef.current.childNodes.length > 0) {
        desiBarChartRef.current.childNodes.forEach((childnode) => {
          childnode.tagName == "H2" || childnode.tagName == "P"
            ? ""
            : desiBarChartRef.current.removeChild(childnode);
        });
      }
      const svg = d3
        .select(desiBarChartRef.current)
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
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Parse the Data
      d3.csv("/data/desiScore.csv").then(function (csvData) {
        setCurrentData(csvData);

        const x = d3
          .scaleBand()
          .range([0, `${props.isMobileSize ? widthMobile : widthDesktop}`])
          .domain(csvData.map((d) => d.key))
          .padding(0.2);

        const y = d3
          .scaleLinear()
          .range([
            `${props.isMobileSize ? heightMobile / 1.5 : heightDesktop / 1.2} `,
            0,
          ])
          .domain([-5.6, 9.3]); // hardcoded because d3.extent() malfunctioned

        svg
          .append("g")
          .attr("class", "x axis")
          .append("line")
          .attr("y1", y(0))
          .attr("y2", y(0))
          .attr("x2", `${props.isMobileSize ? widthMobile : widthDesktop}`)
          .style("stroke", "var(--content-copy)");
        svg
          .selectAll("mybar")
          .data(csvData)
          .join("rect")
          .attr("x", (d) => x(d.key))
          .attr("width", x.bandwidth())
          .attr("fill", (d) => {
            return d.value > 0 ? "#73655F" : "#F05031";
          })
          .style("opacity", 0.2)
          .attr("height", () => {
            parseInt(`${props.isMobileSize ? heightMobile : heightDesktop}`) -
              y(0);
          }) // always equal to 0
          .attr("y", () => y(0))
          .attr("data-key", (d) => {
            return d.key;
          })
          .attr("data-value", (d) => {
            return d.value;
          });

        svg
          .selectAll("rect")
          .transition()
          .duration(200)
          .attr("y", (d) => {
            if (d.value > 0) {
              return y(d.value);
            } else {
              return y(0);
            }
          })
          .attr("height", (d) => {
            return Math.abs(y(d.value) - y(0));
          });

        svg
          .selectAll(".bar-label")
          .data(csvData)
          .enter()
          .append("text")
          .text((d) => d.value)
          .attr("text-anchor", "middle")
          .classed("bar-label", true)
          .attr("x", (d) => x(d.key) + x.bandwidth() / 2)
          .attr("dx", 0)
          .attr("y", (d) => y(d.value))
          .attr("dy", (d) => {
            return d.value > 0 ? -6 : 20;
          })
          .style("font-family", "ProximaNovaRegular")
          .style("fill", "var(--content-copy)")
          .style("opacity", 0);

        svg
          .selectAll(".bar-label text")
          .data(csvData)
          .enter()
          .append("text")
          .text((d) => d.key)
          .attr("text-anchor", "middle")
          .classed("bar-label", true)
          .attr("x", (d) => x(d.key) + x.bandwidth() / 2)
          .attr("dx", (d) => (d.key == "Digitale overheid" ? -12 : 0))
          .attr("y", (d, i) => {
            return parseFloat(d.value) > 0 ? y(0) + 16 * (i + 1) : y(0) - 8;
          })
          .style("font-family", "ProximaNovaRegular")
          .style("fill", "var(--content-copy)")
          .style("opacity", 0);
      });
    }
  }, [props.isMobileSize, props.active]);

  useEffect(() => {
    if (desiBarChartRef.current && currentData && currentPart) {
      const svg = d3.select(desiBarChartRef.current).select("svg").select("g");

      setTimeout(() => {
        adjustAfterTransition(svg);
      }, 200);
    }
  }, [currentPart, adjustAfterTransition, currentData]);

  return (
    <div
      ref={desiBarChartRef}
      className={`${styles.desiBarChart} ${props.active ? styles.active : ""}`}
    >
      <h2 className={styles.title}>
        Duitse overheid en bedrijfsleven lopen digitaal achter
      </h2>
      <p className={styles.title}>
        Digitaliseringsindex EU, score van Duitsland t.o.v. EU-gemiddelde
      </p>
    </div>
  );
}

export { DesiBarChart };
