import React, { useContext } from "react";

import Img from "../../../../shared/UI/Img/Img";
import Li from "../../../../shared/UI/Li/Li";
import Wrapper from "../../../../shared/UI/Wrapper/Wrapper";
import ModalPost from "../../../../shared/UI/Modal-Post/Modal-Post";
import { ProfileContext } from "../../../../shared/context/Profile/Profile-context";

import "../../../../index.css";

const ProfilePostsItem = props => {
  const profileContext = useContext(ProfileContext);

  const showPostHandler = async postId => {
    try {
      props.getPost(postId);
    } catch (error) {}
  };

  return (
    <Li className="profile-item">
      <Wrapper className="profile-item__content">
        {props.posts.map((item, index) => (
          <Wrapper
            key={index}
            className="profile-item__content__inside"
            onClick={showPostHandler.bind(this, item.postId)}
          >
            <ModalPost
              className="show-modal-post"
              likesQuantity={item.likesC}
              commentsQuantity={item.commentsC}
            />

            <Img
              src={
                (item.postId === profileContext.postId &&
                  profileContext.readedImage) ||
                `https://ins-app-clone.herokuapp.com/${item.image}`
              }
            />
          </Wrapper>
        ))}
      </Wrapper>
    </Li>
  );
};

export default ProfilePostsItem;
