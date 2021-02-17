import React, { memo } from "react";

import FollowItem from "../../../shared/UI/Follow-Item/Follow-Item";

const LikesList = memo(props => {
  return props.likes.map((item, index) => (
    <FollowItem
      key={index}
      name={item.name}
      userId={item.userId}
      profile={item.profile}
      isFollowing={item.isFollowing}
      followHandler={props.followHandler}
      navigateToProfile={props.navigateToProfile}
      follow={props.follow}
      postId={props.postId}
      isLoading={props.isLoading}
    />
  ));
});

export default LikesList;
