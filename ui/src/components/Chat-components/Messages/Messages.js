import React, { memo } from "react";

import Li from "../../../shared/UI/Li/Li";
import P from "../../../shared/UI/P/P";
import Ul from "../../../shared/UI/Ul/Ul";
import Wrapper from "../../../shared/UI/Wrapper/Wrapper";
import Span from "../../../shared/UI/Span/Span";
import Img from "../../../shared/UI/Img/Img";
import profile from "../../../assets/images/profile.png";
import Input from "../../../shared/UI/Input/Input";
import { require } from "../../../shared/validations/validations";
import { useAuth } from "../../../shared/hooks/Auth/Auth-hook";
import Button from "../../../shared/UI/Button/Button";
import Spinner from "../../../shared/UI/Spinner/Spinner";

import "./Messages.css";

const Messages = memo(props => {
  const [formState, onInput, switchInfo] = useAuth(
    { chat: { value: "", isValid: false } },
    false
  );

  const sendMessageHandler = e => {
    props.sendMessage(
      {
        e,
        userId: props.user.userId,
        value: formState.inputs.chat.value,
        room: props.room,
        target: props.target.userId
      },
      () => {
        switchInfo(
          {
            ...formState.inputs,
            chat: { value: "", isValid: false }
          },
          false
        );
      }
    );
  };

  const span = (item, additionClass) => (
    <Span
      className={`messages__content__messages__list__item__chat__profile ${
        additionClass && additionClass
      }`}
      onClick={e =>
        props.navigateToProfile(
          e,
          item.id === props.user.userId ? props.user.userId : props.target.userId
        )
      }
    >
      <Img
        src={
          item.id === props.user.userId
            ? props.user.profile
              ? `https://ins-app-clone.herokuapp.com/${props.user.profile}`
              : profile
            : props.target.profile
            ? `https://ins-app-clone.herokuapp.com/${props.target.profile}`
            : profile
        }
      />
    </Span>
  );

  const form = (
    <Wrapper className="messages__content__form">
      <form onSubmit={sendMessageHandler}>
        <Wrapper className="messages__content__form__content">
          <Wrapper>
            <Input
              id="chat"
              type="text"
              element="input"
              placeholder="Type something ..."
              validators={[require()]}
              onInput={onInput}
              setEmpty={props.sendMessage}
            />
          </Wrapper>

          <Wrapper>
            <Button type="submit" className="btn-send-message">
              Send
            </Button>
          </Wrapper>
        </Wrapper>
      </form>
    </Wrapper>
  );

  return (
    <Wrapper className="messages">
      <Wrapper className={`${!props.switchPage && "messages__content"}`}>
        {!props.switchPage ? (
          <Wrapper className="messages__content__icon">
            <Wrapper>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="Layer_1"
                data-name="Layer 1"
                viewBox="0 0 512 512"
              >
                <path d="M487.67,416C503.1,393.65,512,367.41,512,339.34c0-51.81-30.29-97.38-76.1-123.67C434.76,110.31,337.63,25.22,218,25.22,97.59,25.22,0,111.32,0,217.54c0,36.62,11.61,70.85,31.74,100L4,368.95c-11.63,19.38,3.92,40.91,23,40.91a26.89,26.89,0,0,0,13.93-4l54.4-29.34A235.57,235.57,0,0,0,197.6,409c28.19,46.29,83.57,77.76,147.29,77.76,34.88,0,67.24-9.44,94-25.56l41.71,22.49a20.63,20.63,0,0,0,10.68,3.07c14.61,0,26.53-16.5,17.61-31.36ZM108.53,354.54,96,347l-12.87,6.94-54.4,29.34-.52.28-.5.3a4.79,4.79,0,0,1-.71.35,2.53,2.53,0,0,1-1.36-1.3,2.69,2.69,0,0,1,.35-.77l.3-.5.28-.52,27.74-51.43,7.46-13.83-8.93-12.92C35,277.2,25.64,247.66,25.64,217.54c0-91.91,86.27-166.68,192.32-166.68,100.53,0,183.28,67.2,191.62,152.49a186,186,0,0,0-64.68-11.46c-92.29,0-167.11,66-167.11,147.45a131.45,131.45,0,0,0,7,42.38A207.85,207.85,0,0,1,108.53,354.54Zm358,46.87-8.93,12.92,7.46,13.83,13.72,25.43L451.1,438.65l-12.87-6.94-12.53,7.54c-23.79,14.32-51.74,21.89-80.81,21.89-78,0-141.46-54.64-141.46-121.8s63.46-121.8,141.46-121.8,141.46,54.64,141.46,121.8A108.94,108.94,0,0,1,466.57,401.41ZM397.46,294.46a12.82,12.82,0,0,1-12.82,12.82H307.71a12.82,12.82,0,1,1,0-25.64h76.93A12.82,12.82,0,0,1,397.46,294.46Zm0,38.46a12.82,12.82,0,0,1-12.82,12.82H307.71a12.82,12.82,0,1,1,0-25.64h76.93A12.82,12.82,0,0,1,397.46,332.93Zm0,38.46a12.82,12.82,0,0,1-12.82,12.82H307.71a12.82,12.82,0,1,1,0-25.64h76.93A12.82,12.82,0,0,1,397.46,371.39Z" />
              </svg>
            </Wrapper>

            <Wrapper>
              <h4>Your Messages</h4>

              <P className="gray">
                Send private photos and messages to a friend or group.
              </P>
            </Wrapper>
          </Wrapper>
        ) : props.chatList && props.chatList.length > 0 ? (
          <Ul className="messages__content__messages__list" ref={props.chat}>
            {props.chatList.map((item, index) => (
              <Li key={index} className="messages__content__messages__list__item">
                <Wrapper
                  className={`messages__content__messages__list__item__chat ${
                    item.id === props.user.userId ? "left-message" : "right-message"
                  }`}
                >
                  {item.id === props.user.userId && span(item, "left-profile")}

                  <Wrapper
                    className={`messages__content__messages__list__item__chat__message ${
                      item.id === props.user.userId
                        ? "user-color black"
                        : "target-color"
                    }`}
                  >
                    <P>{item.date}</P>
                    <P>{item.message}</P>
                  </Wrapper>

                  {item.id === props.target.userId && span(item, "right-profile")}
                </Wrapper>
              </Li>
            ))}
          </Ul>
        ) : (
          !props.isLoading &&
          props.chatList &&
          props.chatList.length === 0 && (
            <React.Fragment>
              <h2 className="black weigth center">There is no message in here.</h2>

              {form}
            </React.Fragment>
          )
        )}
      </Wrapper>

      <Spinner isLoading={props.isLoading && props.switchPage} margin="350px auto" />

      {props.chatList && props.chatList.length > 0 && form}
    </Wrapper>
  );
});

export default Messages;
