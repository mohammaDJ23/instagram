import React, { useContext } from "react";
import { Link } from "react-router-dom";

import Wrapper from "../../../shared/UI/Wrapper/Wrapper";
import P from "../../../shared/UI/P/P";
import Img from "../../../shared/UI/Img/Img";
import Li from "../../../shared/UI/Li/Li";
import PostIcons from "../../../shared/UI/Post-Icons/Post-Icons";
import PostLikes from "../../../shared/UI/Post-Likes/Post-Likes";
import PostComment from "../../../shared/UI/Post-Comment/Post-Comment";
import profile from "../../../assets/images/profile.png";
import { PostContext } from "../../../shared/context/Post/Post-Context";
import { ModalContext } from "../../../shared/context/Modal/Modal-context";
import Modal from "../../../shared/UI/Modal/Modal";
import Ul from "../../../shared/UI/Ul/Ul";
import LikesList from "../Likes-List/Likes-List";

import { AuthContext } from "../../../shared/context/Auth/Auth-context";
import "./Post-Item.css";

const PostItme = props => {
  const authContext = useContext(AuthContext);
  const postContext = useContext(PostContext);
  const modalContext = useContext(ModalContext);
  const comments = props.comments.comments;
  const commentsQu = props.comments.quantity;

  const navigateToPost = e => {
    e.preventDefault();
    postContext.showPost();
    props.getPost(props.postId);
  };

  const userLike = props.likes.likes.find(
    item => item.userId === authContext.userId
  );

  return (
    <React.Fragment>
      <Modal
        isActive={
          modalContext.isActive &&
          modalContext.header === "Likes" &&
          modalContext.postId === props.postId &&
          !postContext.isActive
        }
        header={modalContext.header}
        zIndex={postContext.isActive && "600"}
      >
        <Ul>
          <LikesList
            navigateToProfile={props.navigateToProfile}
            followHandler={props.followHandler}
            likes={props.likes.likes}
            postId={props.postId}
            follow={props.follow}
            isLoading={props.isLoading}
          />
        </Ul>
      </Modal>

      <Li className="post-item background-border">
        <header className="post-item__header">
          <Wrapper>
            <Link to="" onClick={e => props.navigateToProfile(e, props.userId)}>
              <Img
                src={
                  props.profile
                    ? `https://ins-app-clone.herokuapp.com/${props.profile}`
                    : profile
                }
                alt={props.name}
              />
            </Link>
          </Wrapper>

          <Wrapper>
            <h4>
              <Link
                className="black weight text-decoration"
                to=""
                onClick={e => props.navigateToProfile(e, props.userId)}
              >
                {props.name}
              </Link>
            </h4>

            <P>
              <Link className="black text-decoration" to={``}>
                {props.location}
              </Link>
            </P>
          </Wrapper>
        </header>

        <Wrapper className="post-item__image h-470">
          <Img
            src={`https://ins-app-clone.herokuapp.com/${props.image}`}
            alt={props.description}
            className="image-cover"
            style={{ width: "100%", height: "100%" }}
          />
        </Wrapper>

        <Wrapper className="post-item__like-comment-message">
          <PostIcons
            isPost={true}
            postId={props.postId}
            likeIcon={userLike && userLike.isActive}
            isSaved={props.isSaved}
            likeHandler={props.likeHandler}
            savePostHandler={props.savePostHandler}
            like={props.like}
            savePost={props.savePost}
          />
        </Wrapper>

        <Wrapper className="post-item__liked">
          <PostLikes
            likes={props.likes.likes}
            navigateToProfile={props.navigateToProfile}
            postId={props.postId}
          />
        </Wrapper>

        <Wrapper className="post-item__description">
          <P>
            <Link
              className="black weight text-decoration"
              to=""
              onClick={e => props.navigateToProfile(e, props.userId)}
            >
              {props.name}
            </Link>{" "}
            {props.description}
          </P>

          {commentsQu > 0 && (
            <Wrapper className="post-item__description-view-comment">
              <Link
                className="gray text-decoration"
                to=""
                onClick={e => navigateToPost(e)}
              >
                View {commentsQu === 1 ? "" : "all"} {commentsQu}{" "}
                {commentsQu === 1 ? "comment" : "comments"}
              </Link>
            </Wrapper>
          )}

          {comments.length >= 2 && (
            <Wrapper className="post-item__description-comments">
              <P>
                <Link
                  className="black weight text-decoration"
                  to=""
                  onClick={e =>
                    props.navigateToProfile(e, comments[comments.length - 1].userId)
                  }
                >
                  {comments[comments.length - 1].name}
                </Link>{" "}
                {comments[comments.length - 1].comment}
              </P>
            </Wrapper>
          )}
        </Wrapper>

        <Wrapper className="post-item__time">
          <P className="post-item__time__time gray">{props.createdAt}</P>
        </Wrapper>

        <PostComment
          postId={props.postId}
          addComment={props.addComment}
          addComnt={props.addComnt}
        />
      </Li>
    </React.Fragment>
  );
};

export default PostItme;
