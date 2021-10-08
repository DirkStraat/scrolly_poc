import { useState, useEffect } from "react";
import { debounce } from "./debounce";

export default function useWindowDimensions() {
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        debounce(() => {
          setWidth(window.innerWidth);
          setHeight(window.innerHeight);
        }, 100);
      };

      window.addEventListener("resize", handleResize);

      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    }
  }, [typeof window]);

  return { width, height };
}
