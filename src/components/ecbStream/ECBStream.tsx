import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import styles from "./ECBStream.module.scss";

export interface Props {
  currentPart: string;
  isMobileSize: boolean;
  title: string;
  active: boolean;
}

const margin = { top: 10, right: 30, bottom: 30, left: 60 };
const widthDesktop = 640 - margin.left - margin.right;
const heightDesktop = 600 - margin.top - margin.bottom;
const widthMobile = 360 - margin.left - margin.right;
const heightMobile = 500 - margin.top - margin.bottom;
const dates = ["1/9/2008", "1/2/2012", "1/11/2014", "1/3/2020", "1/10/2021"];
const parseYear = d3.timeParse("%Y");
const parseWeek = d3.timeParse("%d/%m/%Y");
const x = d3.scaleLinear().domain([0, 8000000]);
const y = d3.scaleTime().domain([parseYear(2022), parseYear(1999)]);

function ECBStream(props: Props) {
  const ECBRef = useRef(null);
  const [ECBData3, setECBData3] = useState(null);
  const [keys, setKeys] = useState(null);
  const [stackedData, setStackedData] = useState(null);

  useEffect(() => {
    d3.csv("/data/balans_ecb_2.csv").then((data) => {
      setECBData3(data);
      setKeys(data.columns.slice(1));
      setStackedData(
        d3.stack().offset(d3.stackOffsetNone).keys(data.columns.slice(1))(data)
      );
    });
  }, []);

  const showAreas = useCallback(() => {
    const color = d3
      .scaleOrdinal()
      .domain(keys)
      .range(["#A6988F", "#CDBEB4", "#4C4642", "#41AFB0"]);

    d3.select(ECBRef.current)
      .select("svg")
      .select("g")
      .selectAll("mylayers")
      .data(stackedData)
      .join("path")
      .attr("class", "area")
      .style("fill", (d) => {
        return color(d.key);
      })
      .style("opacity", "0");

    addLegenda();
    props.currentPart
      ? updateAreas(parseInt(props.currentPart.slice(0)) - 1)
      : "";
  }, [keys, ECBRef, stackedData, props.currentPart]);

  const updateAreas = useCallback(
    (dateIndex) => {
      if (keys) {
        const u = d3
          .select(ECBRef.current)
          .select("svg")
          .select("g")
          .selectAll(".area")
          .data(stackedData);

        u.join("path")
          .transition()
          .ease(d3.easeLinear)
          .duration(300)
          .attr(
            "d",
            d3
              .area()
              .y((d) => {
                return parseWeek(dates[dateIndex]) > parseWeek(d.data.Week)
                  ? y(parseWeek(d.data.Week))
                  : y(parseWeek(dates[dateIndex]));
              })
              .x0((d) => {
                return x(d[0]);
              })
              .x1((d) => {
                return x(d[1]);
              })
              .curve(d3.curveBasis)
          )
          .style("opacity", "1");

        d3.selectAll("text.legenda_amount")
          .data(keys)
          .text((d) => {
            return `${(
              ECBData3.filter((element) => element.Week == dates[dateIndex])[0][
                d
              ] / 1000
            ).toFixed()} ${props.isMobileSize ? "" : "miljard"}`;
          });
      }
    },
    [ECBRef, stackedData, dates, keys, ECBData3, props.isMobileSize]
  );

  const addLegenda = useCallback(() => {
    if (keys) {
      const size = 20;
      const labelSvg = d3.select(ECBRef.current).select("svg");
      labelSvg
        .append("defs")
        .append("linearGradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%")
        .attr("id", "myGradient")
        .append("stop")
        .attr("offset", "70%")
        .attr("stop-color", "var(--product-background-2)")
        .attr("stop-opacity", 1);

      labelSvg
        .select("#myGradient")
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "var(--product-background-2)")
        .attr("stop-opacity", 0);

      labelSvg
        .append("rect")
        .attr(
          "x",
          props.isMobileSize
            ? widthMobile + margin.left + margin.right - widthMobile * 0.8
            : widthDesktop + margin.left + margin.right - widthDesktop * 0.8
        )
        .attr("y", 0)
        .attr(
          "width",
          props.isMobileSize ? widthMobile * 0.8 : widthDesktop * 0.8
        )
        .attr("height", 150)
        .style("fill", "url(#myGradient)");

      labelSvg
        .selectAll("mydots")
        .data(keys)
        .join("rect")
        .attr(
          "x",
          props.isMobileSize
            ? widthMobile + margin.right + margin.left - size
            : widthDesktop + margin.right + margin.left - size
        )
        .attr("y", (_, i) => {
          return margin.top + i * (size + 4);
        })
        .attr("width", size)
        .attr("height", size)
        .attr("class", "legenda")
        .style("fill", (d) => {
          switch (d) {
            case "Goud":
              return "#A6988F";
            case "Overig":
              return "#CDBEB4";
            case "Bankkredieten":
              return "#4C4642";
            case "Opkoopprogramma's":
              return "#41AFB0";
          }
        })
        .style("opacity", 1);

      labelSvg
        .selectAll("mylabels")
        .data(keys)
        .join("text")
        .attr(
          "x",
          props.isMobileSize
            ? widthMobile - (size + 2) + margin.right + margin.left
            : widthDesktop - (size + 2) + margin.right + margin.left
        )
        .attr("y", (_, i) => {
          return margin.top + (i + 1) * (size + 3) - 4;
        })
        .text("")
        .attr("text-anchor", "end")
        .attr("class", "legenda_amount")
        .style("font-family", "ProximaNovaRegular")
        .style("font-size", () => {
          return props.isMobileSize ? "14px" : "18px";
        })
        .style("fill", "var(--content-copy)");

      labelSvg
        .selectAll("mylabels")
        .data(keys)
        .join("text")
        .attr(
          "x",
          props.isMobileSize
            ? widthMobile - (size + 2) - 48 + margin.right + margin.left
            : widthDesktop - (size + 2) - 104 + margin.right + margin.left
        )
        .attr("y", (_, i) => {
          return margin.top + (i + 1) * (size + 3) - 4;
        })
        .text((d) => `${d}:`)
        .attr("text-anchor", "end")
        .attr("class", "legenda_item")
        .style("font-family", "ProximaNovaRegular")
        .style("font-size", () => {
          return props.isMobileSize ? "14px" : "18px";
        })
        .style("fill", "var(--content-copy)");
    }
  }, [keys, props.isMobileSize]);

  useEffect(() => {
    if (ECBRef.current && props.active) {
      if (ECBRef.current.childNodes.length > 0) {
        ECBRef.current.childNodes.forEach((childnode) => {
          childnode.tagName == "H2" ||
          childnode.tagName == "P" ||
          childnode.tagName == "BUTTON"
            ? ""
            : ECBRef.current.removeChild(childnode);
        });
      }

      if (keys && stackedData) {
        const svg = d3
          .select(ECBRef.current)
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
            `translate(${props.isMobileSize ? margin.left : margin.left},${
              margin.top
            })`
          );

        // Add X axis
        x.range([0, props.isMobileSize ? widthMobile : widthDesktop]);
        svg
          .append("g")
          .attr("class", "x axis-grid")
          .attr(
            "transform",
            `translate(0, ${props.isMobileSize ? heightMobile : heightDesktop})`
          )
          .call(
            d3
              .axisBottom(x)
              .ticks(5)
              .tickSize(-`${props.isMobileSize ? heightMobile : heightDesktop}`)
              .tickFormat((d: number) => d / 1000)
            // .attr("stroke", "var(--product-background-2)")
          );

        // Add Y axis
        y.range([props.isMobileSize ? heightMobile : heightDesktop, 0]);
        svg
          .append("g")
          // .attr("class", "y")
          .call(d3.axisLeft(y).tickFormat(d3.timeFormat("%Y")));

        svg
          .selectAll(".tick")
          .selectAll("text")
          .attr("class", "body-text sans s")
          .attr("color", "var(--content-copy)");

        svg.select(".x.axis-grid").select("path.domain").attr("stroke", "none");
        svg
          .select(".x.axis-grid")
          .selectAll(".tick")
          .selectAll("line")
          .attr("stroke", "#4C4642");

        svg
          .select(".y")
          .selectAll(".tick")
          .selectAll("line")
          .attr("stroke", "none");
        showAreas();
      }
    }
  }, [props.isMobileSize, props.active, keys, stackedData]);

  useEffect(() => {
    const cpIndex = props.currentPart
      ? parseInt(props.currentPart.slice(0))
      : 0;
    cpIndex > 0 && cpIndex < 6 ? updateAreas(cpIndex - 1) : "";
  }, [props.currentPart]);

  return (
    <div
      ref={ECBRef}
      className={`${styles.ECBStreamContainer} ${
        props.active ? styles.active : ""
      }`}
    >
      <h2 className={styles.title}>Ontploffing op de balans</h2>
      <p className={styles.title}>
        Vanaf 2015 koopt de ECB staatsobligaties en laat daarmee de balans
        ontploffen.
      </p>
    </div>
  );
}

export { ECBStream };
