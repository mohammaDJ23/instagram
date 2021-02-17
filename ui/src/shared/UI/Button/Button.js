import React from "react";

import "./Button.css";

const Button = props => {
  return (
    <button
      onClick={props.onClick}
      type={props.type}
      className={`button ${props.className && props.className} ${
        !props.isLoading ? props.disabled && "btn-dis" : "btn-dis-folw"
      } ${!props.disabled && "btn-blue"}`}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
