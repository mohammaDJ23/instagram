import React, { memo, useContext, useState } from "react";
import { Link } from "react-router-dom";

import { ModalContext } from "../../context/Modal/Modal-context";
import Li from "../Li/Li";
import Wrapper from "../Wrapper/Wrapper";
import Img from "../Img/Img";
import P from "../P/P";
import profile from "../../../assets/images/profile.png";
import Button from "../Button/Button";
import { PostContext } from "../../context/Post/Post-Context";

const LikesItem = memo(props => {
  const modalContext = useContext(ModalContext);
  const postContext = useContext(PostContext);
  const [isFollowing, setIsFollowing] = useState(false);

  const followHandler = async userId => {
    setIsFollowing(true);

    try {
      await props.followHandler(
        { uId: userId, image: props.profile, name: props.name },
        props.isFollowing,
        props.isFollowers && props.isFollowers,
        (userInfo, followType, isFollowers) => {
          setIsFollowing(false);
          props.follow && props.follow(userInfo, followType, isFollowers);
        }
      );
    } catch (error) {}
  };

  const navigateToProfile = e => {
    modalContext.hideModal();
    props.navigateToProfile(e, props.userId);
    postContext.isActive && postContext.hidePost();
    props.hideNotice && props.hideNotice();
  };

  return (
    <Li
      className={`modal__content__info__list__item ${
        props.isSuggestions && "modal__content__info__list__item__sug"
      }`}
    >
      <Wrapper
        className={`modal__content__info__list__item__profile ${
          props.isSuggestions && "modal__content__info__list__item__profile__sug"
        }`}
      >
        <Wrapper onClick={props.onClick && props.onClick}>
          <Link to="" onClick={e => navigateToProfile(e)}>
            <Img
              src={
                props.profile
                  ? `https://ins-app-clone.herokuapp.com/${props.profile}`
                  : profile
              }
            />
          </Link>
        </Wrapper>

        <Wrapper>
          <Link to="" onClick={e => navigateToProfile(e)}>
            <P className={`${props.isSuggestions && "weight black"}`}>
              {props.name}
            </P>

            {props.isSuggestions && <P className="gray">New on Instagram</P>}
          </Link>
        </Wrapper>
      </Wrapper>

      {props.isFollowing !== undefined && (
        <Wrapper className="modal__content__info__list__item__button">
          <Button
            type="button"
            className={`${props.isFollowing ? "btn-white" : "btn-blue"}`}
            onClick={() => followHandler(props.userId)}
            disabled={isFollowing}
            isLoading={isFollowing}
          >
            {props.isFollowing ? "unfollow" : "follow"}
          </Button>
        </Wrapper>
      )}
    </Li>
  );
});

export default LikesItem;
