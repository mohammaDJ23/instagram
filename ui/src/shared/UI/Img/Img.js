import React from "react";

const Img = props => {
  return (
    <img
      src={props.src}
      className={props.className}
      alt={props.alt}
      style={props.style}
    />
  );
};

export default Img;
