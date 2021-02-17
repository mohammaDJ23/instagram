import React, { memo, useContext } from "react";
import { useParams } from "react-router-dom";

import Ul from "../../../../shared/UI/Ul/Ul";
import ProfilePostItem from "../Profile-Posts-Item/Profile-Post-Item";
import { lists } from "../../../../shared/Utils/reducer/reducer";
import BackDrop from "../../../../shared/UI/Back-Drop/Back-Drop";
import Post from "../../../../shared/UI/Post/Post";
import { PostContext } from "../../../../shared/context/Post/Post-Context";
import P from "../../../../shared/UI/P/P";
import { AuthContext } from "../../../../shared/context/Auth/Auth-context";
import Modal from "../../../../shared/UI/Modal/Modal";
import LikesList from "../../../Posts-components/Likes-List/Likes-List";
import { ModalContext } from "../../../../shared/context/Modal/Modal-context";

import "../../../../index.css";

const ProfilePostsLists = memo(props => {
  const postContext = useContext(PostContext);
  const authContext = useContext(AuthContext);
  const modalContext = useContext(ModalContext);
  const { userId } = useParams();

  return (
    <React.Fragment>
      <BackDrop
        isActive={
          postContext.isActive && modalContext.header !== "An error ocurred"
        }
        onClick={() => postContext.hidePost()}
      />

      {props.post && (
        <Modal
          isActive={modalContext.isActive && modalContext.header === "Likes"}
          header={modalContext.header}
          zIndex={postContext.isActive && "600"}
        >
          <Ul>
            <LikesList
              likes={props.post.likes.likes}
              followHandler={props.followHandler}
              navigateToProfile={props.navigateToProfile}
              follow={props.follow}
              isLoading={props.isLoading}
            />
          </Ul>
        </Modal>
      )}

      <Post
        isActive={postContext.isActive}
        post={props.post}
        onClick={() => postContext.hidePost()}
        spinner={props.spinner}
        navigateToProfile={props.navigateToProfile}
        likeHandler={props.likeHandler}
        savePostHandler={props.savePostHandler}
        isPostHide={props.isPostHide}
        addComment={props.addComment}
        isProfile={props.isProfile}
        deletePostHandler={props.deletePostHandler}
        isLoading={props.isLoading}
        addComnt={props.addComnt}
        savePost={props.savePost}
        like={props.like}
      />

      {props.isPosts &&
        (props.posts.length > 0 ? (
          <Ul className="profile-flex">
            {lists([...props.posts], 3).map((posts, index) => (
              <ProfilePostItem
                key={index}
                posts={posts}
                getPost={props.getPost}
              />
            ))}
          </Ul>
        ) : (
          <P className="weight center">
            {authContext.userId === userId
              ? "you don't have any posts"
              : "the user doesn't have any posts"}
          </P>
        ))}

      {props.isSaved &&
        (props.saved.length > 0 ? (
          <Ul className="profile-flex">
            {lists([...props.saved], 3).map((posts, index) => (
              <ProfilePostItem
                key={index}
                posts={posts}
                getPost={props.getPost}
              />
            ))}
          </Ul>
        ) : (
          <P className="weight center">
            {authContext.userId === userId
              ? "no posts you saved"
              : "the user doesn't have any saved posts"}
          </P>
        ))}
    </React.Fragment>
  );
});

export default ProfilePostsLists;
