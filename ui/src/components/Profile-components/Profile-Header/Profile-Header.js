import React, { memo, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import Wrapper from "../../../shared/UI/Wrapper/Wrapper";
import Img from "../../../shared/UI/Img/Img";
import Button from "../../../shared/UI/Button/Button";
import Span from "../../../shared/UI/Span/Span";
import P from "../../../shared/UI/P/P";
import Ul from "../../../shared//UI/Ul/Ul";
import Li from "../../../shared/UI/Li/Li";
import { useProfileHeader } from "../../../shared/hooks/Profile-Header/Profile-Header";
import { ModalContext } from "../../../shared/context/Modal/Modal-context";
import FollowModal from "./Follow-Modal/Follow-Modal";
import { AuthContext } from "../../../shared/context/Auth/Auth-context";
import prof from "../../../assets/images/profile.png";
import Spinner from "../../../shared/UI/Spinner/Spinner";
import { ProfileContext } from "../../../shared/context/Profile/Profile-context";

import "./Profile-Header.css";

const ProfileHeader = memo(props => {
  const [isFollowing, setIsFollowing] = useState(true);
  const [uId, setUId] = useState("");
  const [showWrappers, showHandler] = useProfileHeader(false);
  const modalContext = useContext(ModalContext);
  const authContext = useContext(AuthContext);
  const { profile, getProfile } = useContext(ProfileContext);
  const history = useHistory();
  const { userId } = useParams();

  useEffect(() => {
    showHandler();
  }, [showHandler]);

  useEffect(() => {
    const eventHandler = () => showHandler();
    window.addEventListener("resize", eventHandler);
    return () => window.removeEventListener("resize", eventHandler);
  }, [showWrappers, showHandler]);

  const navigateToCreatePostHandler = () => {
    history.push(`/${authContext.userId}/create-post`);
  };

  const navigateToEditProfileHandler = () => {
    history.push(`/${authContext.userId}/edit-profile`);
  };

  const followerHandler = () => {
    modalContext.showModal("followers");
    setIsFollowing(false);
  };

  const followingHandler = () => {
    modalContext.showModal("following", null, () => {
      if (profile.following.length === 0) {
        return;
      }

      const following = profile.following.filter(user => user["isFollowing"] !== false);

      if (following.length > 0) {
        profile.user.following =
          profile.user.following -
          profile.following.filter(user => user["isFollowing"] === false).length;

        getProfile({
          ...profile,
          following: [...following]
        });
      }
    });

    setIsFollowing(true);
  };

  const followHandler = async () => {
    setUId(props.user.userId);

    try {
      await props.followHandler(
        {
          uId: props.user.userId,
          image: props.user.profile,
          name: props.user.name
        },
        props.isFollowing,
        false,
        (userInfo, followType, isFollowers) => {
          setUId("");
          props.follow && props.follow(userInfo, followType, isFollowers);
        }
      );
    } catch (error) {}
  };

  const followers = (
    <Wrapper
      className={`${!showWrappers && "profile-header__content__inside__profile-info__follwers"} ${
        showWrappers && "profile-header__content__profile-info__follwers"
      }`}
    >
      <Ul>
        <Li>
          <Span>
            <Span className="weight">{props.user.posts}</Span> posts
          </Span>
        </Li>

        <Li>
          <Span onClick={followerHandler}>
            <Span className="weight">{props.user.followers}</Span> followers
          </Span>
        </Li>

        <Li>
          <Span onClick={followingHandler}>
            <Span className="weight">{props.user.following}</Span> following
          </Span>
        </Li>
      </Ul>
    </Wrapper>
  );

  const description = (
    <Wrapper
      className={`${
        !showWrappers && "profile-header__content__inside__profile-info__description"
      } ${showWrappers && "profile-header__content__profile-info__description"}`}
    >
      <Wrapper>
        <h3>{props.user.fullName}</h3>
      </Wrapper>

      <Wrapper>
        <P>{props.user.description}</P>
      </Wrapper>
    </Wrapper>
  );

  return (
    <React.Fragment>
      {modalContext.error.length === 0 && (
        <React.Fragment>
          {!isFollowing && (
            <FollowModal
              followers={true}
              fllw={props.followers}
              setProfile={props.setProfile}
              navigateToProfile={props.navigateToProfile}
              followHandler={props.followHandler}
              spinner={<Spinner isLoading={props.isLoading} />}
              isFollowers={authContext.userId !== userId ? false : true}
              follow={props.follow}
              isLoading={props.isLoading}
            />
          )}

          {isFollowing && (
            <FollowModal
              following={true}
              fllw={props.following}
              setProfile={props.setProfile}
              navigateToProfile={props.navigateToProfile}
              followHandler={props.followHandler}
              spinner={<Spinner isLoading={props.isLoading} />}
              follow={props.follow}
              isLoading={props.isLoading}
            />
          )}
        </React.Fragment>
      )}

      <header className="profile-header">
        <Wrapper className="profile-header__content">
          <Wrapper className="profile-header__content__inside">
            <Wrapper className="profile-header__contnet__inside__img-wrapper">
              <Wrapper>
                <Img
                  src={
                    props.user.profile
                      ? `https://ins-app-clone.herokuapp.com/${props.user.profile}`
                      : prof
                  }
                  alt={props.user.name}
                />
              </Wrapper>
            </Wrapper>

            <Wrapper className="profile-header__content__inside__profile-info">
              <Wrapper className="profile-header__content__inside__profile-info__name">
                <Wrapper>
                  <h2>{props.user.name}</h2>
                </Wrapper>

                <Wrapper>
                  {authContext.userId !== userId && (
                    <React.Fragment>
                      <Button
                        className={`${props.isFollowing ? "btn-white" : "btn-blue"}`}
                        onClick={followHandler}
                        disabled={props.isLoading && uId === props.user.userId}
                        isLoading={props.isLoading && uId === props.user.userId}
                      >
                        {props.isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                    </React.Fragment>
                  )}

                  {authContext.userId === userId && (
                    <React.Fragment>
                      <Button className="weight btn-edit" onClick={navigateToEditProfileHandler}>
                        Edit Profile
                      </Button>

                      <Button className="weight btn-create" onClick={navigateToCreatePostHandler}>
                        Create Post
                      </Button>
                    </React.Fragment>
                  )}
                </Wrapper>
              </Wrapper>

              {!showWrappers && followers}
              {!showWrappers && description}
            </Wrapper>
          </Wrapper>

          {showWrappers && description}
          {showWrappers && followers}
        </Wrapper>
      </header>
    </React.Fragment>
  );
});

export default ProfileHeader;
