import React, { memo } from "react";
import ReactDOM from "react-dom";

import Pst from "../Pst/Pst";

import "./Post.css";

const Post = memo(props => {
  const post = (
    <Pst
      post={props.post}
      inModal={true}
      spinner={props.spinner}
      setProfile={props.setProfile}
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
  );

  return ReactDOM.createPortal(
    props.isActive && post,
    document.getElementById("post")
  );
});

export default Post;
