import React from "react";

const P = props => {
  return (
    <p className={props.className} onClick={props.onClick}>
      {props.children}
    </p>
  );
};

export default P;
