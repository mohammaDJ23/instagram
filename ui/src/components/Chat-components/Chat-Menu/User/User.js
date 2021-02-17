import React from "react";

import Img from "../../../../shared/UI/Img/Img";
import Li from "../../../../shared/UI/Li/Li";
import P from "../../../../shared/UI/P/P";
import Wrapper from "../../../../shared/UI/Wrapper/Wrapper";
import profile from "../../../../assets/images/profile.png";

import "./User.css";

const User = props => {
  const startChatHandler = uId => {
    props.startChat({ userId: uId, add: false });
  };

  return (
    <Li
      className={`user ${props.isActive && "background"}`}
      onClick={startChatHandler.bind(this, props.userId)}
    >
      <Wrapper className="user__content">
        <Wrapper className="user__content__profile">
          <Img
            src={
              props.profile
                ? `https://ins-app-clone.herokuapp.com/${props.profile}`
                : profile
            }
            alt={props.name}
          />
        </Wrapper>

        <Wrapper className="user__content__name">
          <P>{props.name}</P>
        </Wrapper>
      </Wrapper>
    </Li>
  );
};

export default User;
