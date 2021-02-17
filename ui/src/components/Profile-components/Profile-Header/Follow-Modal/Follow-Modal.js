import React, { useContext } from "react";
import { useParams } from "react-router-dom";

import { ModalContext } from "../../../../shared/context/Modal/Modal-context";
import Modal from "../../../../shared/UI/Modal/Modal";
import Ul from "../../../../shared/UI/Ul/Ul";
import FollowItem from "../../../../shared/UI/Follow-Item/Follow-Item";
import P from "../../../../shared/UI/P/P";
import { AuthContext } from "../../../../shared/context/Auth/Auth-context";
import BackDrop from "../../../../shared/UI/Back-Drop/Back-Drop";
import { ProfileContext } from "../../../../shared/context/Profile/Profile-context";

const FollowersModal = props => {
  const modalContext = useContext(ModalContext);
  const authContext = useContext(AuthContext);
  const { profile, getProfile } = useContext(ProfileContext);
  const { userId } = useParams();

  return (
    <React.Fragment>
      <BackDrop
        isActive={
          modalContext.isActive && modalContext.header !== "An error ocurred"
        }
        onClick={() =>
          modalContext.hideModal(() => {
            if (profile.following.length === 0) {
              return;
            }

            const following = profile.following;
            let usersInFollowing = [];

            if (following.length > 0) {
              usersInFollowing = following.filter(
                user => user["isFollowing"] === false
              );
            }

            if (usersInFollowing.length > 0) {
              profile.user.following =
                profile.user.following - usersInFollowing.length;

              for (let user of usersInFollowing) {
                usersInFollowing = following.filter(
                  u => user["isFollowing"] !== u["isFollowing"]
                );
              }

              getProfile({
                ...profile,
                following: [...usersInFollowing]
              });

              usersInFollowing = [];
            }
          })
        }
      />

      <Modal
        isActive={
          modalContext.isActive &&
          (modalContext.header === "followers" ||
            modalContext.header === "following")
        }
        header={modalContext.header}
      >
        {props.fllw.length > 0 ? (
          <Ul className="modal__content__info__list">
            {props.fllw.map((follow, index) => (
              <FollowItem
                key={index}
                name={follow.name}
                userId={follow.userId}
                profile={follow.profile}
                isFollowing={follow.isFollowing}
                followHandler={props.followHandler}
                isFollowers={props.followers && props.isFollowers}
                navigateToProfile={props.navigateToProfile}
                follow={props.follow}
                isLoading={props.isLoading}
              />
            ))}
          </Ul>
        ) : (
          <P className="weight center">
            {authContext.userId === userId
              ? `you don't have any ${
                  props.followers ? "followers" : "following"
                }`
              : `the user doesn't have any ${
                  props.followers ? "followers" : "following"
                }`}
          </P>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default FollowersModal;
