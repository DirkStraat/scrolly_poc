import React from "react";
import "@fdmg/design-system/components/design-tokens/design-tokens.css";
import "@fdmg/design-system/components/input/TextInput.css";
import "@fdmg/design-system/components/input/TextArea.css";
import "/styles/global.scss";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
