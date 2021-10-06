import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import styles from "./BarChart.module.scss";

const top10GDPOptions = {
  title: "Duitsland is economische grootmacht",
  subtitle: "Top 10 landen met grootste BBP, in biljoenen $, in 2020",
  domainWidth: 25,
  marginLeft: 120,
  highLight: "Duitsland",
};

const topBranchenOptions = {
  title: "Autoindustrie draagt Duitse economie",
  subtitle: "Vijf grootste Duitse branches in 2019, in € mrd omzet",
  domainWidth: 500,
  marginLeft: 150,
  highLight: "Auto-industrie",
};

const margin = { top: 10, right: 30, bottom: 30, left: 140 };
const widthDesktop = 360 - margin.left - margin.right;
const heightDesktop = 360 - margin.top - margin.bottom;
const widthMobile = 360 - margin.left - margin.right;
const heightMobile = 250 - margin.top - margin.bottom;

export interface Props {
  currentPart: string;
  isMobileSize: boolean;
  title: string;
  active: boolean;
}

function BarChartHorizontal(props: Props) {
  const barChartRef = useRef(null);
  const [currentPart, setCurrentPart] = useState(null);
  const [top10GDPData, setTop10GDPData] = useState(null);
  const [topBranchesData, setTopBranchesData] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [options, setOptions] = useState(top10GDPOptions);

  useEffect(() => {
    if (props.currentPart) {
      const currentPartIndex = parseInt(
        props.currentPart.substring(0, props.currentPart.indexOf("_"))
      );
      setCurrentPart(currentPartIndex);
    }
  }, [props.currentPart]);

  useEffect(() => {
    if (currentPart == 0 && top10GDPData) {
      setCurrentData(top10GDPData);
      setOptions(top10GDPOptions);
    }
    if (currentPart == 1 && topBranchesData) {
      setCurrentData(topBranchesData);
      setOptions(topBranchenOptions);
    }
  }, [currentPart, top10GDPData, topBranchesData]);

  useEffect(() => {
    if (barChartRef.current) {
      if (barChartRef.current.childNodes.length > 0) {
        barChartRef.current.childNodes.forEach((childnode) => {
          childnode.tagName == "H2" || childnode.tagName == "P"
            ? ""
            : barChartRef.current.removeChild(childnode);
        });
      }
      d3.select(barChartRef.current)
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

      d3.csv("/data/top10GDP.csv").then((data) => {
        setTop10GDPData(data);
      });

      d3.csv("/data/topBranches.csv").then((data) => {
        setTopBranchesData(data);
      });
    }
  }, [props.isMobileSize]);

  useEffect(() => {
    const svg = d3.select(barChartRef.current).select("svg");

    if (currentData) {
      const data = currentData;
      svg.selectAll("rect").remove();
      svg.selectAll(".x").remove();
      svg.selectAll(".y").remove();
      // Parse the Data

      const x = d3
        .scaleLinear()
        .domain([0, options.domainWidth])
        .range([0, `${props.isMobileSize ? widthMobile : widthDesktop}`]);

      const xAxisGrid = d3
        .axisBottom(x)
        .ticks(4)
        .tickSize(-`${props.isMobileSize ? heightMobile : heightDesktop}`)
        .tickFormat(d3.format("d"));

      svg
        .select("g")
        .append("g")
        .attr("class", "x axis-grid")
        .attr(
          "transform",
          `translate(0,${props.isMobileSize ? heightMobile : heightDesktop})`
        )
        .call(xAxisGrid);

      // Y axis
      const y = d3
        .scaleBand()
        .range([0, `${props.isMobileSize ? heightMobile : heightDesktop}`])
        .domain(data.map((d) => d.Y_axis))
        .padding(0.25);
      svg.select("g").append("g").call(d3.axisLeft(y)).attr("class", "y");

      svg.selectAll(".domain").attr("stroke", "none");

      svg
        .selectAll(".tick")
        .selectAll("text")
        .attr("class", "body-text sans s")
        .attr("color", "var(--content-copy)");

      svg.selectAll(".tick").selectAll("line").style("stroke", "none");

      svg
        .selectAll(".x")
        .selectAll(".tick")
        .selectAll("line")
        .style("stroke", "#A6988F");

      svg
        .select("g")
        .selectAll("myRect")
        .data(data)
        .join("rect")
        .attr("width", () => x(0))
        .attr("y", (d) => y(d.Y_axis))
        .attr("height", y.bandwidth())
        .attr("fill", (d) => {
          return d.Y_axis == options.highLight ? "#F05031" : "#73655F";
        });

      svg
        .selectAll("rect")
        .transition()
        .duration(800)
        .attr("x", () => x(0))
        .attr("width", (d) => x(d.Value))
        .delay((_, i) => i * 100);
    }
  }, [currentData, options.domainWidth, options.highLight, props.isMobileSize]);

  return (
    <div
      ref={barChartRef}
      className={`${styles.barChart} ${props.active ? styles.active : ""}`}
    >
      <h2 className={`${styles.title} body-text sans m bold`}>
        {options.title}
      </h2>
      <p className={`${styles.title} body-text sans xs`}>{options.subtitle}</p>
    </div>
  );
}

export { BarChartHorizontal as BarChart };
