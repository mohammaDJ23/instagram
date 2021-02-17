import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import Providers from "./shared//Utils/Providers/Providers";

import "./index.css";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Providers>
    <App />
  </Providers>,
  document.getElementById("root")
);

serviceWorker.unregister();
