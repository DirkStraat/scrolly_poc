import { useCallback, useRef, useState, useEffect } from "react";
import styles from "./ScrollyText.module.scss";

function ScrollyText({ article, onCurrenPartChange = (f) => f }) {
  const articlePartsRef = useRef([]);
  const [currentPart, setCurrentPart] = useState(null);
  const [activeElements, setActiveElements] = useState([]);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    onCurrenPartChange(currentPart);
  }, [currentPart]);

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

    return () => {
      if (articlePartsRef.current) {
        observer.disconnect();
      }
    };
  }, [articlePartsRef, callBackFunction, options]);

  useEffect(() => {
    articlePartsRef.current = articlePartsRef.current.slice(
      0,
      article.separatedContent.length
    );
  }, [article.separatedContent]);

  return (
    <div className={styles.scrollyTextContainer}>
      {article.separatedContent.map((part, i) => {
        return (
          <div
            className={styles.scrollyTextPart}
            key={`${i + "_" + article.id}`}
            ref={(el) => (articlePartsRef.current[i] = el)}
            id={`${i + "_" + article.title}`}
          >
            {part.map((element, i) => {
              return element.name == "h2" ? (
                <h2
                  className={`heading serif l`}
                  key={`${i}_${element.content.slice(0, 3)}`}
                >
                  {element.content}
                </h2>
              ) : element.name == "p" ? (
                <p
                  className={`body-text sans`}
                  key={`${i}_${element.content.slice(0, 3)}`}
                >
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
  );
}

export { ScrollyText };
