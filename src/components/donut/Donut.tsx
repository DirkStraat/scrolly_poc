import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import styles from "./Donut.module.scss";

const margin = { top: 10, right: 10, bottom: 10, left: 10 };
const widthDesktop = 640 - margin.left - margin.right;
const heightDesktop = 320 - margin.top - margin.bottom;
const widthMobile = 360 - margin.left - margin.right;
const heightMobile = 250 - margin.top - margin.bottom;
const fontSizeBigDesktop = "20px";
const fontSizeSmallDesktop = "15px";
const fontSizeBigMobile = "16px";
const fontSizeSmallMobile = "12px";

export interface Props {
  currentPart: string;
  isMobileSize: boolean;
  title: string;
  active: boolean;
}

function Donut(props: Props) {
  const donutRef = useRef(null);
  const [currentPart, setCurrentPart] = useState(null);
  const [dataNL, setDataNL] = useState(null);
  const [dataPL, setDataPL] = useState(null);
  const [dataIt, setDataIt] = useState(null);
  const [currentData, setData] = useState(null);
  const [currentCountry, setCurrenCountry] = useState(null);
  const [dataImported, setDataImported] = useState(false);
  const [isMobileSize, setIsMobileSize] = useState(true);
  const [visible, setVisible] = useState(null);

  useEffect(() => {
    d3.csv("/data/import_productgroep_land.csv").then((data) => {
      data.map((country) => {
        switch (country.Land) {
          case "Nederland":
            delete country.Land;
            setDataNL(country);
            break;
          case "Polen":
            delete country.Land;
            setDataPL(country);
            break;
          case "Italie":
            delete country.Land;
            setDataIt(country);
            break;
        }
      });
      setDataImported(true);
    });
  }, []);

  useEffect(() => {
    props.isMobileSize ? setIsMobileSize(true) : setIsMobileSize(false);
  }, [props.isMobileSize]);

  useEffect(() => {
    if (props.currentPart) {
      const currentPartIndex = parseInt(
        props.currentPart.substring(0, props.currentPart.indexOf("_"))
      );
      setCurrentPart(currentPartIndex);
    }
  }, [props.currentPart]);

  useEffect(() => {
    if (currentPart > 2 && currentPart < 5) {
      isMobileSize ? setVisible(true) : setTimeout(() => setVisible(true), 600);
    } else if (currentPart == 5) {
      setVisible(true);
    } else {
      setVisible(false);
    }

    if (currentPart > 2 && currentPart < 6) {
      switch (currentPart) {
        case 4:
          setCurrenCountry("Polen");
          setData(dataPL);
          break;
        case 5:
          setCurrenCountry("Italië");
          setData(dataIt);
          break;
        case 3:
          setCurrenCountry("Nederland");
          setData(dataNL);
          break;
      }
    }
  }, [currentPart, dataImported, dataIt, dataNL, dataPL, isMobileSize]);

  useEffect(() => {
    const radius =
      Math.min(
        props.isMobileSize ? widthMobile : widthDesktop,
        props.isMobileSize ? heightMobile : heightDesktop
      ) /
        2 -
      margin.top;

    if (donutRef.current && currentData) {
      if (donutRef.current.childNodes.length > 0) {
        donutRef.current.childNodes.forEach((childnode) => {
          childnode.tagName == "H2" || childnode.tagName == "P"
            ? ""
            : donutRef.current.removeChild(childnode);
        });
      }

      const svg = d3
        .select(donutRef.current)
        .append("svg")
        .attr("width", props.isMobileSize ? widthMobile : widthDesktop)
        .attr("height", props.isMobileSize ? heightMobile : heightDesktop);
      const arc = d3
        .arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius * 0.8);

      const outerArc = d3
        .arc()
        .innerRadius(radius * 1.1)
        .outerRadius(radius * 1.1);

      const pie = d3
        .pie()
        .sort(null)
        .value((d) => d[1]);

      const data_ready = pie(Object.entries(currentData));

      svg
        .append("g")
        .attr(
          "transform",
          `translate(${
            props.isMobileSize ? widthMobile / 2 : widthDesktop / 2
          },${props.isMobileSize ? heightMobile / 2 : heightDesktop / 2})`
        )
        .attr("class", "donutG")
        .selectAll("whatever")
        .data(data_ready)
        .join("path")
        .attr("d", arc)
        .attr("fill", (d, i) => {
          if (d.data[0] == "Overig") {
            return "#F1DED2";
          }
          switch (i % 3) {
            case 0:
              return "#a3180F";
            case 1:
              return "#F05031";
            case 2:
              return "#A6988F";
          }
        })
        .append("title")
        .text((d) => {
          return `${d.data[1]}`;
        })
        .transition()
        .duration(2000);

      svg
        .selectAll("g")
        .selectAll("percentages")
        .data(data_ready)
        .join("text")
        .text((d) => {
          if (d.data[1] != 0) {
            const amount = parseFloat(d.data[1]);
            const roundedAmount = Math.round(amount);
            return roundedAmount;
          }
        })
        .attr("transform", (d) => {
          const arcCentroid = arc.centroid(d);
          const centeredPos = arcCentroid.map((position, i) =>
            i == 0 ? position - 0 : position + 4
          );
          return `translate(${centeredPos})`;
        })
        .attr("text-anchor", "middle")
        .style("font-family", "ProximaNovaRegular")
        .style("fill", (d) => (d.data[0] != "Overig" ? "#FFEADB" : ""))
        .style(
          "font-size",
          `${isMobileSize ? fontSizeBigMobile : fontSizeBigDesktop}`
        );

      svg
        .selectAll("g")
        .selectAll("productgroep")
        .data(data_ready)
        .join("text")
        .text((d) => {
          if (d.data[1] != 0) {
            return d.data[0];
          }
        })
        .attr("transform", (d) => {
          const arcCentroid = outerArc.centroid(d);
          const centeredPos = arcCentroid.map((position, i) =>
            i == 0 ? position + 4 : position - 4
          );
          return `translate(${centeredPos})`;
        })
        .attr("text-anchor", "middle")
        .style("font-family", "ProximaNovaRegular")
        .style("fill", "var(--content-copy)")
        .style(
          "font-size",
          `${isMobileSize ? fontSizeSmallMobile : fontSizeSmallDesktop}`
        );

      svg
        .selectAll("g")
        .selectAll("centerLabel")
        .data([1])
        .join("text")
        .text("Import uit Duitsland")
        .attr("text-anchor", "middle")
        .style("font-family", "ProximaNovaRegular")
        .style("fill", "var(--content-copy)")
        .style(
          "font-size",
          `${isMobileSize ? fontSizeSmallMobile : fontSizeSmallDesktop}`
        );
    }
  }, [currentData, isMobileSize, props.isMobileSize]);

  return (
    <div
      ref={donutRef}
      className={`${styles.donut} ${props.active ? styles.active : ""}`}
    >
      <p className={styles.title}>Aandeel productgroep in % </p>
    </div>
  );
}

export { Donut };
