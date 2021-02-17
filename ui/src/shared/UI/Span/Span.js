import React from "react";

const Span = props => {
  return (
    <span className={props.className} onClick={props.onClick}>
      {props.children}
    </span>
  );
};

export default Span;
