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

function BackgroundGraphic({ currentPart, isMobileSize, title, id }) {
  const chapter2 = id == 1408271 ? title : "";
  const chapter3 = id == 1408272 ? title : "";
  const chapter4 = id == 1408273 ? title : "";
  const chapter5 = id == 1408385 ? title : "";

  return (
    <div className={styles.svgContainer}>
      {currentPart == `0_${chapter2}` && (
        <ESCPRanking
          currentPart={currentPart}
          title={title}
          isMobileSize={isMobileSize}
        />
      )}
      {(currentPart == `1_${chapter2}` ||
        currentPart == `2_${chapter2}` ||
        currentPart == `3_${chapter2}`) && (
        <DesiBarChart
          currentPart={currentPart}
          isMobileSize={isMobileSize}
          title={title}
        />
      )}
      {(currentPart == `4_${chapter2}` ||
        currentPart == `5_${chapter2}` ||
        currentPart == `6_${chapter2}`) && (
        <OesoStackedBarChart
          currentPart={currentPart}
          isMobileSize={isMobileSize}
          title={chapter2}
          listLength={isMobileSize ? 8 : 20}
        />
      )}
      {(currentPart == `7_${chapter2}` ||
        currentPart == `8_${chapter2}` ||
        currentPart == `9_${chapter2}` ||
        currentPart == `10_${chapter2}`) && (
        <SpeedScatterPlot
          currentPart={currentPart}
          title={chapter2}
          isMobileSize={isMobileSize}
        />
      )}
      {currentPart == `11_${chapter2}` && (
        <>
          <h2 className={styles.title}>Lang geen landelijke dekking</h2>
          <p className={styles.title}>
            Huishoudens aangesloten op supersnel internet (1000 Mbit/s), in %
          </p>
          <Image
            src={
              isMobileSize ? `/images/${id}_11_M.svg` : `/images/${id}_11_D.svg`
            }
            width={isMobileSize ? 360 : 640}
            height={isMobileSize ? 270 : 640}
            alt=""
          />
        </>
      )}
      {(currentPart == `0_${chapter3}` || currentPart == `1_${chapter3}`) && (
        <BarChart currentPart={currentPart} isMobileSize={isMobileSize} />
      )}
      {(currentPart == `2_${chapter3}` ||
        currentPart == `3_${chapter3}` ||
        currentPart == `4_${chapter3}` ||
        currentPart == `5_${chapter3}`) && (
        <EuropeMap
          isMobileSize={isMobileSize}
          currentPart={currentPart}
          title={title}
        />
      )}
      {(currentPart == `3_${chapter3}` ||
        currentPart == `4_${chapter3}` ||
        currentPart == `5_${chapter3}`) && (
        <Donut
          isMobileSize={isMobileSize}
          currentPart={currentPart}
          title={title}
        />
      )}
      {currentPart == `6_${chapter3}` && (
        <Stacked
          isMobileSize={isMobileSize}
          currentPart={currentPart}
          title={title}
        />
      )}
    </div>
  );
}

export { BackgroundGraphic };
