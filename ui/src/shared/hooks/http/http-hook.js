import { useCallback, useContext, useRef, useState, useEffect } from "react";

import { ModalContext } from "../../context/Modal/Modal-context";
import { AuthContext } from "../../context/Auth/Auth-context";
import { useHistory } from "react-router-dom";
import { ProfileContext } from "../../context/Profile/Profile-context";
import { PostContext } from "../../context/Post/Post-Context";

const PHOTO_PER_SCROLL = 15;
const POSTS_PER_SCROLL = 6;

export const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [val, setValue] = useState("");
  const [users, setUsers] = useState([]);
  const [post, setPost] = useState({});
  const [data, setData] = useState({});
  const [isEmpty, setIsEmpty] = useState(false);
  const { err } = useContext(ModalContext);
  const authContext = useContext(AuthContext);
  const { navigateToProfile } = useContext(ProfileContext);
  const { showPost, isActive, hidePost } = useContext(PostContext);
  const activeHttpRequest = useRef([]);
  const history = useHistory();
  const scrl = useRef(1);

  const transitionData = useCallback(
    async (
      url,
      method = "GET",
      body = null,
      headers = authContext.isLogin
        ? { Authorization: `Bearer ${authContext.token}` }
        : {}
    ) => {
      setIsLoading(true);
      const abortController = new AbortController();
      activeHttpRequest.current.push(abortController);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: abortController.signal
        });

        const responseData = await response.json();

        activeHttpRequest.current = activeHttpRequest.current.filter(
          reqCtrl => reqCtrl !== abortController
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (error) {
        hidePost();

        if (error.toString() !== "AbortError: The user aborted a request.") {
          err(error.toString());
        }

        setIsLoading(false);
        throw error;
      }
    },
    [err, authContext.token, authContext.isLogin, hidePost]
  );

  const getPost = useCallback(
    async (postId, page) => {
      if (page !== "inPage") {
        setPost({});
        showPost();
      }

      try {
        const responseData = await transitionData(
          `https://ins-app-clone.herokuapp.com/post/${postId}/${authContext.userId}/post`
        );

        setPost(responseData);
      } catch (error) {}
    },
    [transitionData, authContext.userId, showPost]
  );

  const changePost = useCallback(
    ({ isSaved, likeIcon, comment, userId, followType, isFollowers, action }) => {
      const pst = { ...post };

      switch (action) {
        case "LIKE": {
          const userIndex = pst.post.likes.likes.findIndex(
            u => u.userId === authContext.userId
          );

          if (userIndex > -1 && likeIcon) {
            pst.post.likes.quantity = pst.post.likes.quantity - 1;
            pst.post.likes.likes.splice(userIndex, 1);
          }

          if (userIndex === -1 && !likeIcon) {
            pst.post.likes.quantity = pst.post.likes.quantity + 1;

            pst.post.likes.likes.push({
              userId: authContext.userId,
              name: authContext.name,
              profile: authContext.profile,
              isActive: true
            });
          }

          break;
        }

        case "SAVED": {
          if (isSaved) {
            pst.post.isSaved = false;
          }

          if (!isSaved) {
            pst.post.isSaved = true;
          }

          break;
        }

        case "ADD_COMMENT": {
          if (comment) {
            pst.post.comments.quantity = pst.post.comments.quantity + 1;

            pst.post.comments.comments.push({
              name: authContext.name,
              userId: authContext.userId,
              profile: authContext.profile,
              comment: comment
            });
          }

          break;
        }

        case "FOLLOW": {
          const user = pst.post.likes.likes.find(u => u.userId === userId);

          if (!followType && !isFollowers && user) {
            user.isFollowing = true;
          }

          if (followType && !isFollowers && user) {
            user.isFollowing = false;
          }

          break;
        }

        default:
          return pst;
      }

      setPost(pst);
    },
    [post, authContext.userId, authContext.name, authContext.profile]
  );

  const addComment = async (e, postId, data, callback) => {
    e.preventDefault();
    const comment = JSON.parse(data);

    if (Object.getOwnPropertyNames(post).length !== 0) {
      changePost({ comment: comment.comment, action: "ADD_COMMENT" });
    }

    callback && callback(postId, comment.comment);

    try {
      await transitionData(
        `https://ins-app-clone.herokuapp.com/post/${postId}/${authContext.userId}/update-likes-comments?t=comments`,
        "PATCH",
        data,
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authContext.token}`
        }
      );
    } catch (error) {}
  };

  const likeHandler = useCallback(
    async (postId, likeIcon, callback) => {
      if (Object.getOwnPropertyNames(post).length !== 0) {
        changePost({ likeIcon, action: "LIKE" });
      }

      callback && callback(postId, likeIcon);

      try {
        await transitionData(
          `https://ins-app-clone.herokuapp.com/post/${postId}/${authContext.userId}/update-likes-comments?t=likes`,
          "PATCH"
        );
      } catch (error) {}
    },
    [changePost, post, authContext.userId, transitionData]
  );

  const savePostHandler = useCallback(
    async (postId, isPostHide, isSaved, callback) => {
      if (Object.getOwnPropertyNames(post).length !== 0) {
        changePost({ isSaved, action: "SAVED" });
      }

      callback && callback(postId, isSaved);

      try {
        await transitionData(
          `https://ins-app-clone.herokuapp.com/post/${postId}/${authContext.userId}/saved`,
          "POST"
        );
      } catch (error) {}
    },
    [changePost, post, authContext.userId, transitionData]
  );

  const searchUsersHandler = useCallback(
    async (value, search) => {
      setValue(value);
      setUsers([]);

      if (value === search && value !== "") {
        try {
          const responseData = await transitionData(
            `https://ins-app-clone.herokuapp.com/user/${authContext.userId}/users?equalTo=${value}`
          );

          setUsers(responseData.users);
        } catch (error) {}
      }
    },
    [transitionData, authContext.userId]
  );

  const navToProfile = useCallback(
    (e, userId, route) => {
      e.preventDefault();

      navigateToProfile(() =>
        history.replace(
          `/${userId ? userId : authContext.userId}/${route ? route : "profile"}`
        )
      );
    },
    [navigateToProfile, history, authContext.userId]
  );

  const followHandler = useCallback(
    async (userInfo, followType, isFollowers = false, callback) => {
      let url;

      if ((!followType && isFollowers) || (!followType && !isFollowers)) {
        url = `https://ins-app-clone.herokuapp.com/user/${authContext.userId}/${userInfo.uId}/followers-following?t=FOLLOW`;
      } else if (followType && isFollowers) {
        url = `https://ins-app-clone.herokuapp.com/user/${authContext.userId}/${userInfo.uId}/followers-following?t=UNFOLLOW_FOLLOWERS`;
      } else if (followType && !isFollowers) {
        url = `https://ins-app-clone.herokuapp.com/user/${authContext.userId}/${userInfo.uId}/followers-following?t=UNFOLLOW_FOLLOWING`;
      }

      try {
        await transitionData(url, "PATCH");
        callback && callback(userInfo, followType, isFollowers);
      } catch (error) {}
    },
    [transitionData, authContext.userId]
  );

  const follow = useCallback(
    (userInfo, followType, isFollowers) => {
      if (Object.getOwnPropertyNames(post).length !== 0) {
        changePost({
          userId: userInfo.uId,
          followType,
          isFollowers,
          action: "FOLLOW"
        });
      }
    },
    [changePost, post]
  );

  const getAllData = useCallback(
    async ({ action }) => {
      let whichOp;
      let quantity;

      switch (action) {
        case "posts": {
          whichOp = "posts";
          quantity = POSTS_PER_SCROLL;
          break;
        }

        case "explore": {
          whichOp = "explore";
          quantity = PHOTO_PER_SCROLL;
          break;
        }

        default:
          throw new Error("could not found valid action.");
      }

      try {
        const responseData = await transitionData(
          `https://ins-app-clone.herokuapp.com/post/${authContext.userId}/${whichOp}?quantity=${quantity}&scrollNo=${scrl.current}`
        );

        setIsEmpty(responseData.isEmpty);

        setData(prevState => {
          if (prevState.data) {
            return {
              ...prevState,
              data: [...prevState.data, ...responseData.data]
            };
          }

          return responseData;
        });

        responseData.data.length !== 0 && scrl.current++;
      } catch (error) {}
    },
    [transitionData, authContext.userId]
  );

  const scrollHandler = useCallback(
    async (e, action, callback) => {
      if (
        e.path[1].innerHeight + e.path[1].scrollY === e.path[0].body.offsetHeight &&
        Object.getOwnPropertyNames(data).length > 0 &&
        !isEmpty
      ) {
        callback && callback();

        try {
          await getAllData(action);
        } catch (error) {}
      }
    },
    [data, isEmpty, getAllData]
  );

  const getData = useCallback(data => setData(data), []);

  useEffect(() => {
    if (!authContext.isLogin) {
      setUsers([]);
      setValue("");
    }
  }, [authContext.isLogin]);

  useEffect(() => {
    if (!isActive) {
      setPost({});
    }
  }, [isActive]);

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return [
    isLoading,
    transitionData,
    getPost,
    post,
    changePost,
    addComment,
    likeHandler,
    savePostHandler,
    searchUsersHandler,
    val,
    users,
    navToProfile,
    followHandler,
    follow,
    getAllData,
    data,
    isEmpty,
    getData,
    scrollHandler
  ];
};
