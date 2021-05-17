import React, { useCallback, useContext, useEffect } from "react";
import { Switch, Route, Redirect, useParams } from "react-router-dom";

import Section from "../../shared/UI/Section/Section";
import ProfileNavigate from "../../components/Profile-components/Profile-Navigate/Profile-Navigate";
import ProfileHeader from "../../components/Profile-components/Profile-Header/Profile-Header";
import ProfilePostsList from "../../components/Profile-components/Profile-Routes/Posts/Profile-Posts-List";
import Spinner from "../../shared/UI/Spinner/Spinner";
import { useHttp } from "../../shared/hooks/http/http-hook";
import { AuthContext } from "../../shared/context/Auth/Auth-context";
import Err from "../../shared/UI/Err/Err";
import { PostContext } from "../../shared/context/Post/Post-Context";
import { ProfileContext } from "../../shared/context/Profile/Profile-context";
import { ModalContext } from "../../shared/context/Modal/Modal-context";

const isProfile = true;

const Profile = () => {
  const authContext = useContext(AuthContext);
  const { hidePost } = useContext(PostContext);
  const { hideModal } = useContext(ModalContext);

  const { profile, readedImage, getProfile, postId, getUserIdInParams } = useContext(
    ProfileContext
  );

  const { userId } = useParams();

  const [
    isLoading,
    transitionData,
    getPost,
    post,
    changePost,
    addComment,
    likeHandler,
    savePostHandler,
    ,
    ,
    ,
    navigateToProfile,
    followHandler
  ] = useHttp();

  useEffect(() => {
    if (Object.getOwnPropertyNames(profile).length === 0) {
      getUserIdInParams(userId);

      (async () => {
        try {
          const responseData = await transitionData(
            `https://ins-app-clone.herokuapp.com/user/${authContext.userId}/${userId}/profile`
          );

          getProfile(responseData);
        } catch (error) {}
      })();
    }
  }, [transitionData, userId, profile, authContext.userId, getProfile, getUserIdInParams]);

  const like = useCallback(
    (postId, likeIcon) => {
      const prf = { ...profile };
      const posts = [...prf.posts.posts, ...prf.saved.saved].flat();

      if (posts.length > 0 && likeIcon) {
        posts.forEach(post => {
          if (post.postId === postId) {
            post.likesC = post.likesC - 1;
          }
        });
      }

      if (posts.length > 0 && !likeIcon) {
        posts.forEach(post => {
          if (post.postId === postId) {
            post.likesC = post.likesC + 1;
          }
        });
      }

      getProfile(prf);
    },
    [profile, getProfile]
  );

  const savePost = useCallback(
    (postId, isSaved) => {
      const prf = { ...profile };

      if (isSaved) {
        const postIndex = prf.saved.saved.findIndex(p => p.postId === postId);

        if (postIndex > -1) {
          prf.saved.saved.splice(postIndex, 1);
        }
      }

      if (!isSaved) {
        const post = prf.posts.posts.find(p => p.postId === postId);
        prf.saved.saved.push(post);
      }

      getProfile(prf);
    },
    [profile, getProfile]
  );

  const addComnt = useCallback(
    postId => {
      const prf = { ...profile };
      const posts = [...prf.posts.posts, ...prf.saved.saved].flat();

      posts.forEach(p => {
        if (p.postId === postId) {
          p.commentsC = p.commentsC + 1;
        }
      });

      getProfile(prf);
    },
    [profile, getProfile]
  );

  const follow = useCallback(
    (userInfo, followType, isFollowers) => {
      const { uId, name, image } = userInfo;

      if (Object.getOwnPropertyNames(post).length !== 0) {
        changePost({
          userId: uId,
          followType,
          isFollowers,
          action: "FOLLOW"
        });
      }

      const prf = { ...profile };
      const userInFollowers = prf.followers.find(user => user.userId === uId);
      const userInFollowing = prf.following.find(user => user.userId === uId);

      if (authContext.userId === userId) {
        const userIndexFollowing = prf.following.findIndex(u => u.userId === uId);

        if (uId && !followType && isFollowers && userInFollowers && userIndexFollowing === -1) {
          userInFollowers.isFollowing = true;
          prf.following.push(userInFollowers);
          prf.user.following = prf.user.following + 1;
        }

        if (uId && followType && isFollowers && userInFollowers && userIndexFollowing > -1) {
          userInFollowers.isFollowing = false;
          prf.following.splice(userIndexFollowing, 1);
          prf.user.following = prf.user.following - 1;
        }

        if (uId && followType && !isFollowers && userIndexFollowing > -1) {
          if (userInFollowers) userInFollowers.isFollowing = false;
          userInFollowing["isFollowing"] = false;
          getProfile(prf);
        }

        if (uId && !followType && !isFollowers && userIndexFollowing > -1) {
          if (userInFollowers) userInFollowers.isFollowing = true;
          userInFollowing["isFollowing"] = true;
        }

        if (uId && !followType && !isFollowers && userIndexFollowing === -1) {
          if (userInFollowers) userInFollowers.isFollowing = true;

          prf.following.push({
            userId: uId,
            name,
            profile: image,
            isFollowing: true
          });

          prf.user.following = prf.user.following + 1;
        }
      } else {
        if (uId && followType && !isFollowers) {
          if (userInFollowing) userInFollowing["isFollowing"] = false;
          if (userInFollowers) userInFollowers["isFollowing"] = false;
        }

        if (uId && !followType && !isFollowers) {
          if (userInFollowing) userInFollowing["isFollowing"] = true;
          if (userInFollowers) userInFollowers["isFollowing"] = true;
        }

        if (userId === uId && !followType && !isFollowers) {
          prf.isFollowing = true;

          prf.followers.push({
            name: authContext.name,
            userId: authContext.userId,
            profile: authContext.profile
          });

          prf.user.followers = prf.user.followers + 1;
        }

        if (userId === uId && followType && !isFollowers) {
          prf.isFollowing = false;

          const userIndexFollowers = prf.followers.findIndex(
            user => user.userId === authContext.userId
          );

          if (userIndexFollowers > -1) {
            prf.followers.splice(userIndexFollowers, 1);
            prf.user.followers = prf.user.followers - 1;
          }
        }
      }

      getProfile(prf);
    },
    [
      changePost,
      userId,
      post,
      profile,
      authContext.name,
      authContext.profile,
      authContext.userId,
      getProfile
    ]
  );

  const deletePostHandler = useCallback(
    async postId => {
      const prf = {
        ...profile,
        posts: {
          ...profile.posts,
          posts: [...profile.posts.posts.filter(post => post.postId !== postId)]
        },
        saved: {
          ...profile.saved,
          saved: [...profile.saved.saved.filter(post => post.postId !== postId)]
        }
      };

      getProfile(prf);
      hideModal();
      hidePost();

      try {
        await transitionData(
          `https://ins-app-clone.herokuapp.com/post/${postId}/${authContext.userId}/delete-post`,
          "DELETE"
        );
      } catch (error) {}
    },
    [profile, getProfile, hideModal, hidePost, transitionData, authContext.userId]
  );

  useEffect(() => {
    if (
      authContext.isLogin &&
      readedImage &&
      postId &&
      Object.getOwnPropertyNames(profile).length !== 0
    ) {
      const prf = { ...profile };
      const posts = [...prf.posts.posts, ...prf.saved.saved].flat();

      posts.forEach(post => {
        if (post.postId === postId) {
          post.image = readedImage;
        }
      });
    }
  }, [readedImage, postId, authContext.isLogin, profile]);

  return (
    <React.Fragment>
      <Err />

      <Section className="section">
        {profile.saved &&
        profile.posts &&
        profile.user &&
        profile.followers &&
        profile.following ? (
          <React.Fragment>
            <ProfileHeader
              user={profile.user}
              following={profile.following}
              followers={profile.followers}
              isLoading={isLoading}
              isFollowing={profile.isFollowing}
              navigateToProfile={navigateToProfile}
              followHandler={followHandler}
              follow={follow}
            />

            <ProfileNavigate userId={profile.user.userId} />

            <Section className="section">
              <Switch>
                <Route
                  path="/:userId/profile/posts"
                  render={props => (
                    <ProfilePostsList
                      {...props}
                      isPosts={true}
                      posts={profile.posts.posts}
                      post={post.post}
                      getPost={getPost}
                      navigateToProfile={navigateToProfile}
                      followHandler={followHandler}
                      likeHandler={likeHandler}
                      savePostHandler={savePostHandler}
                      isPostHide={false}
                      addComment={addComment}
                      addComnt={addComnt}
                      follow={follow}
                      isProfile={isProfile}
                      isLoading={isLoading}
                      savePost={savePost}
                      deletePostHandler={deletePostHandler}
                      like={like}
                      spinner={<Spinner isLoading={isLoading} />}
                    />
                  )}
                />

                {authContext.userId === userId && (
                  <Route
                    path="/:userId/profile/saved"
                    render={props => (
                      <ProfilePostsList
                        {...props}
                        isSaved={true}
                        saved={profile.saved.saved}
                        post={post.post}
                        getPost={getPost}
                        navigateToProfile={navigateToProfile}
                        followHandler={followHandler}
                        likeHandler={likeHandler}
                        savePostHandler={savePostHandler}
                        isPostHide={true}
                        addComment={addComment}
                        addComnt={addComnt}
                        follow={follow}
                        isProfile={isProfile}
                        isLoading={isLoading}
                        savePost={savePost}
                        deletePostHandler={deletePostHandler}
                        like={like}
                        spinner={<Spinner isLoading={isLoading} />}
                      />
                    )}
                  />
                )}

                <Redirect from="/:userId/profile" to="/:userId/profile/posts" />
                <Redirect to="/:userId/profile" />
              </Switch>
            </Section>
          </React.Fragment>
        ) : (
          <Spinner isLoading={isLoading} />
        )}
      </Section>
    </React.Fragment>
  );
};

export default Profile;
