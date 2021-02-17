import React, { useEffect, useContext, useState } from "react";
import ReactDom from "react-dom";

import Wrapper from "../../../shared/UI/Wrapper/Wrapper";
import Ul from "../../../shared/UI/Ul/Ul";
import { AuthContext } from "../../../shared/context/Auth/Auth-context";
import { useHttp } from "../../../shared/hooks/http/http-hook";
import Spinner from "../../../shared/UI/Spinner/Spinner";
import FollowItem from "../../../shared/UI/Follow-Item/Follow-Item";
import { ProfileContext } from "../../../shared/context/Profile/Profile-context";
import { PostContext } from "../../../shared/context/Post/Post-Context";

import "./Liked-List.css";

const LikedList = props => {
  const [notice, setNotice] = useState({});
  const authContext = useContext(AuthContext);
  const { psts, getPsts } = useContext(PostContext);
  const { profile, getProfile, userId } = useContext(ProfileContext);

  const [
    isLoading,
    transitionData,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    navigateToProfile,
    followHandler
  ] = useHttp();

  useEffect(() => {
    setNotice({});

    if (props.showLikes && authContext.isLogin) {
      const getNotice = async () => {
        try {
          const responseData = await transitionData(
            `https://ins-app-clone.herokuapp.com/user/${authContext.userId}/notice`
          );

          setNotice(responseData);
        } catch (error) {}
      };

      getNotice();
    }
  }, [transitionData, authContext.isLogin, authContext.userId, props.showLikes]);

  const follow = (userInfo, followType, isFollowers) => {
    const ntc = { ...notice };
    const posts = { ...psts };
    const prf = { ...profile };
    const user = ntc.users.find(user => user.userId === userInfo.uId);

    if (user && followType && !isFollowers) {
      user.isFollowing = false;
    }

    if (user && !followType && !isFollowers) {
      user.isFollowing = true;
    }

    if (Object.getOwnPropertyNames(posts).length !== 0) {
      posts.data.forEach(post => {
        post.likes.likes.forEach(user => {
          if (user.userId === userInfo.uId && followType && !isFollowers) {
            user.isFollowing = false;
          }

          if (user.userId === userInfo.uId && !followType && !isFollowers) {
            user.isFollowing = true;
          }
        });
      });
    }

    if (Object.getOwnPropertyNames(prf).length !== 0) {
      const userInFollowers = prf.followers.findIndex(
        user => user.userId === userInfo.uId
      );

      const userInFollowing = prf.following.findIndex(
        user => user.userId === userInfo.uId
      );

      const user = [...prf.followers, ...prf.following];

      if (!followType && !isFollowers) {
        user.forEach(user => {
          if (user.userId === userInfo.uId && user.userId !== userId) {
            user.isFollowing = true;
          }
        });

        if (userInfo.uId === userId) {
          prf.isFollowing = true;

          if (userInFollowers === -1) {
            prf.followers.push({
              name: authContext.name,
              profile: authContext.profile,
              userId: authContext.userId
            });

            prf.user.followers = prf.user.followers + 1;
          }
        }

        if (userInfo.uId !== userId && authContext.userId === userId) {
          if (userInFollowing === -1) {
            prf.following.push({
              userId: userInfo.uId,
              profile: userInfo.image,
              name: userInfo.name,
              isFollowing: true
            });

            prf.user.following = prf.user.following + 1;
          }
        }
      }

      if (followType && !isFollowers) {
        user.forEach(user => {
          if (user.userId === userInfo.uId && user.userId !== userId) {
            user.isFollowing = false;
          }
        });

        if (userInfo.uId === userId) {
          prf.isFollowing = false;

          const user = prf.followers.findIndex(
            user => user.userId === authContext.userId
          );

          if (user > -1) {
            prf.followers.splice(user, 1);
            prf.user.followers = prf.user.followers - 1;
          }
        }

        if (userInfo.uId !== userId && authContext.userId === userId) {
          if (userInFollowing > -1) {
            prf.following.splice(userInFollowing, 1);
            prf.user.following = prf.user.following - 1;
          }
        }
      }
    }

    setNotice(ntc);
    getPsts(posts);
    getProfile(prf);
  };

  const likedList = (
    <Wrapper className="liked-list white" ref={props.isElement}>
      {notice.users ? (
        notice.users.length > 0 ? (
          <Ul>
            {notice.users.map((item, index) => (
              <FollowItem
                key={index}
                profile={item.profile}
                name={item.name}
                userId={item.userId}
                hideNotice={props.onClick}
                isFollowing={item.isFollowing}
                followHandler={followHandler}
                navigateToProfile={navigateToProfile}
                follow={follow}
                isLoading={isLoading}
              />
            ))}
          </Ul>
        ) : (
          <h4 className="center weight">you don't have any notice</h4>
        )
      ) : (
        <Spinner
          isLoading={isLoading}
          width="3rem"
          height="3rem"
          margin="135px auto"
        />
      )}
    </Wrapper>
  );

  return ReactDom.createPortal(
    props.showLikes && likedList,
    document.getElementById("likes")
  );
};

export default LikedList;
