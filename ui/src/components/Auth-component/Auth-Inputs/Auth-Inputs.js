import React from "react";

import {
  minLength,
  email,
  maxLength,
  passowrd
} from "../../../shared/validations/validations";

import Input from "../../../shared/UI/Input/Input";
import Wrapper from "../../../shared/UI/Wrapper/Wrapper";
import Button from "../../../shared/UI/Button/Button";

const AuthInputs = props => {
  return (
    <React.Fragment>
      {!props.formSwitch && (
        <React.Fragment>
          <Input
            id="name"
            ref={props.nameInput}
            type="text"
            element="input"
            label="Name"
            validators={[minLength(), maxLength()]}
            errorText="please enter a valid name (name must be between 5 and 30 characters and has to be lowercase characters)."
            onInput={props.onInput}
            searchUsers={() => {}}
          />

          <Input
            id="fullName"
            type="text"
            element="input"
            label="Full Name"
            validators={[minLength(), maxLength()]}
            errorText="please enter a valid full full name (full name should be between 5 and 30 characters)."
            onInput={props.onInput}
            searchUsers={() => {}}
          />
        </React.Fragment>
      )}

      <Input
        id="email"
        ref={props.emailInput}
        type="email"
        element="input"
        label="Email"
        validators={[email()]}
        errorText="please enter a valid email."
        onInput={props.onInput}
        searchUsers={() => {}}
      />

      <Input
        id="password"
        type="password"
        element="input"
        label="Password"
        validators={[minLength(), maxLength(), passowrd()]}
        errorText="please enter a valid password (password must be between 5 and 30 characters and include one lowercase character, uppercase character, a number, and a special character)."
        onInput={props.onInput}
        searchUsers={() => {}}
      />

      <Wrapper>
        <Button type="submit" disabled={!props.formState.formValid}>
          SEND
        </Button>

        <Button
          type="button"
          className="btn-white"
          onClick={props.formSwitchHandler}
        >
          {!props.formSwitch ? "Switch to login" : "Switch to signup"}
        </Button>

        <Wrapper className="sp">{props.spinner}</Wrapper>
      </Wrapper>
    </React.Fragment>
  );
};

export default AuthInputs;
