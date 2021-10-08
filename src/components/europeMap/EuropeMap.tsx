import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import styles from "./EuropeMap.module.scss";

const optionsPoland = {
  center: [-160, -40],
  scale: [2],
  germany1st: ["Poland"],
  germany2nd: [],
  germanyLower: [],
};

const optionsHolland = {
  center: [-120, -40],
  scale: [2],
  germany1st: ["Netherlands"],
  germany2nd: [],
  germanyLower: [],
};

const optionsItaly = {
  center: [-120, -90],
  scale: [1.9],
  germany1st: ["Italy"],
  germany2nd: [],
  germanyLower: [],
};

const optionsEurope = {
  scale: [1],
  center: [0, 0],
  germany1st: [
    "Austria",
    "Belgium",
    "Bulgaria",
    "Croatia",
    "CzechRepublic",
    "Denmark",
    "Finland",
    "France",
    "Hungary",
    "Italy",
    "Luxembourg",
    "Malta",
    "Netherlands",
    "Poland",
    "Romania",
    "Slovakia",
    "Slovenia",
    "Liechtenstein",
    "WalloonRegion",
    "FlemishRegion",
  ],
  germany2nd: ["Greece", "Spain", "Sweden", "Switzerland"],
  germanyLower: ["Estonia", "Ireland", "Latvia", "Lithuania", "Portugal"],
};

const legenda = ["Grootste", "Op één na grootste"];

export interface Props {
  currentPart: string;
  isMobileSize: boolean;
  title: string;
}

