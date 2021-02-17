import React, { memo } from "react";
import ReactDOM from "react-dom";

import Wrapper from "../Wrapper/Wrapper";

import "./Back-Drop.css";

const BackDrop = memo(props => {
  const back = (
    <Wrapper
      className="back-drop"
      onClick={props.onClick}
      style={{ zIndex: props.zIndex || "300" }}
    ></Wrapper>
  );

  return ReactDOM.createPortal(
    props.isActive && back,
    document.getElementById("back-drop")
  );
});

export default BackDrop;
