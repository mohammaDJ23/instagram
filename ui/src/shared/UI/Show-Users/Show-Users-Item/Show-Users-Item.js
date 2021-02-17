import React from "react";

import Li from "../../Li/Li";
import Wrapper from "../../Wrapper/Wrapper";
import Img from "../../Img/Img";
import P from "../../P/P";
import profile from "../../../../assets/images/profile.png";

const ShowUsersItem = props => {
  const navigateToProfile = e => {
    props.navigateToProfile && props.navigateToProfile(e, props.userId);

    props.startChat &&
      props.startChat({
        userId: props.userId,
        name: props.name,
        profile: props.profile ? props.profile : profile,
        add: true
      });
  };

  return (
    <Li
      className="modal__content__info__list__item"
      onClick={e => navigateToProfile(e)}
    >
      <Wrapper className="modal__content__info__list__item__profile">
        <Wrapper>
          <Img
            src={
              props.profile
                ? `https://ins-app-clone.herokuapp.com/${props.profile}`
                : profile
            }
          />
        </Wrapper>

        <Wrapper>
          <P>{props.name}</P>
        </Wrapper>
      </Wrapper>
    </Li>
  );
};

export default ShowUsersItem;
