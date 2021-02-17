import React from "react";

import Ul from "../../../../shared/UI/Ul/Ul";
import FollowItem from "../../../../shared/UI/Follow-Item/Follow-Item";

const SuggestionsList = props => {
  return props.suggestions.length > 0 ? (
    <Ul>
      {props.suggestions.map((user, index) => (
        <FollowItem
          key={index}
          profile={user.profile}
          name={user.name}
          userId={user.userId}
          isFollowing={user.isFollowing}
          followHandler={props.followHandler}
          isSuggestions={true}
          navigateToProfile={props.navigateToProfile}
          follow={props.follow}
          isLoading={props.isLoading}
        />
      ))}
    </Ul>
  ) : (
    <h4 className="center">no suggestions</h4>
  );
};

export default SuggestionsList;
