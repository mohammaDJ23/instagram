import React, { memo, useContext } from "react";

import ExploreItem from "../Explore-Item/Explore-Item";
import Ul from "../../../shared/UI/Ul/Ul";
import { lists } from "../../../shared/Utils/reducer/reducer";
import BackDrop from "../../../shared/UI/Back-Drop/Back-Drop";
import Post from "../../../shared/UI/Post/Post";
import { PostContext } from "../../../shared/context/Post/Post-Context";
import { ModalContext } from "../../../shared/context/Modal/Modal-context";

import "./Explore-List.css";

const ExploreList = memo(props => {
  const postContext = useContext(PostContext);
  const modalContext = useContext(ModalContext);

  return (
    <React.Fragment>
      <BackDrop
        isActive={
          postContext.isActive && modalContext.header !== "An error occured"
        }
        onClick={() => postContext.hidePost()}
      />

      <Post
        isActive={postContext.isActive}
        post={props.post}
        spinner={props.spinner}
        navigateToProfile={props.navigateToProfile}
        likeHandler={props.likeHandler}
        savePostHandler={props.savePostHandler}
        addComment={props.addComment}
        follow={props.follow}
      />

      {props.photos.length > 0 ? (
        <Ul className="explore-list__list">
          {lists([...props.photos], 3).map((photos, index) => (
            <ExploreItem
              key={index}
              photoItems={photos}
              onClick={props.onClick}
            />
          ))}
        </Ul>
      ) : (
        <h2 className="weight black center">there are no photos in here.</h2>
      )}
    </React.Fragment>
  );
});

export default ExploreList;
