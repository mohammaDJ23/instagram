import React from "react";

const Aside = props => {
  return <aside className={props.className}>{props.children}</aside>;
};

export default Aside;
