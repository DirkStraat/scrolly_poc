import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import styles from "./ESCPRanking.module.scss";

const margin = { top: 10, right: 30, bottom: 30, left: 120 };
const widthDesktop = 640 - margin.left - margin.right;
const heightDesktop = 400 - margin.top - margin.bottom;
const widthMobile = 360 - margin.left - margin.right;
const heightMobile = 250 - margin.top - margin.bottom;
const countriesAmountMobile = 6;

export interface Props {
  currentPart: string;
  isMobileSize: boolean;
  title: string;
  active: boolean;
  dimensions: { width: number; height: number };
}

function ESCPRanking(props: Props) {
  const ESCPRef = useRef(null);

  useEffect(() => {
    console.log(props.dimensions.width);
  }, [props.dimensions]);

  useEffect(() => {
    if (ESCPRef.current && props.active) {
      if (ESCPRef.current.childNodes.length > 0) {
        ESCPRef.current.childNodes.forEach((childnode) => {
          childnode.tagName == "H2" || childnode.tagName == "P"
            ? ""
            : ESCPRef.current.removeChild(childnode);
        });
      }
      const svg = d3
        .select(ESCPRef.current)
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
        .attr(
          "transform",
          `translate(${props.isMobileSize ? margin.left + 40 : margin.left},${
            margin.top
          })`
        );

      // Parse the Data
      d3.csv("/data/ESCPRanking.csv").then(function (csvData) {
        const data = props.isMobileSize
          ? csvData.slice(-countriesAmountMobile)
          : csvData;

        const x = d3
          .scaleLinear()
          .range([0, `${props.isMobileSize ? widthMobile : widthDesktop}`])
          .domain([-396, 211]);

        const y = d3
          .scaleBand()
          .range([0, `${props.isMobileSize ? heightMobile : heightDesktop} `])
          .domain(data.map((d) => d.Land))
          .padding(0.2);

        svg
          .append("g")
          .attr("class", "Y axis")
          .append("line")
          .attr("x1", x(0))
          .attr("x2", x(0))
          .attr("y2", `${props.isMobileSize ? heightMobile : heightDesktop}`)
          .style("stroke", "black");

        svg
          .selectAll("mybar")
          .data(data)
          .join("rect")
          .attr("y", (d) => y(d.Land))
          .attr("height", y.bandwidth())
          .attr("fill", (d) => {
            return d.Rangschikking > 0 ? "#73655F" : "#F05031";
          })
          .style("opacity", (d) => {
            return d.Land == "Duitsland" ? 1 : 0.4;
          })
          .attr("width", () => {
            parseInt(`${props.isMobileSize ? widthMobile : widthDesktop}`) -
              x(0);
          })
          .attr("x", () => x(0))
          .attr("data-key", (d) => {
            return d.Land;
          })
          .attr("data-value", (d) => {
            return d.Rangschikking;
          });

        svg
          .selectAll("rect")
          .transition()
          .duration(500)
          .attr("x", (d) => x(Math.min(0, d.Rangschikking)))
          .attr("width", (d) => Math.abs(x(d.Rangschikking) - x(0)))
          .delay((_, i) => {
            return i * 20;
          });

        svg
          .selectAll(".bar-label")
          .data(data)
          .join("text")
          .text((d) => d.Rangschikking)
          .attr("text-anchor", (d) => (d.Rangschikking < 0 ? "end" : "start"))
          .classed("bar-label", true)
          .attr("y", (d) => y(d.Land) + y.bandwidth() - 2)
          .attr("dy", 0)
          .attr("x", (d) => x(d.Rangschikking))
          .attr("dx", (d) => (d.Rangschikking < 0 ? -4 : 4))
          .style("font-family", "ProximaNovaRegular")
          .style("opacity", 0)
          .style("fill", "var(--content-copy");

        svg
          .selectAll(".bar-label")
          .transition()
          .duration(500)
          .style("opacity", 1)
          .delay((_, i) => {
            return i * 20;
          });

        svg
          .selectAll(".bar-land")
          .data(data)
          .join("text")
          .text((d, i) => {
            return `${props.isMobileSize ? i + 14 : i + 1}. ${d.Land}`;
          })
          .attr("text-anchor", "start")
          .classed("bar-land", true)
          .attr("y", (d) => y(d.Land) + y.bandwidth() - 2)
          .attr("x", -120)
          .style("font-family", (d) => {
            return d.Land == "Duitsland"
              ? "ProximaNovaBold"
              : "ProximaNovaRegular";
          })
          .style("opacity", 1)
          .style("fill", (d) =>
            d.Land == "Duitsland" ? "#F05031" : "var(--content-copy"
          );
      });
    }
  }, [props.isMobileSize, props.active]);

  return (
    <div
      ref={ESCPRef}
      className={`${styles.ESCPRankingContainer} ${
        props.active ? styles.active : ""
      }`}
    >
      <h2 className={styles.title}>Duitsland verliest concurrentieslag</h2>
      <p className={styles.title}>
        Digitale concurrentiekracht G20-landen, optelsom van mutaties bij 10
        indicatoren 2018-2020
      </p>
    </div>
  );
}

export { ESCPRanking };
