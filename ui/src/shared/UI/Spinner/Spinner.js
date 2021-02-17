import React, { memo } from "react";

import Wrapper from "../Wrapper/Wrapper";

import "./Spinner.css";

const Spinner = memo(props => {
  return (
    props.isLoading && (
      <Wrapper
        className="loader"
        style={{
          margin: props.margin || "180px auto",
          width: props.width || "4rem",
          height: props.height || "4rem"
        }}
      ></Wrapper>
    )
  );
});

export default Spinner;
