import React, { useContext, useEffect } from "react";

import Section from "../../shared/UI/Section/Section";
import Pst from "../../shared/UI/Pst/Pst";
import { useParams } from "react-router-dom";
import { useHttp } from "../../shared/hooks/http/http-hook";
import Err from "../../shared/UI/Err/Err";
import Spinner from "../../shared/UI/Spinner/Spinner";
import { ModalContext } from "../../shared/context/Modal/Modal-context";
import Modal from "../../shared/UI/Modal/Modal";
import Ul from "../../shared/UI/Ul/Ul";
import LikesList from "../../components/Posts-components/Likes-List/Likes-List";

const Post = () => {
  const { postId } = useParams();

  const [
    isLoading,
    ,
    getPost,
    post,
    ,
    addComment,
    likeHandler,
    savePostHandler,
    ,
    ,
    ,
    navigateToProfile,
    followHandler,
    follow
  ] = useHttp();

  const modalContext = useContext(ModalContext);

  useEffect(() => {
    if (postId && Object.getOwnPropertyNames(post).length === 0) {
      (async () => {
        try {
          await getPost(postId, "inPage");
        } catch (error) {}
      })();
    }
  }, [getPost, postId, post]);

  return (
    <Section className="section">
      <Err />

      {post.post && (
        <React.Fragment>
          <Modal
            isActive={modalContext.isActive && modalContext.header === "Likes"}
            header={modalContext.header}
            zIndex="600"
          >
            <Ul>
              <LikesList
                navigateToProfile={navigateToProfile}
                followHandler={followHandler}
                likes={post.post.likes.likes}
                follow={follow}
                isLoading={isLoading}
              />
            </Ul>
          </Modal>

          <Pst
            post={post.post}
            inPage={true}
            isPost={true}
            navigateToProfile={navigateToProfile}
            savePostHandler={savePostHandler}
            likeHandler={likeHandler}
            isSaved={post.post.isSaved}
            addComment={addComment}
          />
        </React.Fragment>
      )}

      <Spinner isLoading={isLoading && !post.post} />
    </Section>
  );
};

export default Post;
