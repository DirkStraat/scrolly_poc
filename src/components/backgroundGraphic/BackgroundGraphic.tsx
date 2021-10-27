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
import { ECBStream } from "../ecbStream/ECBStream";
import { useEffect, useState } from "react";
import isMobileStore from "../../stores/isMobileStore";

const graphics = [
  "ESCPRanking",
  "DesiBarChart",
  "OesoStackedBarChart",
  "SpeedScatterPlot",
  "Image",
  "BarChart",
  "EuropeMap",
  "Donut",
  "ECBStream",
];

const images = [
  {
    title: "maastricht91",
    position: 55,
  },
  {
    title: "draghi",
    position: 56,
  },
  {
    title: "Lagarde_Hoekstra",
    position: 22,
  },
  {
    title: "maastricht91",
    position: 55,
  },
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
  // const [isMobileSize, setIsMobileSize] = useState(true);
  const chapter2 = id == 1408271 ? title : "";
  const chapter3 = id == 1408272 ? title : "";
  const photoChapter = id == 1408273 ? title : "";

  // useEffect(() => {
  //   const subscriptionID = isMobileStore.subscribe(() => {
  //     setIsMobileSize(isMobileStore.getIsMobile);
  //   });

  //   return () => {
  //     isMobileStore.unsubscribe(subscriptionID);
  //   };
  // }, []);

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
        setGraphicActive(graphics[5]);
        break;
      case `1_${chapter3}`:
      case `2_${chapter3}`:
      case `3_${chapter3}`:
      case `4_${chapter3}`:
      case `5_${chapter3}`:
        setGraphicActive(graphics[8]);
        break;
      case `3_${chapter3}`:
      case `4_${chapter3}`:
      case `5_${chapter3}`:
        setSecondGraphicActive(graphics[7]);
        break;
      case `6_${chapter3}`:
        setGraphicActive(graphics[6]);
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
          <ECBStream
            isMobileSize={isMobileSize}
            currentPart={currentPart}
            title={title}
            active={graphicActive == "ECBStream"}
          />
        </>
      )}
      {photoChapter &&
        images.map((image, i) => {
          return (
            <div
              key={`${i}_${image.title}`}
              className={`${styles.photoWrapper} ${
                currentPart == `${i}_${photoChapter}`
                  ? styles.photoActive
                  : styles.photoPassive
              }`}
            >
              <Image
                src={`/images/${image.title}.jpg`}
                layout="fill"
                objectFit="cover"
                objectPosition={`${
                  isMobileSize ? `${image.position}% 100%` : ""
                }`}
              />
            </div>
          );
        })}
    </div>
  );
}

export { BackgroundGraphic };
