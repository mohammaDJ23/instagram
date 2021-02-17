import React from "react";

const Wrapper = React.forwardRef((props, ref) => {
  return (
    <div
      className={props.className}
      onClick={props.onClick}
      onMouseOver={props.onMouseOver}
      onMouseLeave={props.onMouseLeave}
      style={props.style}
      ref={ref}
    >
      {props.children}
    </div>
  );
});

export default Wrapper;
