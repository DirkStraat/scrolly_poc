import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import styles from "./Stacked.module.scss";

const margin = { top: 10, right: 30, bottom: 30, left: 60 };
const widthDesktop = 640 - margin.left - margin.right;
const heightDesktop = 400 - margin.top - margin.bottom;
const widthMobile = 360 - margin.left - margin.right;
const heightMobile = 260 - margin.top - margin.bottom;

export interface Props {
  currentPart: string;
  isMobileSize: boolean;
  title: string;
  active: boolean;
}

function Stacked(props: Props) {
  const stackedRef = useRef(null);
  const [currentPart, setCurrentPart] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (props.currentPart) {
      const currentPartIndex = parseInt(
        props.currentPart.substring(0, props.currentPart.indexOf("_"))
      );
      setCurrentPart(currentPartIndex);
    }
  }, [props.currentPart]);

  useEffect(() => {
    currentPart == 4 ? setVisible(true) : setVisible(false);
  }, [currentPart]);

  useEffect(() => {
    let svg: any;

    if (stackedRef.current && props.active) {
      if (stackedRef.current.childNodes.length > 0) {
        stackedRef.current.childNodes.forEach((childnode) => {
          childnode.tagName == "H2" || childnode.tagName == "P"
            ? ""
            : stackedRef.current.removeChild(childnode);
        });
      }

      svg = d3
        .select(stackedRef.current)
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
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      //   Read the data
      d3.csv("/data/duitsland_china.csv").then(function (data) {
        const series = d3.stack().keys(data.columns.slice(1))(data);

        const x = d3
          .scaleLinear()
          .domain(
            d3.extent(data, function (d) {
              return d.Jaar;
            })
          )
          .range([0, `${props.isMobileSize ? widthMobile : widthDesktop}`]);

        svg
          .append("g")
          .attr(
            "transform",
            `translate(0, ${props.isMobileSize ? heightMobile : heightDesktop})`
          )
          .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")));

        // Add Y axis
        const y = d3
          .scaleLinear()
          .domain([
            0,
            d3.max(data, function (d) {
              return +d.Restvandewereld;
            }) * 1.2,
          ])
          .range([`${props.isMobileSize ? heightMobile : heightDesktop}`, 0]);
        svg.append("g").call(d3.axisLeft(y).tickFormat(d3.format("d")));

        const yAxisGrid = d3
          .axisLeft(y)
          .tickSize(-(props.isMobileSize ? widthMobile : widthDesktop))
          .tickFormat("")
          .ticks(5);

        svg.append("g").attr("class", "y axis-grid").call(yAxisGrid);

        svg.selectAll(".domain").attr("stroke", "none");
        svg
          .selectAll(".tick")
          .selectAll("text")
          .style("font-family", "ProximaNovaRegular")
          .style("font-size", "16px");

        svg.selectAll(".tick").selectAll("line").style("stroke", "none");

        svg
          .selectAll(".y")
          .selectAll(".tick")
          .selectAll("line")
          .style("stroke", "#A6988F");

        // Show the areas
        svg
          .selectAll("mylayers")
          .data(series)
          .join("path")
          .style("fill", (d) => {
            return d.key == "Restvandewereld" ? "#A6988F" : "#F05031";
          })
          .attr(
            "d",
            d3
              .area()
              .x((d) => x(Math.round(d.data.Jaar)))
              .y0((d) => y(Math.round(d[0])))
              .y1((d) => y(Math.round(d[1])))
          );

        svg
          .append("text")
          .attr("text-anchor", "start")
          .classed("label", true)
          .classed("orange", true)
          .attr("x", 4)
          .attr("y", (props.isMobileSize ? heightMobile : heightDesktop) / 1.9)
          .text("2%");

        svg
          .append("text")
          .classed("label", true)
          .classed("orange", true)
          .attr("text-anchor", "end")
          .attr("x", (props.isMobileSize ? widthMobile : widthDesktop) - 4)
          .attr("y", (props.isMobileSize ? heightMobile : heightDesktop) / 11)
          .text("11%");

        svg
          .append("text")
          .attr("text-anchor", "middle")
          .classed("label", true)
          .classed("orange", true)
          .attr("x", (props.isMobileSize ? widthMobile : widthDesktop) / 2)
          .attr("y", (props.isMobileSize ? heightMobile : heightDesktop) / 4.2)
          .text("China");

        svg
          .append("text")
          .attr("text-anchor", "middle")
          .classed("label", true)
          .attr("x", (props.isMobileSize ? widthMobile : widthDesktop) / 2)
          .attr("y", (props.isMobileSize ? heightMobile : heightDesktop) / 1.4)
          .text("Rest van de wereld");

        svg
          .selectAll(".label")
          .style("font-family", "ProximaNovaRegular")
          .style("font-weight", "bolder");
        svg.selectAll(".orange").style("fill", "#F05031");
      });
    }
  }, [props.isMobileSize, props.active]);

  return (
    <div
      ref={stackedRef}
      className={`${styles.stacked} ${props.active ? styles.active : ""}`}
    >
      <h2 className={styles.title}>Export naar China neemt toe</h2>
      <p className={styles.title}>Export uit Duitsland, in € mrd.</p>
    </div>
  );
}

export { Stacked };
