import React, { memo } from "react";
import { Link } from "react-router-dom";

import Img from "../../../shared/UI/Img/Img";
import P from "../../../shared/UI/P/P";
import Wrapper from "../../../shared/UI/Wrapper/Wrapper";
import SuggestionsList from "./Suggestions-List/Suggestions-List";
import Aside from "../../../shared/UI/Aside/Aside";
import profile from "../../../assets/images/profile.png";

import "./Aside.css";

const AsideBar = memo(props => {
  return (
    <Aside className="aside">
      <Wrapper className="aside__content">
        <Wrapper className="aside__content__profile">
          <Wrapper>
            <Link to="" onClick={e => props.navigateToProfile(e)}>
              <Img
                src={
                  props.user.profile
                    ? `https://ins-app-clone.herokuapp.com/${props.user.profile}`
                    : profile
                }
                alt={props.user.name}
              />
            </Link>
          </Wrapper>

          <Wrapper>
            <h4 className="black weight">
              <Link
                to=""
                className="black"
                onClick={e => props.navigateToProfile(e)}
              >
                {props.user.name}
              </Link>
            </h4>

            <P className="gray">{props.user.fullName}</P>
          </Wrapper>
        </Wrapper>

        <Wrapper className="aside__content__suggesstions">
          <Wrapper className="aside__content__suggesstions__see-all">
            <h4 className="gray">Suggesstions For You</h4>

            <P>
              <Link to="/suggested" className="black">
                See All
              </Link>
            </P>
          </Wrapper>

          <SuggestionsList
            suggestions={props.suggestions}
            followHandler={props.followHandler}
            navigateToProfile={props.navigateToProfile}
            follow={props.follow}
            isLoading={props.isLoading}
          />
        </Wrapper>
      </Wrapper>
    </Aside>
  );
});

export default AsideBar;
