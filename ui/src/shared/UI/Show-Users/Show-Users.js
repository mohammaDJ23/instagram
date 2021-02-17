import React, { memo } from "react";

import Wrapper from "../Wrapper/Wrapper";
import ShowUsersItem from "./Show-Users-Item/Show-Users-Item";
import Ul from "../Ul/Ul";
import Spinner from "../Spinner/Spinner";

import "./Show-Users.css";

const ShowUsers = memo(props => {
  return (
    <Wrapper
      className={`chat-menu__content__show-users background-border ${
        props.isChat && "is-chat"
      } ${props.isNav && "is-nav"}`}
    >
      {!props.isLoading && props.users.length > 0 ? (
        <Ul className="show-users-item_list">
          {props.users.map((item, index) => (
            <ShowUsersItem
              key={index}
              name={item.name}
              userId={item.userId}
              profile={item.profile}
              navigateToProfile={props.navigateToProfile}
              startChat={props.startChat}
            />
          ))}
        </Ul>
      ) : (
        !props.isLoading && <h3 className="center">no useres found!</h3>
      )}

      <Spinner
        width="2rem"
        height="2rem"
        margin="80px auto"
        isLoading={props.isLoading}
      />
    </Wrapper>
  );
});

export default ShowUsers;
