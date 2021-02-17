import React from "react";

import FollowItem from "../../../shared/UI/Follow-Item/Follow-Item";
import Ul from "../../../shared/UI/Ul/Ul";

import "./Suggested-List.css";

const SuggestedList = props => {
  return (
    <Ul>
      {props.suggestedList.map((suggestedUser, index) => (
        <FollowItem
          key={index}
          name={suggestedUser.name}
          profile={suggestedUser.profile}
          userId={suggestedUser.userId}
          isFollowing={suggestedUser.isFollowing}
          followHandler={props.followHandler}
          navigateToProfile={props.navigateToProfile}
          follow={props.follow}
          isLoading={props.isLoading}
        />
      ))}
    </Ul>
  );
};

export default SuggestedList;
