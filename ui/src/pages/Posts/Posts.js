import React, { useCallback, useContext, useEffect } from "react";

import Aside from "../../components/Posts-components/Aside/Aside";
import PostsList from "../../components/Posts-components/Posts-List/Posts-List";
import { AuthContext } from "../../shared/context/Auth/Auth-context";
import { useHttp } from "../../shared/hooks/http/http-hook";
import Section from "../../shared/UI/Section/Section";
import Err from "../../shared/UI/Err/Err";
import Spinner from "../../shared/UI/Spinner/Spinner";
import { PostContext } from "../../shared/context/Post/Post-Context";
import BackDrop from "../../shared/UI/Back-Drop/Back-Drop";
import Post from "../../shared/UI/Post/Post";
import { ModalContext } from "../../shared/context/Modal/Modal-context";
import Modal from "../../shared/UI/Modal/Modal";
import LikesList from "../../components/Posts-components/Likes-List/Likes-List";
import Ul from "../../shared/UI/Ul/Ul";

const Posts = () => {
  const [
    isLoading,
    ,
    getPost,
    post,
    changePost,
    addComment,
    likeHandler,
    savePostHandler,
    ,
    ,
    ,
    navigateToProfile,
    followHandler,
    ,
    getAllData,
    data,
    ,
    getData,
    scrollHandler
  ] = useHttp();

  const authContext = useContext(AuthContext);
  const modalContext = useContext(ModalContext);
  const { isActive, hidePost, getPsts } = useContext(PostContext);

  useEffect(() => {
    (async () => {
      if (
        authContext.userId &&
        authContext.token &&
        Object.getOwnPropertyNames(data).length === 0
      ) {
        try {
          await getAllData({ action: "posts" });
        } catch (error) {}
      }
    })();

    const scrlHandler = async e => {
      try {
        scrollHandler(e, { action: "posts" }, () => {
          removehandler(scrlHandler);
        });
      } catch (error) {}
    };

    window.addEventListener("scroll", scrlHandler);
    return () => removehandler(scrlHandler);
  }, [authContext.userId, authContext.token, data, getAllData, scrollHandler]);

  const removehandler = scrollHandler => {
    return window.removeEventListener("scroll", scrollHandler);
  };

  useEffect(() => {
    getPsts(data);
  }, [getPsts, data]);

  const like = useCallback(
    (postId, likeIcon) => {
      const psts = { ...data };
      const pst = psts.data.find(p => p.postId === postId);

      if (pst && !likeIcon) {
        pst.likes.likes.push({
          userId: authContext.userId,
          name: authContext.name,
          profile: authContext.profile,
          isActive: true
        });
      }

      if (pst && likeIcon) {
        const findedUser = pst.likes.likes.findIndex(
          u => u.userId === authContext.userId
        );

        if (findedUser > -1) {
          pst.likes.likes.splice(findedUser, 1);
        }
      }

      getData(psts);
    },
    [data, authContext.userId, authContext.name, authContext.profile, getData]
  );

  const savePost = useCallback(
    (postId, isSaved) => {
      const psts = { ...data };
      const pst = psts.data.find(p => p.postId === postId);

      if (pst && isSaved) {
        pst.isSaved = false;
      }

      if (pst && !isSaved) {
        pst.isSaved = true;
      }

      getData(psts);
    },
    [data, getData]
  );

  const addComnt = useCallback(
    (postId, comment) => {
      const psts = { ...data };
      const pst = psts.data.find(p => p.postId === postId);

      if (pst && comment) {
        pst.comments.quantity = pst.comments.quantity + 1;

        pst.comments.comments.push({
          name: authContext.name,
          userId: authContext.userId,
          profile: authContext.profile,
          comment: comment
        });
      }

      getData(psts);
    },
    [data, authContext.userId, authContext.name, authContext.profile, getData]
  );

  const follow = useCallback(
    (userInfo, followType, isFollowers) => {
      if (Object.getOwnPropertyNames(post).length !== 0) {
        changePost({
          userId: userInfo.uId,
          followType,
          isFollowers,
          action: "FOLLOW"
        });
      }

      const psts = { ...data };
      const likes = psts.data.map(p => p.likes.likes).flat();
      const userInSug = psts.suggestions.find(u => u.userId === userInfo.uId);

      if (userInfo.uId && !followType) {
        if (userInSug) {
          userInSug["isFollowing"] = true;
        }

        if (likes.length > 0) {
          likes.forEach(user => {
            if (user.userId === userInfo.uId) {
              user.isFollowing = true;
            }
          });
        }
      }

      if (userInfo.uId && followType) {
        if (likes.length > 0) {
          likes.forEach(user => {
            if (user.userId === userInfo.uId) {
              user.isFollowing = false;
            }
          });
        }

        if (userInSug) {
          userInSug["isFollowing"] = false;
        }
      }

      getData(psts);
    },
    [data, changePost, post, getData]
  );

  return (
    <React.Fragment>
      <Err />

      <BackDrop
        isActive={
          (modalContext.isActive || isActive) && modalContext.error.length === 0
        }
        onClick={() => modalContext.hideModal() || hidePost()}
      />

      {Object.getOwnPropertyNames(post).length !== 0 && (
        <Modal
          isActive={
            modalContext.isActive && modalContext.header === "Likes" && isActive
          }
          header={modalContext.header}
          zIndex={isActive && "600"}
        >
          <Ul>
            <LikesList
              likes={post.post.likes.likes}
              followHandler={followHandler}
              navigateToProfile={navigateToProfile}
              follow={follow}
              isLoading={isLoading}
            />
          </Ul>
        </Modal>
      )}

      <Post
        isActive={isActive}
        onClick={() => hidePost()}
        spinner={<Spinner isLoading={isLoading} />}
        navigateToProfile={navigateToProfile}
        likeHandler={likeHandler}
        savePostHandler={savePostHandler}
        post={post.post && post.post}
        addComment={addComment}
        like={like}
        savePost={savePost}
        addComnt={addComnt}
        follow={follow}
      />

      <Section className="section">
        {data.data && (
          <PostsList
            isLoading={isLoading}
            postsList={data.data}
            navigateToProfile={navigateToProfile}
            getPost={getPost}
            likeHandler={likeHandler}
            savePostHandler={savePostHandler}
            addComment={addComment}
            followHandler={followHandler}
            follow={follow}
            like={like}
            savePost={savePost}
            addComnt={addComnt}
          />
        )}

        {data.suggestions && data.user && (
          <Aside
            user={data.user}
            suggestions={data.suggestions}
            navigateToProfile={navigateToProfile}
            followHandler={followHandler}
            follow={follow}
            isLoading={isLoading}
          />
        )}

        <Spinner
          isLoading={isLoading && Object.getOwnPropertyNames(data).length === 0}
        />
      </Section>
    </React.Fragment>
  );
};

export default Posts;