function EuropeMap({ isMobileSize, currentPart, title }) {
  const mapRef = useRef(null);
  const [currentOptions, setCurrentOptions] = useState(null);
  const [initial, setInitial] = useState(true);
  const [mapLabel, setMapLabel] = useState(null);
  const [mapSubLabel, setMapSubLabel] = useState(null);
  const [currentPartIndex, setCurrentPartIndex] = useState(null);
  const width = isMobileSize ? 360 : 640;
  const height = isMobileSize ? 300 : 533;
  const projection = d3
    .geoMercator()
    .center([36.12, 16.22])
    .scale([200])
    .translate([220, 220]);

  const path = d3.geoPath().projection(projection);

  const zoomSettings = {
    duration: 1000,
    ease: d3.easeCubicOut,
    zoomLevel: 5,
  };

  const switchOptions = useCallback(
    (currentPart) => {
      switch (currentPart) {
        case `2_${title}`:
          setCurrentOptions(optionsEurope);
          setMapLabel("Handelshart van Europa");
          setMapSubLabel(
            "Landen die het grootste deel van hun import uit Duitsland halen"
          );
          break;
        case `3_${title}`:
          setCurrentOptions(optionsHolland);
          setMapLabel("Duitse degelijkheid in Nederland");
          break;
        case `4_${title}`:
          setCurrentOptions(optionsPoland);
          setMapLabel("Duitse degelijkheid in Polen");
          break;
        case `5_${title}`:
          setCurrentOptions(optionsItaly);
          setMapLabel("Duitse degelijkheid in Italië");
          break;
      }
    },
    [isMobileSize, title]
  );

  useEffect(() => {
    switchOptions(currentPart);
    if (currentPart) {
      const currentPartIndexTemp = parseInt(
        currentPart.substring(0, currentPart.indexOf("_"))
      );
      setCurrentPartIndex(currentPartIndexTemp);
    }
  }, [currentPart, switchOptions]);

  useEffect(() => {
    switchOptions(currentPart);
  }, [switchOptions, currentPart]);

  useEffect(() => {
    let svg: any;

    if (mapRef.current && currentOptions && initial) {
      if (mapRef.current.childNodes.length > 0) {
        mapRef.current.childNodes.forEach((childnode) => {
          childnode.tagName == "H2" || childnode.tagName == "P"
            ? ""
            : mapRef.current.removeChild(childnode);
        });
      }

      svg = d3
        .select(mapRef.current)
        .append("svg")
        .attr("viewBox", "35 0 180 180")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "EuropeSVG");

      const g = svg.append("g").attr("id", "europeG");

      d3.json("/data/europe.json").then((topology: any) => {
        g.selectAll("path")
          .data(
            (
              topojson.feature(
                topology,
                topology.objects.continent_Europe_subunits
              ) as any
            ).features
          )
          .enter()
          .insert("path", ":first-child")
          .attr("fill", (d: any) => {
            if (d.properties.geounit == "Germany") {
              return "#A6988F";
            } else if (
              currentOptions.germany1st.find(
                (element) => element == d.properties.geounit
              )
            ) {
              return "#A3180F";
            } else if (
              currentOptions.germany2nd.find(
                (element) => element == d.properties.geounit
              )
            ) {
              return "#F05031";
            } else return "#F1DED2";
          })
          .attr("class", "country")
          .attr("id", (d: any) => {
            return d.properties.geounit;
          })
          .attr("d", path as any);
      });

      if (!d3.select(".legenda").node()) {
        const size = 20;
        const labelSvg = d3.select(mapRef.current).select("svg");
        labelSvg
          .selectAll("mydots")
          .data(legenda)
          .join("rect")
          .attr("x", size * 2)
          .attr("y", (_, i) => {
            return i * (size + 4);
          })
          .attr("width", size)
          .attr("height", size)
          .attr("class", "legenda")
          .attr("transform", "translate(12,0)scale(.4)")
          .style("fill", (d) => {
            return d == "Grootste" ? "#A3180F" : "#F05031";
          })
          .style("opacity", 0);

        labelSvg
          .selectAll("mylabels")
          .data(legenda)
          .join("text")
          .attr("x", 3 * (size + 2))
          .attr("y", (_, i) => {
            return (i + 1) * size;
          })
          .text((d) => d)
          .attr("text-anchor", "left")
          .attr("class", "legenda")
          .attr("transform", "translate(12,0)scale(.4)")
          .style("font-family", "ProximaNovaRegular")
          .style("font-size", () => {
            return isMobileSize ? "14px" : "18px";
          })
          .style("fill", "var(--content-copy)")
          .style("opacity", 0);
      }
      setInitial(false);
    }
  }, [
    mapRef,
    width,
    currentOptions,
    height,
    initial,
    path,
    currentPart,
    isMobileSize,
    title,
  ]);

  useEffect(() => {
    const svg = d3.select(mapRef.current).select("svg");

    if (currentPartIndex > 2 && currentPartIndex < 6) {
      svg
        .transition()
        .duration(zoomSettings.duration)
        .ease(zoomSettings.ease)
        .attr("height", isMobileSize ? 200 : 300)
        .style("display", "block");
    } else if (currentPartIndex < 3) {
      svg
        .transition()
        .duration(zoomSettings.duration)
        .ease(zoomSettings.ease)
        .attr("height", height)
        .style("display", "block");
    } else if (currentPartIndex >= 6) {
      svg
        .transition()
        .duration(zoomSettings.duration)
        .ease(zoomSettings.ease)
        .style("display", "none");
    }
    const legenda = svg.selectAll(".legenda");
    currentPart == `2_${title}`
      ? legenda.style("opacity", 1)
      : legenda.style("opacity", 0);
  }, [
    currentPartIndex,
    height,
    currentPart,
    title,
    zoomSettings.duration,
    zoomSettings.ease,
  ]);

  useEffect(() => {
    if (mapRef.current) {
      const g = d3.select("#europeG");

      if (currentOptions) {
        g.transition()
          .duration(zoomSettings.duration)
          .ease(zoomSettings.ease)
          .attr(
            "transform",
            `translate(${currentOptions.center[0]},${currentOptions.center[1]})scale(${currentOptions.scale})`
          );

        d3.selectAll(".country")
          .transition()
          .duration(zoomSettings.duration)
          .attr("fill", (d) => {
            if (d.properties.geounit == "Germany") {
              return "#A6988F";
            } else if (
              currentOptions.germany1st.find(
                (element) => element == d.properties.geounit
              )
            ) {
              return "#A3180F";
            } else if (
              currentOptions.germany2nd.find(
                (element) => element == d.properties.geounit
              )
            ) {
              return "#F05031";
            } else return "#F1DED2";
          });
      }
    }
  }, [mapRef, currentOptions, zoomSettings.ease, zoomSettings.duration]);

  return (
    <div ref={mapRef} className={styles.europeMapContainer}>
      <>
        <h2 className={styles.title}>{mapLabel}</h2>
        <p
          className={`${styles.title} ${
            currentPart == `2_${title}` ? styles.active : ""
          }`}
        >
          {mapSubLabel}
        </p>
      </>
    </div>
  );
}

export { EuropeMap };
