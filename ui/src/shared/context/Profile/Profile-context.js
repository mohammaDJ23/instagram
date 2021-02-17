import React, { useState, useEffect, useCallback } from "react";

export const ProfileContext = React.createContext({
  profile: {},
  img: null,
  postId: "",
  userId: "",
  readedImage: null,
  getProfile: () => {},
  navigateToProfile: () => {},
  getImage: () => {},
  getUserIdInParams: () => {}
});

const ProfileContextProvider = props => {
  const [profile, setProfile] = useState({});
  const [img, setImage] = useState(null);
  const [postId, setPostId] = useState("");
  const [userId, setUserId] = useState("");
  const [readedImage, setReadedImage] = useState(null);

  const getProfile = useCallback(info => {
    setProfile(info);
  }, []);

  const navigateToProfile = useCallback(callback => {
    setProfile({});
    callback && callback();
  }, []);

  const getImage = useCallback(image => {
    setImage(image.image);
    setPostId(image.postId);
  }, []);

  const getUserIdInParams = useCallback(userId => setUserId(userId), []);

  useEffect(() => {
    if (img) {
      const fileReader = new FileReader();
      fileReader.onload = () => setReadedImage(fileReader.result);
      fileReader.readAsDataURL(img);
    }
  }, [img]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        readedImage,
        postId,
        userId,
        navigateToProfile,
        getProfile,
        getImage,
        getUserIdInParams
      }}
    >
      {props.children}
    </ProfileContext.Provider>
  );
};

export default ProfileContextProvider;
