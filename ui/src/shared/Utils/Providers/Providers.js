import React from "react";

import ModalContextProvider from "../../context/Modal/Modal-context";
import PostContextProvider from "../../context/Post/Post-Context";
import AuthContextProvider from "../../context/Auth/Auth-context";
import ProfileContextProvider from "../../context/Profile/Profile-context";

const Providers = props => (
  <ProfileContextProvider>
    <AuthContextProvider>
      <ModalContextProvider>
        <PostContextProvider>{props.children}</PostContextProvider>
      </ModalContextProvider>
    </AuthContextProvider>
  </ProfileContextProvider>
);

export default Providers;
