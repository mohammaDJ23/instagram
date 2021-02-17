import React, { useEffect, useContext } from "react";

import ExploreList from "../../components/Explore-components/Explore-List/Explore-List";
import { useHttp } from "../../shared/hooks/http/http-hook";
import Spinner from "../../shared/UI/Spinner/Spinner";
import Section from "../../shared/UI/Section/Section";
import { ModalContext } from "../../shared/context/Modal/Modal-context";
import Modal from "../../shared/UI/Modal/Modal";
import Ul from "../../shared/UI/Ul/Ul";
import LikesList from "../../components/Posts-components/Likes-List/Likes-List";
import Err from "../../shared/UI/Err/Err";

const Explore = () => {
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
    follow,
    getAllData,
    data,
    ,
    ,
    scrollHandler
  ] = useHttp();

  const modalContext = useContext(ModalContext);

  useEffect(() => {
    if (Object.getOwnPropertyNames(data).length === 0) {
      (async () => {
        try {
          await getAllData({ action: "explore" });
        } catch (error) {}
      })();
    }

    const scrlHandler = async e => {
      try {
        scrollHandler(e, { action: "explore" }, () => {
          removeHandler(scrlHandler);
        });
      } catch (error) {}
    };

    window.addEventListener("scroll", scrlHandler);
    return () => removeHandler(scrlHandler);
  }, [data, getAllData, scrollHandler]);

  const removeHandler = scrollHandler => {
    return window.removeEventListener("scroll", scrollHandler);
  };

  return (
    <React.Fragment>
      <Err />

      {post.post && (
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
      )}

      <Section className="section">
        {Object.getOwnPropertyNames(data).length !== 0 ? (
          <ExploreList
            photos={data.data}
            isLoading={isLoading}
            onClick={getPost}
            post={post.post}
            navigateToProfile={navigateToProfile}
            likeHandler={likeHandler}
            savePostHandler={savePostHandler}
            addComment={addComment}
            follow={follow}
            spinner={<Spinner isLoading={isLoading} />}
          />
        ) : (
          <Spinner isLoading={isLoading} />
        )}
      </Section>
    </React.Fragment>
  );
};

export default Explore;
