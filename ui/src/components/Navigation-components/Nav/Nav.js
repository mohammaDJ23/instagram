import React, { useEffect, useRef, useContext } from "react";
import { Link, NavLink } from "react-router-dom";

import Img from "../../../shared/UI/Img/Img";
import Input from "../../../shared/UI/Input/Input";
import Wrapper from "../../../shared/UI/Wrapper/Wrapper";
import Span from "../../../shared/UI/Span/Span";
import LikedList from "../Liked-List/Liked-List";
import NavigateProfile from "../Navigate-Profile/Navigate-Profile";
import { useNav } from "../../../shared/hooks/Nav/Nav-hook";
import { AuthContext } from "../../../shared/context/Auth/Auth-context";
import ShowUsers from "../../../shared/UI/Show-Users/Show-Users";
import profile from "../../../assets/images/profile.png";
import { useHttp } from "../../../shared/hooks/http/http-hook";

import "./Nav.css";

const addEventListener = func => {
  return document.addEventListener("click", func);
};

const removeEventListener = func => {
  return document.removeEventListener("click", func);
};

const Nav = () => {
  const authContext = useContext(AuthContext);

  const [
    isLoading,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    searchUsersHandler,
    val,
    users,
    navigateToProfile
  ] = useHttp();

  const [
    state,
    showLikesHandler,
    hideLikesHandler,
    showNavigateProfileHandler,
    hideWrappers
  ] = useNav({
    showLikes: false,
    showNavigateProfile: false
  });

  const likedMenu = useRef();
  const likeIcon = useRef();
  const profileIcon = useRef();
  const profileMenu = useRef();
  const isLogin = authContext.isLogin && authContext.isLogin;

  useEffect(() => {
    const hideLikesMenu = e => {
      if (isLogin && state.showLikes) {
        hideWrappers(e, likeIcon, likedMenu, "SHOW_LIKES");
      }
    };

    addEventListener(hideLikesMenu);
    return () => removeEventListener(hideLikesMenu);
  }, [state.showLikes, likedMenu, likeIcon, hideWrappers, isLogin]);

  useEffect(() => {
    const hideProfileMenu = e => {
      if (isLogin && state.showNavigateProfile) {
        hideWrappers(e, profileIcon, profileMenu, "SHOW_NAVIGATE_PROFILE");
      }
    };

    addEventListener(hideProfileMenu);
    return () => removeEventListener(hideProfileMenu);
  }, [state.showNavigateProfile, profileIcon, profileMenu, hideWrappers, isLogin]);

  return (
    <React.Fragment>
      <NavigateProfile
        showNavigateProfile={state.showNavigateProfile}
        isElement={profileMenu}
        onClick={showNavigateProfileHandler}
        navigateToProfile={navigateToProfile}
      />

      <LikedList
        showLikes={state.showLikes && authContext.isLogin}
        onClick={hideLikesHandler}
        isElement={likedMenu}
      />

      <nav className="nav white">
        <Wrapper className="nav__content">
          <Wrapper className="nav__content__logo">
            <h2>
              <Link to="/">Instagram</Link>
            </h2>
          </Wrapper>

          {authContext.isLogin && (
            <React.Fragment>
              <Wrapper className="nav__content__input">
                <Span className="nav__content__input__search">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="10"
                    height="10"
                    viewBox="0 0 226 226"
                  >
                    <g>
                      <path d="M0,226v-226h226v226z" fill="none"></path>

                      <g fill="#95A5A6">
                        <path d="M94.92,13.56c-42.39266,0 -76.84,34.44734 -76.84,76.84c0,42.39266 34.44734,76.84 76.84,76.84c16.77344,0 32.27563,-5.40281 44.9175,-14.54875l59.46625,59.325l12.7125,-12.7125l-58.76,-58.90125c11.54719,-13.45406 18.50375,-30.91609 18.50375,-50.0025c0,-42.39266 -34.44734,-76.84 -76.84,-76.84zM94.92,22.6c37.50188,0 67.8,30.29812 67.8,67.8c0,37.50188 -30.29812,67.8 -67.8,67.8c-37.50187,0 -67.8,-30.29812 -67.8,-67.8c0,-37.50187 30.29813,-67.8 67.8,-67.8z"></path>
                      </g>
                    </g>
                  </svg>
                </Span>

                <Input
                  id="search"
                  element="input"
                  type="input"
                  className="nav__input"
                  placeholder="Search"
                  search="search"
                  isNav={true}
                  onInput={() => {}}
                  searchUsers={searchUsersHandler}
                  validators={[]}
                />
              </Wrapper>

              <Wrapper className="nav__content__iconts">
                <Wrapper className="nav__content__iconts__icon">
                  <NavLink to="/" exact>
                    <svg
                      aria-label="Home"
                      height="22"
                      viewBox="0 0 48 48"
                      width="22"
                    >
                      <path d="M45.3 48H30c-.8 0-1.5-.7-1.5-1.5V34.2c0-2.6-2-4.6-4.6-4.6s-4.6 2-4.6 4.6v12.3c0 .8-.7 1.5-1.5 1.5H2.5c-.8 0-1.5-.7-1.5-1.5V23c0-.4.2-.8.4-1.1L22.9.4c.6-.6 1.5-.6 2.1 0l21.5 21.5c.4.4.6 1.1.3 1.6 0 .1-.1.1-.1.2v22.8c.1.8-.6 1.5-1.4 1.5zm-13.8-3h12.3V23.4L24 3.6l-20 20V45h12.3V34.2c0-4.3 3.3-7.6 7.6-7.6s7.6 3.3 7.6 7.6V45z"></path>
                    </svg>
                  </NavLink>
                </Wrapper>

                <Wrapper className="nav__content__iconts__icon">
                  <NavLink to="/chat">
                    <svg
                      aria-label="Direct"
                      height="22"
                      viewBox="0 0 48 48"
                      width="22"
                    >
                      <path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"></path>
                    </svg>
                  </NavLink>
                </Wrapper>

                <Wrapper className="nav__content__iconts__icon">
                  <NavLink to="/explore">
                    <svg
                      aria-label="Find People"
                      height="22"
                      viewBox="0 0 48 48"
                      width="22"
                    >
                      <path d="M24 0C10.8 0 0 10.8 0 24s10.8 24 24 24 24-10.8 24-24S37.2 0 24 0zm0 45C12.4 45 3 35.6 3 24S12.4 3 24 3s21 9.4 21 21-9.4 21-21 21zm10.2-33.2l-14.8 7c-.3.1-.6.4-.7.7l-7 14.8c-.3.6-.2 1.3.3 1.7.3.3.7.4 1.1.4.2 0 .4 0 .6-.1l14.8-7c.3-.1.6-.4.7-.7l7-14.8c.3-.6.2-1.3-.3-1.7-.4-.5-1.1-.6-1.7-.3zm-7.4 15l-5.5-5.5 10.5-5-5 10.5z"></path>
                    </svg>
                  </NavLink>
                </Wrapper>

                <Wrapper
                  className="nav__content__iconts__icon"
                  onClick={showLikesHandler}
                  ref={likeIcon}
                >
                  <svg
                    aria-label="Activity Feed"
                    height="22"
                    viewBox="0 0 48 48"
                    width="22"
                  >
                    <path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                  </svg>
                </Wrapper>

                <Wrapper
                  className="nav__content__iconts__profile"
                  onClick={showNavigateProfileHandler}
                  ref={profileIcon}
                >
                  <Span>
                    <Img
                      src={
                        authContext.profile
                          ? `https://ins-app-clone.herokuapp.com/${authContext.profile}`
                          : profile
                      }
                      alt="profile"
                    />
                  </Span>
                </Wrapper>
              </Wrapper>
            </React.Fragment>
          )}
        </Wrapper>
      </nav>

      {val.length >= 1 && (
        <ShowUsers
          isNav={true}
          users={users}
          navigateToProfile={navigateToProfile}
          isLoading={isLoading}
        />
      )}
    </React.Fragment>
  );
};

export default Nav;
