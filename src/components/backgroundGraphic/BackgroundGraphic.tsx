import styles from "./BackgroundGraphic.module.scss";
import { BarChart } from "../barChart/BarChartHorizontal";

function BackgroundGraphic(props: any) {
  const svgWidth =
    props.screenWidth > 1024
      ? 650
      : props.screenWidth > 640
      ? 640
      : props.screenwidth > 360
      ? 360
      : props.screenwidth > 320
      ? 320
      : 200;

  return (
    <div className={styles.svgContainer}>
      {/* <svg
          width={svgWidth}
          height={svgWidth}
          fill={props.fill}
          className={`${
            props.currentPart == `0_${props.articleId}`
              ? ""
              : props.currentPart == `1_${props.articleId}`
              ? ""
              : props.currentPart == null
              ? ""
              : `${styles.active}`
          }`}
        >
          <rect width={svgWidth} height={svgWidth} />
        </svg> */}
      <BarChart
        currentPart={props.currentPart}
        isMobileSize={true}
        title={props.title}
        active={
          props.currentPart == `0_${props.articleId}` ||
          props.currentPart == `1_${props.articleId}`
        }
      />
    </div>
  );
}

export { BackgroundGraphic };
