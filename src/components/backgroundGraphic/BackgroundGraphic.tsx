import styles from "./BackgroundGraphic.module.scss";
import Image from "next/image";
import { OesoStackedBarChart } from "../oesoStackedBarChart/OesoStackedBarChart";
import { ESCPRanking } from "../eSCPRanking/ESCPRanking";
import { DesiBarChart } from "../desiBarChart/DesiBarChart";
import { SpeedScatterPlot } from "../speedScatterPlot/SpeedScatterPlot";
import { BarChart } from "../barChart/BarChartHorizontal";
import { EuropeMap } from "../europeMap/EuropeMap";
import { Donut } from "../donut/Donut";
import { Stacked } from "../stacked/Stacked";
import { useEffect, useState } from "react";

const graphics = [
  "ESCPRanking",
  "DesiBarChart",
  "OesoStackedBarChart",
  "SpeedScatterPlot",
  "Image",
  "BarChart",
  "EuropeMap",
  "Donut",
  "Stacked",
];

function BackgroundGraphic({
  currentPart,
  isMobileSize,
  title,
  id,
  dimensions,
}) {
  const [graphicActive, setGraphicActive] = useState(null);
  const [secondGraphicActive, setSecondGraphicActive] = useState(null);
  const chapter2 = id == 1408271 ? title : "";
  const chapter3 = id == 1408272 ? title : "";
  const photoChapter = id == 1408273 ? title : "";

  useEffect(() => {
    switch (currentPart) {
      case `0_${chapter2}`:
        setGraphicActive(graphics[0]);
        break;
      case `1_${chapter2}`:
      case `2_${chapter2}`:
      case `3_${chapter2}`:
        setGraphicActive(graphics[1]);
        break;
      case `4_${chapter2}`:
      case `5_${chapter2}`:
      case `6_${chapter2}`:
        setGraphicActive(graphics[2]);
        break;
      case `7_${chapter2}`:
      case `8_${chapter2}`:
      case `9_${chapter2}`:
      case `10_${chapter2}`:
        setGraphicActive(graphics[3]);
        break;
      case `11_${chapter2}`:
        setGraphicActive(graphics[4]);
        break;
      case `0_${chapter3}`:
      case `1_${chapter3}`:
        setGraphicActive(graphics[5]);
        break;
      case `2_${chapter3}`:
      case `3_${chapter3}`:
      case `4_${chapter3}`:
      case `5_${chapter3}`:
        setGraphicActive(graphics[6]);
        break;
      case `3_${chapter3}`:
      case `4_${chapter3}`:
      case `5_${chapter3}`:
        setSecondGraphicActive(graphics[7]);
        break;
      case `6_${chapter3}`:
        setGraphicActive(graphics[8]);
        break;
    }
  }, [currentPart]);

  return (
    <div
      className={`${
        id == 1408273 ? styles.photoContainer : styles.svgContainer
      }`}
    >
      {chapter2 && (
        <>
          <ESCPRanking
            currentPart={currentPart}
            title={title}
            isMobileSize={isMobileSize}
            dimensions={dimensions}
            active={graphicActive == "ESCPRanking"}
          />
          <DesiBarChart
            currentPart={currentPart}
            isMobileSize={isMobileSize}
            title={title}
            active={graphicActive == "DesiBarChart"}
          />
          <OesoStackedBarChart
            currentPart={currentPart}
            isMobileSize={isMobileSize}
            title={chapter2}
            listLength={isMobileSize ? 8 : 20}
            active={graphicActive == "OesoStackedBarChart"}
          />
          <SpeedScatterPlot
            currentPart={currentPart}
            title={chapter2}
            isMobileSize={isMobileSize}
            active={graphicActive == "SpeedScatterPlot"}
          />
          <div
            className={`${styles.mapImage} ${
              graphicActive == "Image" ? styles.active : ""
            }`}
          >
            <h2 className={styles.title}>Lang geen landelijke dekking</h2>
            <p className={styles.title}>
              Huishoudens aangesloten op supersnel internet (1000 Mbit/s), in %
            </p>
            <Image
              src={
                isMobileSize
                  ? `/images/${id}_11_M.svg`
                  : `/images/${id}_11_D.svg`
              }
              width={isMobileSize ? 360 : 640}
              height={isMobileSize ? 270 : 640}
              alt=""
            />
          </div>
        </>
      )}
      {chapter3 && (
        <>
          <BarChart
            currentPart={currentPart}
            isMobileSize={isMobileSize}
            active={graphicActive == "BarChart"}
          />
          <EuropeMap
            isMobileSize={isMobileSize}
            currentPart={currentPart}
            title={title}
            active={graphicActive == "EuropeMap"}
          />
          <Donut
            isMobileSize={isMobileSize}
            currentPart={currentPart}
            title={title}
            active={secondGraphicActive == "Donut"}
          />
          <Stacked
            isMobileSize={isMobileSize}
            currentPart={currentPart}
            title={title}
            active={graphicActive == "Stacked"}
          />
        </>
      )}
      {photoChapter && (
        <>
          <div
            className={`${
              currentPart == `0_${photoChapter}`
                ? styles.photoActive
                : styles.photoPassive
            }`}
          >
            <Image
              src="/images/maastricht91.jpg"
              layout="fill"
              objectFit="cover"
              objectPosition={`${isMobileSize ? "56% 100%" : ""}`}
            />
          </div>
          <div
            className={`${
              currentPart == `1_${photoChapter}`
                ? styles.photoActive
                : styles.photoPassive
            }`}
          >
            <Image
              src="/images/draghi.jpg"
              layout="fill"
              objectFit="cover"
              objectPosition={`${isMobileSize ? "55% 100%" : ""}`}
            />
          </div>
          <div
            className={`${
              currentPart == `2_${photoChapter}`
                ? styles.photoActive
                : styles.photoPassive
            }`}
          >
            <Image
              src="/images/Lagarde_Hoekstra.jpg"
              layout="fill"
              objectFit="cover"
              objectPosition={`${isMobileSize ? "22% 100%" : ""}`}
            />
          </div>
          <div
            className={`${
              currentPart == `3_${photoChapter}`
                ? styles.photoActive
                : styles.photoPassive
            }`}
          >
            <Image
              src="/images/maastricht91.jpg"
              layout="fill"
              objectFit="cover"
              objectPosition={`${isMobileSize ? "56% 100%" : ""}`}
            />
          </div>
        </>
      )}
    </div>
  );
}

export { BackgroundGraphic };
