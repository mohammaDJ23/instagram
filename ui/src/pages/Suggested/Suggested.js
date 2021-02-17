import React, { useState, useContext, useEffect } from "react";

import SuggestedList from "../../components/Suggested-components/Suggested-List/Suggested-List";
import { useHttp } from "../../shared/hooks/http/http-hook";
import { AuthContext } from "../../shared/context/Auth/Auth-context";
import Spinner from "../../shared/UI/Spinner/Spinner";
import Section from "../../shared/UI/Section/Section";
import Err from "../../shared/UI/Err/Err";

const Suggested = () => {
  const [suggestions, setSuggestions] = useState({});

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

  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (Object.getOwnPropertyNames(suggestions).length === 0) {
      (async () => {
        try {
          const responseData = await transitionData(
            `https://ins-app-clone.herokuapp.com/user/${authContext.userId}/suggestions`
          );

          setSuggestions(responseData);
        } catch (error) {}
      })();
    }
  }, [transitionData, authContext.userId, suggestions]);

  const follow = (userInfo, followType) => {
    const sug = { ...suggestions };
    const user = sug.suggestions.find(u => u.userId === userInfo.uId);

    if (followType && Object.getOwnPropertyNames(user).length !== 0) {
      user.isFollowing = false;
    }

    if (!followType && Object.getOwnPropertyNames(user).length !== 0) {
      user.isFollowing = true;
    }

    setSuggestions(sug);
  };

  return suggestions.suggestions ? (
    <React.Fragment>
      <Err />

      {suggestions.suggestions.length > 0 ? (
        <Section className="section suggested-list background-border">
          <SuggestedList
            suggestedList={suggestions.suggestions}
            navigateToProfile={navigateToProfile}
            followHandler={followHandler}
            follow={follow}
            isLoading={isLoading}
          />
        </Section>
      ) : (
        <h2 className="weight black center">there are no suggestions in here.</h2>
      )}
    </React.Fragment>
  ) : (
    <Spinner isLoading={isLoading} />
  );
};

export default Suggested;
