import { useCallback, useRef, useState, useEffect } from "react";
import styles from "./Scrolly.module.scss";
import { BackgroundGraphic } from "../backgroundGraphic/BackgroundGraphic";

function Scrolly(props: any) {
  const articlePartsRef = useRef([]);
  const [currentPart, setCurrentPart] = useState(null);
  const [activeElements, setActiveElements] = useState([]);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    console.log(currentPart);
  }, [currentPart]);

  useEffect(() => {
    if (props.isMobileSize) {
      setOptions({
        root: null,
        rootMargin: "-480px 0px -100px 0px",
        treshold: 0,
      });
    } else {
      setOptions({
        root: null,
        rootMargin: "-20px 0px -20px 0px",
        treshold: 0,
      });
    }
  }, [props.isMobileSize]);

  const callBackFunction = useCallback(
    (entries) => {
      entries.map((entry) => {
        const targetID = entry.target.id;
        if (entry.isIntersecting && activeElements.indexOf(targetID) < 0) {
          setActiveElements((previousActiveElements) => [
            ...previousActiveElements,
            targetID,
          ]);
          if (activeElements) setCurrentPart(targetID);
        } else if (
          activeElements.indexOf(targetID) >= 0 &&
          !entry.isIntersecting
        ) {
          const newActiveElements = activeElements.filter(
            (activeElement) => activeElement !== targetID
          );
          setActiveElements(newActiveElements);
          if (newActiveElements.length == 1) {
            setCurrentPart(newActiveElements[0]);
          }
        }
      });
    },
    [activeElements]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(callBackFunction, options);
    if (articlePartsRef.current) {
      articlePartsRef.current.map((element) => {
        observer.observe(element);
      });
    }

    const ref = articlePartsRef.current;

    return () => {
      if (ref) {
        observer.disconnect();
      }
    };
  }, [articlePartsRef, callBackFunction, options]);

  useEffect(() => {
    articlePartsRef.current = articlePartsRef.current.slice(
      0,
      props.article.separatedContent.length
    );
  }, [props.article.separatedContent]);

  return (
    <section className={styles.scrollyWrapper}>
      <div
        className={`${styles.backgroundGraphicContainer} ${
          props.interSect ? styles.fixed : ""
        }`}
      >
        <BackgroundGraphic
          currentPart={currentPart}
          articleId={props.article.id}
          screenWidth={props.screenWidth}
        />
      </div>
      <div className={styles.scrollyTextContainer}>
        {props.article.separatedContent.map((part, i) => {
          return (
            <div
              className={styles.scrollyTextPart}
              key={Math.random()}
              ref={(el) => (articlePartsRef.current[i] = el)}
              id={`${i + "_" + props.article.id}`}
            >
              {part.map((element) => {
                return element.name == "h2" ? (
                  <h2 className={`heading serif l`} key={Math.random() * 10}>
                    {element.content}
                  </h2>
                ) : element.name == "p" ? (
                  <p className={`body-text sans`} key={Math.random() * 10}>
                    {element.content}
                  </p>
                ) : (
                  ""
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export { Scrolly };
