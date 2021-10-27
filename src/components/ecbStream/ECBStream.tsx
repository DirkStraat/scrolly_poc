import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import styles from "./ECBStream.module.scss";

const margin = { top: 10, right: 30, bottom: 30, left: 60 };
const widthDesktop = 640 - margin.left - margin.right;
const heightDesktop = 600 - margin.top - margin.bottom;
const widthMobile = 360 - margin.left - margin.right;
const heightMobile = 250 - margin.top - margin.bottom;
const dates = ["1/1/2009", "1/2/2012", "30/10/2014", "15/3/2020", "19/10/2021"];

export interface Props {
  currentPart: string;
  isMobileSize: boolean;
  title: string;
  active: boolean;
}

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
      .range([
        "var(--writer)",
        "var(--captions)",
        "#4C4642",
        "var(--input-caret",
      ]);

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

    props.currentPart
      ? updateAreas(parseInt(props.currentPart.slice(0)) - 1)
      : "";
  }, [keys, ECBRef, stackedData, props.currentPart]);

  const updateAreas = useCallback(
    (dateIndex) => {
      const u = d3
        .select(ECBRef.current)
        .select("svg")
        .select("g")
        .selectAll(".area")
        .data(stackedData);

      u.join("path")
        .transition()
        .duration(1000)
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
    },
    [ECBRef, stackedData, dates]
  );

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

      if (ECBData3 && keys && stackedData) {
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
            `translate(${props.isMobileSize ? margin.left + 40 : margin.left},${
              margin.top
            })`
          );

        // Add X axis
        x.range([0, props.isMobileSize ? widthMobile : widthDesktop]);
        svg
          .append("g")
          .attr(
            "transform",
            `translate(0, ${props.isMobileSize ? heightMobile : heightDesktop})`
          )
          .call(
            d3
              .axisBottom(x)
              .ticks(5)
              .tickFormat((d: number) => d / 1000000)
          );

        // Add Y axis
        y.range([props.isMobileSize ? heightMobile : heightDesktop, 0]);
        svg.append("g").call(d3.axisLeft(y).tickFormat(d3.timeFormat("%Y")));

        svg
          .selectAll(".tick")
          .selectAll("text")
          .attr("class", "body-text sans s")
          .attr("color", "var(--content-copy)");
        showAreas();
      }
    }
  }, [props.isMobileSize, props.active, keys, stackedData, ECBData3]);

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
