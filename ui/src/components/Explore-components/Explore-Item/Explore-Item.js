import React from "react";

import Li from "../../../shared/UI/Li/Li";
import Wrapper from "../../../shared/UI/Wrapper/Wrapper";
import Img from "../../../shared/UI/Img/Img";

import "./Explore-Item.css";

const ExploreItem = props => {
  return (
    <Li className="explore-item">
      <Wrapper className="explore-item__content">
        {props.photoItems.map((item, index) => (
          <Wrapper key={index} onClick={props.onClick.bind(this, item.postId)}>
            <Img src={`https://ins-app-clone.herokuapp.com/${item.image}`} />
          </Wrapper>
        ))}
      </Wrapper>
    </Li>
  );
};

export default ExploreItem;
