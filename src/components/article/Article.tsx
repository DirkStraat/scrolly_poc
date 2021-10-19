import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Article.module.scss";
import { Scrolly } from "../scrolly/Scrolly";

function Article({ article, isMobileSize, dimensions }) {
  const scrollyRef = useRef(null);
  const [interSect, setIntersect] = useState(false);

  const options = {
    root: null,
    rootMargin: "0px 0px -100% 0px",
    threshold: [0, 0.5],
  };

  const scrollyCallBackFunction = useCallback((entries) => {
    entries.map((entry) => {
      if (entry.isIntersecting) {
        setIntersect(true);
      } else {
        setIntersect(false);
      }
    });
  }, []);

  useEffect(() => {
    const scrollyObserver = new IntersectionObserver(
      scrollyCallBackFunction,
      options
    );
    if (scrollyRef.current) {
      scrollyObserver.observe(scrollyRef.current);
    }
    const ref = scrollyRef.current;

    return () => {
      if (ref) {
        scrollyObserver.disconnect();
      }
    };
  }, [scrollyRef, options, scrollyCallBackFunction]);

  return (
    <>
      <div className={styles.articleWrapper}>
        <div className={styles.articleIntro}>
          <h2 className={`heading serif m ${styles.introHeader}`}>
            {article.title}
          </h2>
          <p className={`body-text serif s ${styles.introText}`}>
            {article.teaser.content}
          </p>
        </div>
        <section ref={scrollyRef}>
          <Scrolly
            article={article}
            interSect={interSect}
            isMobileSize={isMobileSize}
            dimensions={dimensions}
          />
        </section>
      </div>
    </>
  );
}

export { Article };
