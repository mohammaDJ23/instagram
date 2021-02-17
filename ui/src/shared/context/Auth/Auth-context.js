import React, { useCallback, useState } from "react";

export const AuthContext = React.createContext({
  isLogin: false,
  token: null,
  userId: null,
  profile: null,
  name: null,
  tokenExpirationDate: null,
  logIn: () => {},
  logout: () => {},
  profileHandler: () => {}
});

const AuthContextProvider = props => {
  const [isLogin, setIsLogin] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);

  const logIn = useCallback((token, userId, expirationData, profile, name) => {
    setIsLogin(true);
    setToken(token);
    setUserId(userId);
    setProfile(profile);
    setName(name);

    const expiration =
      expirationData || new Date(new Date().getTime() + 1000 * 60 * 60);

    setTokenExpirationDate(expirationData);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        token: token,
        userId: userId,
        expiration: expiration.toISOString(),
        profile: profile,
        name: name
      })
    );
  }, []);

  const profileHandler = useCallback(profile => setProfile(profile), []);

  const logout = useCallback(() => {
    setIsLogin(false);
    setToken(null);
    setUserId(null);
    setProfile(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        token,
        userId,
        profile,
        tokenExpirationDate,
        name,
        logIn,
        logout,
        profileHandler
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
