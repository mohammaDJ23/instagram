import React from "react";

import Wrapper from "../Wrapper/Wrapper";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { require } from "../../validations/validations";
import { useAuth } from "../../hooks/Auth/Auth-hook";

const PostComment = props => {
  const [formState, onInput, switchInfo] = useAuth(
    { comment: { value: "", isValid: false } },
    false
  );

  const sendInformationHandler = async e => {
    try {
      await props.addComment(
        e,
        props.postId,
        JSON.stringify({ comment: formState.inputs.comment.value }),
        (postId, comment) => {
          switchInfo(
            {
              ...formState.inputs,
              comment: { value: "", isValid: false }
            },
            false
          );

          props.addComnt && props.addComnt(postId, comment);
        }
      );
    } catch (error) {}
  };

  return (
    <footer className="post-item__footer">
      <form onSubmit={sendInformationHandler}>
        <Wrapper className="post-item__footer__content-form">
          <Wrapper>
            <Input
              uniqueId="comment"
              type="input"
              className="post-item__footer__textarea"
              element="input"
              placeholder="add a comment ..."
              comment={true}
              onInput={onInput}
              validators={[require()]}
              setEmpty={props.addComment}
              searchUsers={() => {}}
            />
          </Wrapper>

          <Wrapper>
            <Button
              type="submit"
              className="btn-white-no-border"
              disabled={!formState.formValid}
            >
              Post
            </Button>
          </Wrapper>
        </Wrapper>
      </form>
    </footer>
  );
};

export default PostComment;
