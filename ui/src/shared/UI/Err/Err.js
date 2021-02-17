import React, { memo, useContext } from "react";

import P from "../P/P";
import BackDrop from "../Back-Drop/Back-Drop";
import Modal from "../Modal/Modal";
import { ModalContext } from "../../context/Modal/Modal-context";

import "./Err.css";

const Err = memo(() => {
  const modalContext = useContext(ModalContext);

  return (
    modalContext.error && (
      <React.Fragment>
        <BackDrop
          isActive={modalContext.isActive}
          onClick={() => modalContext.hideModal()}
        />

        <Modal
          isActive={modalContext.isActive}
          header={modalContext.header}
          height="auto"
        >
          <P className="weight">{modalContext.error}</P>
        </Modal>
      </React.Fragment>
    )
  );
});

export default Err;
