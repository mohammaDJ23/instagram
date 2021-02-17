import React, { useContext, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";

import Img from "../Img/Img";
import P from "../P/P";
import Ul from "../Ul/Ul";
import Li from "../Li/Li";
import PostIcons from "../Post-Icons/Post-Icons";
import PostLikes from "../Post-Likes/Post-Likes";
import PostComment from "../Post-Comment/Post-Comment";
import Wrapper from "../Wrapper/Wrapper";
import { ModalContext } from "../../../shared/context/Modal/Modal-context";
import profile from "../../../assets/images/profile.png";
import { PostContext } from "../../context/Post/Post-Context";
import BackDrop from "../../UI/Back-Drop/Back-Drop";
import Modal from "../../UI/Modal/Modal";
import Button from "../../UI/Button/Button";
import { AuthContext } from "../../context/Auth/Auth-context";
import Spinner from "../../UI/Spinner/Spinner";

import "./Pst.css";

const Pst = props => {
  const modalContext = useContext(ModalContext);
  const postContext = useContext(PostContext);
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const commentsSection = useRef();

  useEffect(() => {
    if (commentsSection.current) {
      commentsSection.current.scrollTop = commentsSection.current.scrollHeight;
    }
  }, [commentsSection, props.addComment]);

  const showDeleteModalHandler = () => {
    modalContext.showModal("update or delete?");
  };

  const navigateToProfile = (e, userId) => {
    postContext.hidePost();
    props.navigateToProfile(e, userId ? userId : props.post.userId);
  };

  let userLike;

  if (props.post) {
    userLike = props.post.likes.likes.find(
      item => item.userId === authContext.userId
    );
  }

  const toUpdatePostHandler = () => {
    modalContext.hideModal();
    postContext.hidePost();
    history.push(`/${props.post.postId}/update-post`);
  };

  return (
    <React.Fragment>
      <BackDrop
        isActive={modalContext.isActive}
        onClick={() => modalContext.hideModal()}
        zIndex="500"
      />

      <Modal
        zIndex="600"
        isActive={
          modalContext.isActive && modalContext.header === "update or delete?"
        }
        header={modalContext.header}
        height="auto"
      >
        <Wrapper className="post__modal-inside">
          <Wrapper>
            <h3 className="black" onClick={toUpdatePostHandler}>
              Edit the post
            </h3>
          </Wrapper>

          <Wrapper>
            <Button
              type="button"
              className="btn-blue"
              onClick={() => props.deletePostHandler(props.post.postId)}
            >
              Delete post
            </Button>

            <Button
              type="button"
              className="btn-white"
              onClick={() => modalContext.hideModal()}
            >
              Cancel
            </Button>
          </Wrapper>

          <Wrapper>
            <Spinner
              isLoading={props.isLoading}
              margin="auth"
              width="1.4rem"
              height="1.4rem"
            />
          </Wrapper>
        </Wrapper>
      </Modal>

      <Wrapper
        className={`post ${props.inModal && "in-Modal"} ${
          props.inPage && "in-page background-border"
        }`}
      >
        {props.post ? (
          <Wrapper className="post__content">
            <Wrapper className="post__content__profile">
              <Wrapper>
                <Img
                  src={`https://ins-app-clone.herokuapp.com/${props.post.image}`}
                />
              </Wrapper>
            </Wrapper>

            <Wrapper className="post__content__post-info">
              <header className="post__content__post-info__header">
                <Wrapper className="post__content__post-info__header__inside">
                  <Wrapper>
                    <Wrapper>
                      <Link to="" onClick={e => navigateToProfile(e)}>
                        <Img
                          src={
                            props.post.profile
                              ? `https://ins-app-clone.herokuapp.com/${props.post.profile}`
                              : profile
                          }
                        />
                      </Link>
                    </Wrapper>

                    <Wrapper>
                      <Link
                        to=""
                        className="text-decoration weight black"
                        onClick={e => navigateToProfile(e)}
                      >
                        <P>{props.post.name}</P>
                      </Link>
                    </Wrapper>
                  </Wrapper>

                  {props.post.userId === authContext.userId && props.isProfile && (
                    <Wrapper
                      onClick={showDeleteModalHandler}
                      className="post__content__post-info__header__inside__info"
                    >
                      <Wrapper></Wrapper>
                      <Wrapper></Wrapper>
                      <Wrapper></Wrapper>
                    </Wrapper>
                  )}
                </Wrapper>
              </header>

              <Wrapper
                className={`post__content__post-info__comments ${
                  props.post.comments.comments.length === 0 && "center weight"
                }`}
                ref={commentsSection}
              >
                {props.post.comments.comments.length === 0 ? (
                  <P>There is no comments in here</P>
                ) : (
                  <Ul>
                    {props.post.comments.comments.map((item, index) => (
                      <Li key={index}>
                        <Wrapper className="post__content__post-info__comments__inside">
                          <Wrapper>
                            <Link
                              to=""
                              onClick={e => navigateToProfile(e, item.userId)}
                            >
                              <Img
                                src={
                                  item.profile
                                    ? `https://ins-app-clone.herokuapp.com/${item.profile}`
                                    : profile
                                }
                              />
                            </Link>
                          </Wrapper>

                          <Wrapper>
                            <Link
                              to=""
                              className="text-decoration black weight"
                              onClick={e => navigateToProfile(e, item.userId)}
                            >
                              {item.name}
                            </Link>{" "}
                            <P>{item.comment}</P>
                          </Wrapper>
                        </Wrapper>
                      </Li>
                    ))}
                  </Ul>
                )}
              </Wrapper>

              <Wrapper className="post__content__post-info__icons-comment">
                <Wrapper className="post__content__post-info__icons-comment__icons">
                  <PostIcons
                    isPost={props.isPost}
                    postId={props.post.postId}
                    savePostHandler={props.savePostHandler}
                    likeHandler={props.likeHandler}
                    likeIcon={userLike && userLike.isActive}
                    isSaved={props.isSaved || props.post.isSaved}
                    isPostHide={props.isPostHide}
                    savePost={props.savePost}
                    like={props.like}
                  />
                </Wrapper>

                <Wrapper className="post__content__post-info__icons-comment__likes">
                  <PostLikes
                    likes={props.post.likes.likes}
                    navigateToProfile={props.navigateToProfile}
                    postId={props.post.postId}
                  />
                </Wrapper>

                <PostComment
                  postId={props.post.postId}
                  addComment={props.addComment}
                  addComnt={props.addComnt}
                />
              </Wrapper>
            </Wrapper>
          </Wrapper>
        ) : (
          props.spinner
        )}
      </Wrapper>
    </React.Fragment>
  );
};

export default Pst;
