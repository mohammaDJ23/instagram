import React from "react";

const Li = props => {
  return (
    <li className={props.className} onClick={props.onClick}>
      {props.children}
    </li>
  );
};

export default Li;
