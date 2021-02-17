import React, { memo } from "react";
import ReactDOM from "react-dom";

import Wrapper from "../Wrapper/Wrapper";

import "./Modal.css";

const Modal = memo(props => {
  const mod = (
    <Wrapper
      className="modal white"
      style={{ zIndex: props.zIndex || "400", height: props.height || "500px" }}
    >
      <Wrapper className="modal__content">
        <Wrapper className="modal__content__header">
          <header>
            <h2>{props.header}</h2>
          </header>
        </Wrapper>

        <Wrapper className="modal__content__info">{props.children}</Wrapper>
      </Wrapper>
    </Wrapper>
  );

  return ReactDOM.createPortal(
    props.isActive && mod,
    document.getElementById("modal")
  );
});

export default Modal;
