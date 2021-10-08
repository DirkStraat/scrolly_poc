import { useState } from "react";
import styles from "./Scrolly.module.scss";
import { BackgroundGraphic } from "../backgroundGraphic/BackgroundGraphic";
import { ScrollyText } from "../scrollyText/ScrollyText";

function Scrolly({ article, interSect, isMobileSize }) {
  const [currentPart, setCurrentPart] = useState(null);

  return (
    <section className={styles.scrollyWrapper}>
      <div
        className={`${styles.backgroundGraphicContainer} ${
          interSect ? styles.fixed : ""
        }`}
      >
        <BackgroundGraphic
          currentPart={currentPart}
          isMobileSize={isMobileSize}
          title={article.title}
          id={article.id}
        />
      </div>
      <ScrollyText
        article={article}
        onCurrenPartChange={(cp) => setCurrentPart(cp)}
      />
    </section>
  );
}

export { Scrolly };
