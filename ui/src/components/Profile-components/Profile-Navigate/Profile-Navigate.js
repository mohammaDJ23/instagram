import React, { memo, useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../../shared/context/Auth/Auth-context";
import P from "../../../shared/UI/P/P";
import Wrapper from "../../../shared/UI/Wrapper/Wrapper";

import "./Profile-Navigate.css";

const ProfileNavigate = memo(props => {
  const authContext = useContext(AuthContext);

  return (
    <Wrapper className="profile-navigate">
      <Wrapper className="profile-navigate__content">
        <Wrapper className="profile-navigate__content__icon">
          <NavLink
            className="gray profile-navigate__content__icon__navigate"
            to={`/${props.userId}/profile/posts`}
          >
            <Wrapper>
              <svg
                aria-label="Posts"
                fill="#8e8e8e"
                height="12"
                viewBox="0 0 48 48"
                width="12"
              >
                <path d="M45 1.5H3c-.8 0-1.5.7-1.5 1.5v42c0 .8.7 1.5 1.5 1.5h42c.8 0 1.5-.7 1.5-1.5V3c0-.8-.7-1.5-1.5-1.5zm-40.5 3h11v11h-11v-11zm0 14h11v11h-11v-11zm11 25h-11v-11h11v11zm14 0h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11zm14 28h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11z"></path>
              </svg>
            </Wrapper>

            <Wrapper>
              <P>POSTS</P>
            </Wrapper>
          </NavLink>
        </Wrapper>

        {authContext.userId === props.userId && (
          <Wrapper className="profile-navigate__content__icon">
            <NavLink
              className="gray profile-navigate__content__icon__navigate"
              to={`/${props.userId}/profile/saved`}
            >
              <Wrapper>
                <svg
                  aria-label="Saved"
                  fill="#8e8e8e"
                  height="12"
                  viewBox="0 0 48 48"
                  width="12"
                >
                  <path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"></path>
                </svg>
              </Wrapper>

              <Wrapper>
                <P>SAVED</P>
              </Wrapper>
            </NavLink>
          </Wrapper>
        )}
      </Wrapper>
    </Wrapper>
  );
});

export default ProfileNavigate;
