import React from "react";

import "./Ul.css";

const Ul = React.forwardRef((props, ref) => {
  return (
    <ul className={`ul ${props.className}`} onClick={props.onClick} ref={ref}>
      {props.children}
    </ul>
  );
});

export default Ul;
