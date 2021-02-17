import React, { useCallback, useState } from "react";

import {
  isModalActive,
  isModalHide
} from "../../../shared/Utils/body-styles/body-styles";

export const ModalContext = React.createContext({
  isActive: false,
  error: "",
  header: "",
  postId: "",
  showModal: () => {},
  hideModal: () => {},
  err: () => {}
});

const ModalContextProvider = props => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const [header, setHeader] = useState("");
  const [postId, setPostId] = useState("");

  const showModal = useCallback((header, postId, callback) => {
    setIsActive(true);
    setHeader(header);
    setError("");
    isModalActive();
    postId && setPostId(postId);
    callback && callback();
  }, []);

  const hideModal = useCallback(callback => {
    setIsActive(false);
    setError("");
    setHeader("");
    isModalHide();
    setPostId("");
    callback && callback();
  }, []);

  const err = useCallback(error => {
    setError(error);
    setIsActive(true);
    isModalActive();
    setHeader("An error ocurred");
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isActive,
        error,
        header,
        postId,
        showModal,
        hideModal,
        err
      }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
