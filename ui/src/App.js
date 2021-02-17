import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import Posts from "./pages/Posts/Posts";
import Navigation from "./shared/UI/Navigation/Navigation";
import Chat from "./pages/Chat/Chat";
import Suggested from "./pages/Suggested/Suggested";
import Explore from "./pages/Explore/Explore";
import Profile from "./pages/Profile/Profile";
import Auth from "./pages/Auth/Auth";
import CreatePost from "./pages/Create-Post/Create-Post";
import UpdatePost from "./pages/Update-Post/Update-Post";
import EditProfile from "./pages/Edit-Profile/Edit-Profile";
import Post from "./pages/Post/Post";
import { AuthContext } from "./shared/context/Auth/Auth-context";

import "./App.css";

let timer;

export default function App() {
  const { isLogin, token, tokenExpirationDate, logIn, logout } = useContext(
    AuthContext
  );

  let routes;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (
      userData &&
      userData.token &&
      userData.userId &&
      new Date(userData.expiration) > new Date()
    ) {
      logIn(
        userData.token,
        userData.userId,
        new Date(userData.expiration),
        userData.profile,
        userData.name
      );
    }
  }, [logIn]);

  useEffect(() => {
    if (isLogin && token && tokenExpirationDate) {
      const expiration = tokenExpirationDate.getTime() - new Date().getTime();
      timer = setTimeout(logout, expiration);
    } else {
      clearTimeout(timer);
    }
  }, [logout, isLogin, token, tokenExpirationDate]);

  if (isLogin) {
    routes = (
      <Switch>
        <Route path="/" exact component={Posts} />
        <Route path="/chat" component={Chat} />
        <Route path="/suggested" component={Suggested} />
        <Route path="/explore" component={Explore} />
        <Route path="/p/:postId" component={Post} />
        <Route path="/:userId/profile" component={Profile} />
        <Route path="/:userId/create-post" component={CreatePost} />
        <Route path="/:postId/update-post" component={UpdatePost} />
        <Route path="/:userId/edit-profile" component={EditProfile} />
        <Redirect to="/" />
      </Switch>
    );
  }

  if (!isLogin) {
    routes = (
      <Switch>
        <Route path="/auth" component={Auth} />
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <Router>
      <Navigation />
      <main className="app">{routes}</main>
    </Router>
  );
}
