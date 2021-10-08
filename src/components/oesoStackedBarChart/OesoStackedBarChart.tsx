import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import styles from "./OesoStackedBarChart.module.scss";

const margin = { top: 60, right: 20, bottom: 20, left: 120 };
const widthDesktop = 640 - margin.left - margin.right;
const heightDesktop = 500 - margin.top - margin.bottom;
const widthMobile = 360 - margin.left - margin.right;
const heightMobile = 250 - margin.top - margin.bottom;

export interface Props {
  currentPart: string;
  isMobileSize: boolean;
  title: string;
  listLength: number;
}

const x = d3.scaleLinear().domain([0, 50]);

function OesoStackedBarChart(props: Props) {
  const oesoRef = useRef(null);
  const [currentPart, setCurrentPart] = useState(null);
  const [visible, setVisible] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [currentTopData, setCurrentTopData] = useState(null);
  const [currentFiberData, setCurrentFiberData] = useState(null);
  const title = props.title;

  x.range([0, `${props.isMobileSize ? widthMobile : widthDesktop}`]);

  // Add Y axis
  const y = d3
    .scaleBand()
    .range([0, `${props.isMobileSize ? heightMobile : heightDesktop} `])
    .padding(0.28);

  const updateData = useCallback(
    (data) => {
      const subgroups = data.columns.slice(1);

      const groups =
        props.isMobileSize && props.currentPart == `6_${title}`
          ? data
              .filter((_, i) => i == 0 || i > data.length - props.listLength)
              .map((d) => d.Land)
          : data.slice(0, props.listLength).map((d) => d.Land);

      const stackedData =
        props.isMobileSize && props.currentPart == `6_${title}`
          ? d3.stack().keys(subgroups)(
              data.filter(
                (_, i) => i == 0 || i > data.length - props.listLength
              )
            )
          : d3.stack().keys(subgroups)(data.slice(0, props.listLength));

      const svg = d3.select(oesoRef.current).select("svg").select("g");

      if (x && y) {
        y.domain(groups);

        const yAxis = d3.select(".yAxis");
        yAxis.call(d3.axisLeft(y));

        // color palette = one color per subgroup
        const color = d3
          .scaleOrdinal()
          .domain(subgroups)
          .range(["#f05031", "#f1ded2", "#cdbeb4", "#917f78"]);

        svg.selectAll(".domain").attr("stroke", "none");
        svg.selectAll(".tick").selectAll("line").style("stroke", "none");

        svg
          .selectAll(".tick")
          .selectAll("text")
          .style("font-family", (d) => {
            return d == "34. Duitsland" || d == "5. Duitsland"
              ? "ProximaNovaBold"
              : "ProximaNovaRegular";
          })
          .style("font-size", "16px")
          .style("fill", (d) => {
            return d == "34. Duitsland" || d == "5. Duitsland"
              ? "#f05031"
              : "var(--content-copy)";
          });

        svg
          .selectAll(".x")
          .selectAll(".tick")
          .selectAll("line")
          .style("stroke", "#A6988F");

        // Show the bars
        if (!svg.select(".group").node()) {
          svg.append("g").attr("class", "group");
        }

        svg
          .selectAll(".group")
          .selectAll("g")
          .data(stackedData)
          .join("g")
          .attr("fill", (d) => color(d.key))
          .attr("class", (d) => d.key)
          .selectAll("rect")
          .data((d) => d)
          .join("rect")
          .attr("y", (d) => y(d.data.Land))
          .attr("width", () => x(0))
          .attr("height", () => {
            return y.bandwidth();
          });

        svg
          .selectAll("rect")
          .transition()
          .duration(300)
          .attr("x", (d) => {
            return x(d[0]);
          })
          .attr("width", (d) => x(d[1]) - x(d[0]));

        // if not present, add legenda
        if (!d3.select(".legenda").node()) {
          const size = 20;
          const labelSvg = d3.select(oesoRef.current).select("svg");
          labelSvg
            .selectAll("mydots")
            .data(subgroups)
            .join("rect")
            .attr("x", function (_, i) {
              return (
                (props.isMobileSize ? 24 : margin.left) +
                i * (size + 5 + (props.isMobileSize ? 64 : 80))
              );
            })
            .attr("y", 20)
            .attr("width", size)
            .attr("height", size)
            .attr("class", "legenda")
            .style("fill", function (d) {
              return color(d);
            });

          labelSvg
            .selectAll("mylabels")
            .data(subgroups)
            .join("text")
            .attr("x", function (_, i) {
              return (
                i * (size + 5 + (props.isMobileSize ? 64 : 80)) +
                size +
                4 +
                (props.isMobileSize ? 24 : margin.left)
              );
            })
            .attr("y", 36)
            .text(function (d) {
              return d;
            })
            .attr("text-anchor", "left")
            .style("font-family", "ProximaNovaRegular")
            .style("alignment-baseline", "middle")
            .style("font-size", () => {
              return props.isMobileSize ? "14px" : "18px";
            })
            .style("fill", "var(--content-copy)");
        }
      }
    },
    [props.currentPart, props.isMobileSize, props.listLength, title, y]
  );

  useEffect(() => {
    if (props.currentPart) {
      const currentPartIndex = parseInt(
        props.currentPart.substring(0, props.currentPart.indexOf("_"))
      );
      setCurrentPart(currentPartIndex);
    }
  }, [props.currentPart]);

  useEffect(() => {
    currentPart > 1 && currentPart < 5 ? setVisible(true) : setVisible(false);
  }, [currentPart]);

  useEffect(() => {
    if (oesoRef.current) {
      if (oesoRef.current.childNodes.length > 0) {
        oesoRef.current.childNodes.forEach((childnode) => {
          childnode.tagName == "H2" || childnode.tagName == "P"
            ? ""
            : oesoRef.current.removeChild(childnode);
        });
      }
      const svg = d3
        .select(oesoRef.current)
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
      d3.csv("/data/oesoConnectionData.csv").then((data) => {
        const topDataTemp = data.slice(0, 20);
        topDataTemp["columns"] = data.columns;

        const fiberDataTemp = data.filter((_, i) => i == 38 || i > 56);
        fiberDataTemp["columns"] = data.columns;
        const currentDataTemp =
          props.currentPart == `6_${title}` ? fiberDataTemp : topDataTemp;

        setCurrentTopData(topDataTemp);
        setCurrentFiberData(fiberDataTemp);
        setCurrentData(currentDataTemp);

        const xAxisGrid = d3
          .axisBottom(x)
          .ticks(5)
          .tickSize(-`${props.isMobileSize ? heightMobile : heightDesktop}`)
          .tickFormat(d3.format("d"));

        svg
          .append("g")
          .attr("class", "x axis-grid")
          .attr(
            "transform",
            `translate(0,${props.isMobileSize ? heightMobile : heightDesktop})`
          )
          .call(xAxisGrid);

        svg.append("g").attr("class", "yAxis");

        updateData(currentDataTemp);
      });
    }
  }, []);

  useEffect(() => {
    if (oesoRef.current && currentPart && currentData) {
      const currentDataTemp =
        props.currentPart == `6_${title}` ? currentFiberData : currentTopData;
      const subGroups = currentDataTemp.columns.slice(1);
      currentData != currentDataTemp ? updateData(currentDataTemp) : "";
      setCurrentData(currentDataTemp);
      setTimeout(() => {
        if (props.currentPart == `4_${title}`) {
          d3.selectAll(".group")
            .selectAll("rect")
            .transition()
            .duration(50)
            .style("opacity", 1);
        } else if (props.currentPart == `5_${title}`) {
          subGroups.map((group) => {
            d3.selectAll(".group")
              .selectAll(`.${group}`)
              .selectAll("rect")
              .transition()
              .duration(200)
              .style("opacity", () => {
                return group != "DSL" ? 0.2 : 1;
              });
          });
        } else if (props.currentPart == `6_${title}`) {
          subGroups.map((group) => {
            d3.selectAll(".group")
              .selectAll(`.${group}`)
              .selectAll("rect")
              .transition()
              .duration(200)
              .style("opacity", () => {
                return group != "Glasvezel" ? 0.2 : 1;
              });
          });
        }
      }, 400);
    }
  }, [
    props.currentPart,
    currentData,
    currentFiberData,
    currentPart,
    currentTopData,
    title,
    updateData,
  ]);

  return (
    <div
      ref={oesoRef}
      className={`${styles.oesoStackedBarChart} ${
        visible ? styles.active : ""
      }`}
    >
      <h2 className={styles.title}>Weinig glasvezel in Duitsland</h2>
      <p className={styles.title}>
        Aantal abonnementen voor vast internet per 100 inwoners, naar
        technologie
      </p>
    </div>
  );
}

export { OesoStackedBarChart };
