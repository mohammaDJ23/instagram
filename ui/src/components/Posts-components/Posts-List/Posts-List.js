import React, { memo } from "react";

import PostItem from "../Post-Item/Post-Item";
import Wrapper from "../../../shared/UI/Wrapper/Wrapper";
import Ul from "../../../shared/UI/Ul/Ul";

import "./Posts-List.css";

const PostsList = memo(props => {
  return (
    <Wrapper className="posts-list">
      {props.postsList.length > 0 ? (
        <Ul>
          {props.postsList.map((post, index) => (
            <PostItem
              key={index}
              image={post.image}
              profile={post.profile}
              name={post.name}
              userId={post.userId}
              postId={post.postId}
              location={post.location}
              likes={post.likes}
              isSaved={post.isSaved}
              comments={post.comments}
              description={post.description}
              createdAt={post.createdAt}
              navigateToProfile={props.navigateToProfile}
              getPost={props.getPost}
              likeHandler={props.likeHandler}
              savePostHandler={props.savePostHandler}
              addComment={props.addComment}
              followHandler={props.followHandler}
              follow={props.follow}
              like={props.like}
              savePost={props.savePost}
              addComnt={props.addComnt}
              isLoading={props.isLoading}
            />
          ))}
        </Ul>
      ) : (
        <h2 className="center">You have't any posts</h2>
      )}
    </Wrapper>
  );
});

export default PostsList;
