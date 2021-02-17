import React, { useCallback, useState } from "react";

import {
  isModalActive,
  isModalHide
} from "../../../shared/Utils/body-styles/body-styles";

export const PostContext = React.createContext({
  isActive: false,
  psts: {},
  showPost: () => {},
  hidePost: () => {},
  getPsts: () => {}
});

const PostContextProvider = props => {
  const [psts, setPsts] = useState({});
  const [isActive, setIsActive] = useState(false);
  const getPsts = useCallback(psts => setPsts(psts), []);

  const showPost = useCallback(() => {
    setIsActive(true);
    isModalActive();
  }, []);

  const hidePost = useCallback(() => {
    setIsActive(false);
    isModalHide();
  }, []);

  return (
    <PostContext.Provider
      value={{ isActive, psts, getPsts, showPost, hidePost }}
    >
      {props.children}
    </PostContext.Provider>
  );
};

export default PostContextProvider;
