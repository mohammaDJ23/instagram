import React from "react";

import Input from "../../../shared/UI/Input/Input";
import Wrapper from "../../../shared/UI/Wrapper/Wrapper";
import Button from "../../../shared/UI/Button/Button";
import { maxLength, minLength } from "../../../shared/validations/validations";

const editProfileInputs = props => {
  return (
    <React.Fragment>
      <Input
        id="name"
        element="input"
        ref={props.nameInput}
        type="text"
        label="Name"
        validators={[minLength(), maxLength()]}
        errorText="please enter a valid name (name must be between 5 and 30 characters and has to be lowercase characters)."
        onInput={props.onInput}
        searchUsers={() => {}}
      />

      <Input
        id="fullName"
        element="input"
        label="Full Name"
        validators={[minLength(), maxLength()]}
        errorText="please enter a valid full name (full name must be between 5 and 30 characters)."
        onInput={props.onInput}
        searchUsers={() => {}}
      />

      <Input
        id="description"
        element="textarea"
        label="description"
        row="5"
        validators={[minLength(), maxLength()]}
        errorText="please enter a valid description (description must be between 5 and 30 characters)."
        onInput={props.onInput}
        searchUsers={() => {}}
      />

      <Input
        id="image"
        type="file"
        file={true}
        element="file"
        accepy=".jpg,.png,.jpeg"
        errorText="please pick an image."
        profilePic="profile-pic"
        validators={[]}
        searchUsers={() => {}}
        onInput={props.onInput}
      />

      <Wrapper>
        <Button type="submit" disabled={!props.formState.formValid}>
          SEND
        </Button>

        <Wrapper className="sp">{props.spinner}</Wrapper>
      </Wrapper>
    </React.Fragment>
  );
};

export default editProfileInputs;
