import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { PostContext } from "../../context/Post/Post-Context";
import { ModalContext } from "../../context/Modal/Modal-context";
import P from "../P/P";

const PostLikes = props => {
  const postContext = useContext(PostContext);
  const modalContext = useContext(ModalContext);
  const likesLength = props.likes[props.likes.length - 1];

  const navigateToProfile = e => {
    postContext.hidePost();
    props.navigateToProfile(e, likesLength.userId);
  };

  const navigateToLikes = e => {
    e.preventDefault();
    modalContext.showModal("Likes", props.postId && props.postId);
  };

  return (
    props.likes.length > 0 && (
      <P>
        Liked by{" "}
        <Link
          className="black weight text-decoration"
          to=""
          onClick={e => navigateToProfile(e)}
        >
          {likesLength.name}
        </Link>{" "}
        {props.likes.length >= 2 && (
          <React.Fragment>
            and{" "}
            <Link
              className="black weight text-decoration"
              to=""
              onClick={e => navigateToLikes(e)}
            >
              others
            </Link>
          </React.Fragment>
        )}
      </P>
    )
  );
};

export default PostLikes;
