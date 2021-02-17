import React, { useEffect, useState, useContext, useRef, useCallback } from "react";

import socketIo from "socket.io-client";

import Section from "../../shared/UI/Section/Section";
import ChatMenu from "../../components/Chat-components/Chat-Menu/Chat-Menu";
import { useHttp } from "../../shared/hooks/http/http-hook";
import ShowUsers from "../../shared/UI/Show-Users/Show-Users";
import { AuthContext } from "../../shared/context/Auth/Auth-context";
import Err from "../../shared/UI/Err/Err";
import Messages from "../../components/Chat-components/Messages/Messages";
import { ModalContext } from "../../shared/context/Modal/Modal-context";

import "./Chat.css";

let io;

const Chat = () => {
  const [usrs, setUsrs] = useState([]);
  const [showEmpty, setShowEmpty] = useState(false);
  const [switchPage, setSwitchPage] = useState(false);
  const [chatList, setChatList] = useState({});

  const [
    isLoading,
    transitionData,
    ,
    ,
    ,
    ,
    ,
    ,
    searchUsersHandler,
    val,
    users,
    navigateToProfile
  ] = useHttp();

  const authContext = useContext(AuthContext);
  const { err } = useContext(ModalContext);
  const chat = useRef();

  useEffect(() => {
    io = socketIo("https://ins-app-clone.herokuapp.com", {
      extraHeaders: { Authorization: `Bearer ${authContext.token}` }
    });
  }, [authContext.token]);

  useEffect(() => {
    if (usrs.length === 0 && !showEmpty) {
      (async () => {
        try {
          const responseData = await transitionData(
            `https://ins-app-clone.herokuapp.com/user/${authContext.userId}/chat`
          );

          const users =
            responseData.users.length > 0
              ? [...responseData.users].map(user => {
                  return {
                    ...user,
                    isActive: false
                  };
                })
              : [];

          setUsrs(users);

          if (users.length === 0) {
            setShowEmpty(true);
          }
        } catch (error) {}
      })();
    }
  }, [transitionData, authContext.userId, usrs, showEmpty]);

  const startChat = useCallback(
    async ({ userId, name, profile, add }) => {
      setChatList({});
      setShowEmpty(false);

      if (userId !== authContext.userId) {
        setSwitchPage(true);
      }

      if (add) {
        setUsrs(prevState => {
          const prvState = [...prevState];

          if (userId === authContext.userId) {
            return prvState;
          }

          prvState.forEach(user => {
            user["isActive"] = false;

            if (user.userId === userId) {
              user["isActive"] = true;
            }
          });

          if (prvState.findIndex(user => user.userId === userId) === -1) {
            prvState.push({
              userId,
              name,
              profile: profile.indexOf("images\\") === -1 ? undefined : profile,
              isActive: true
            });
          }

          return prvState;
        });
      } else {
        setUsrs(prevState => {
          const prvState = [...prevState].map(user => {
            if (user.userId === userId) {
              return {
                ...user,
                isActive: true
              };
            } else {
              return {
                ...user,
                isActive: false
              };
            }
          });

          return [...prvState];
        });
      }

      try {
        const responseData = await transitionData(
          `https://ins-app-clone.herokuapp.com/user/${authContext.userId}/${userId}/start-chat`,
          "POST"
        );

        setChatList(responseData);
      } catch (error) {}
    },
    [transitionData, authContext.userId]
  );

  const sendMessage = useCallback(
    ({ e, userId, value, room, target }, callback) => {
      e.preventDefault();

      if (userId && value && room) {
        io.emit("send-message", { room, value, userId });
      }

      callback && callback();

      if (
        target &&
        chatList.messages.length === 0 &&
        usrs.findIndex(u => u.userId === target) !== -1
      ) {
        io.emit("us-chat-target", { target, userId });
      }
    },
    [chatList, usrs]
  );

  useEffect(() => {
    io.on("read-chat", data => {
      setChatList(prevState => {
        return {
          ...prevState,
          messages: [...prevState.messages, data]
        };
      });
    });
  }, []);

  useEffect(() => {
    if (Object.getOwnPropertyNames(chatList).length !== 0) {
      if (chatList.user.userId && chatList.target.userId && chatList.room) {
        io.emit("start-chat", {
          room: chatList.room,
          target: chatList.target.userId,
          userId: chatList.user.userId
        });
      }
    }
  }, [startChat, chatList]);

  useEffect(() => {
    if (chat.current) {
      chat.current.scrollTop = chat.current.scrollHeight;
    }
  }, [chat, sendMessage]);

  useEffect(() => {
    io.on("connect_error", error => {
      err(error.toString());
    });

    io.on("error", error => {
      err(error.message.toString());
    });
  }, [err]);

  return (
    <React.Fragment>
      <Err />

      <Section className="Chat section background-border">
        <ChatMenu
          searchUsersHandler={searchUsersHandler}
          users={usrs}
          showEmpty={showEmpty}
          isLoading={isLoading}
          startChat={startChat}
        />

        <Messages
          switchPage={switchPage}
          sendMessage={sendMessage}
          chatList={chatList.messages}
          user={chatList.user}
          target={chatList.target}
          room={chatList.room}
          navigateToProfile={navigateToProfile}
          chat={chat}
          isLoading={isLoading && val.length === 0}
        />
      </Section>

      {val.length >= 1 && (
        <ShowUsers
          isChat={true}
          users={users}
          startChat={startChat}
          isLoading={isLoading && val.length !== 0}
        />
      )}
    </React.Fragment>
  );
};

export default Chat;
