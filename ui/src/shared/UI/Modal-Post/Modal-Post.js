import React from "react";

import Img from "../Img/Img";
import P from "../P/P";
import Wrapper from "../Wrapper/Wrapper";

import "./Modal-Post.css";

const ModalPost = props => {
  return (
    <Wrapper className={`modal-post ${props.className}`}>
      <Wrapper className="modal-post__content">
        <Wrapper className="modal-post__content__likes-quantity">
          <Wrapper>
            <Img src="https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2012/png/iconmonstr-favorite-5.png&r=255&g=255&b=255" />
          </Wrapper>

          <Wrapper>
            <P>{props.likesQuantity}</P>
          </Wrapper>
        </Wrapper>

        <Wrapper className="modal-post__content__comments-quantity">
          <Wrapper>
            <Img src="https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2012/png/iconmonstr-speech-bubble-11.png&r=255&g=255&b=255" />
          </Wrapper>

          <Wrapper>
            <P>{props.commentsQuantity}</P>
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
};

export default ModalPost;
