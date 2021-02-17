import { useCallback, useReducer } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "SHOW_LIKES":
      return { ...state, showLikes: false };
    case "SHOW_NAVIGATE_PROFILE":
      return { ...state, showNavigateProfile: false };
    case "SHOW_LIKES_TOGGLE":
      return { ...state, showLikes: !state.showLikes };
    case "SHOW_NAVIGATE_PROFILE_TOGGLE":
      return { ...state, showNavigateProfile: !state.showNavigateProfile };
    default:
      return state;
  }
};

export const useNav = initialState => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const showLikesHandler = () => dispatch({ type: "SHOW_LIKES_TOGGLE" });
  const hideLikesHandler = () => dispatch({ type: "SHOW_LIKES" });

  const showNavigateProfileHandler = () => {
    dispatch({ type: "SHOW_NAVIGATE_PROFILE_TOGGLE" });
  };

  const hideWrappers = useCallback((e, icon, menu, whichState) => {
    if (
      !icon.current.contains(e.target) &&
      menu.current &&
      !menu.current.contains(e.target)
    ) {
      if (whichState === "SHOW_LIKES") {
        dispatch({ type: "SHOW_LIKES" });
      }

      if (whichState === "SHOW_NAVIGATE_PROFILE") {
        dispatch({ type: "SHOW_NAVIGATE_PROFILE" });
      }
    }
  }, []);

  return [
    state,
    showLikesHandler,
    hideLikesHandler,
    showNavigateProfileHandler,
    hideWrappers
  ];
};
