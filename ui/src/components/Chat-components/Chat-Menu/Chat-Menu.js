import React, { memo } from "react";

import Aside from "../../../shared/UI/Aside/Aside";
import Ul from "../../../shared/UI/Ul/Ul";
import Wrapper from "../../../shared/UI/Wrapper/Wrapper";
import User from "./User/User";
import Input from "../../../shared/UI/Input/Input";
import Spinner from "../../../shared/UI/Spinner/Spinner";

import "./Chat-Menu.css";

const ChatMenu = memo(props => {
  return (
    <Aside className="chat-menu">
      <Wrapper className="chat-menu__content">
        <Wrapper className="chat-menu__content__search">
          <Input
            id="search"
            placeholder="Find user..."
            type="text"
            element="input"
            searchUsers={props.searchUsersHandler}
            isNav={true}
            onInput={() => {}}
            validators={[]}
          />
        </Wrapper>

        {props.users.length > 0 ? (
          <Ul className="chat-menu__content__list">
            {props.users.map((user, index) => (
              <User
                key={index}
                isActive={user.isActive}
                profile={user.profile}
                name={user.name}
                userId={user.userId}
                startChat={props.startChat}
              />
            ))}
          </Ul>
        ) : (
          !props.isLoading &&
          props.showEmpty && (
            <h3 className="black center weight">There is no user for chat.</h3>
          )
        )}
      </Wrapper>

      <Spinner
        width="3rem"
        height="3rem"
        isLoading={
          props.isLoading && props.users.length === 0 && !props.showEmpty
        }
      />
    </Aside>
  );
});

export default ChatMenu;
