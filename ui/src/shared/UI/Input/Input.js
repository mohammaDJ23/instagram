import React, { memo, useEffect, useReducer, useRef } from "react";

import { validate } from "../../validations/validations";
import Wrapper from "../Wrapper/Wrapper";
import P from "../../UI/P/P";
import Button from "../Button/Button";
import Img from "../Img/Img";

import "./Input.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "VALUE":
      return {
        ...state,
        value: action.value,
        isValid: validate(action.value, action.validators)
      };

    case "TOUCH":
      return {
        ...state,
        isTouch: true
      };

    case "PICK_FILE":
      return {
        ...state,
        isValid: true,
        value: action.file
      };

    case "NOT_PICKED_FILE":
      return {
        ...state,
        isValid: false,
        value: null,
        previewFile: null
      };

    case "PICKED_FILE":
      return {
        ...state,
        previewFile: action.previewFile
      };

    case "EMPTY_VALUE":
      return {
        ...state,
        isValid: false,
        value: "",
        isTouch: false
      };

    default:
      return state;
  }
};

const Input = memo(
  React.forwardRef((props, ref) => {
    const [inputState, dispatch] = useReducer(
      reducer,
      props.element === "input" && props.element === "textarea"
        ? {
            value: "",
            isValid: false,
            isTouch: false
          }
        : {
            value: undefined,
            isValid: false,
            previewFile: null
          }
    );

    const filePickerRef = useRef();
    const searchInput = useRef();

    const valueHandler = e => {
      dispatch({
        type: "VALUE",
        value: e.target.value,
        validators: props.validators
      });
    };

    const touchHandler = () => dispatch({ type: "TOUCH" });
    const { value, isValid } = inputState;
    const { id, uniqueId, onInput, searchUsers } = props;

    useEffect(() => {
      onInput(id || uniqueId, value, isValid);
    }, [id, value, isValid, onInput, uniqueId]);

    const setEmpty = props.setEmpty && props.setEmpty;

    useEffect(() => {
      dispatch({ type: "EMPTY_VALUE" });
    }, [setEmpty]);

    const search = searchInput.current && searchInput.current.value;

    useEffect(() => {
      if (searchUsers) {
        const timer = setTimeout(
          () => {
            searchUsers(value || "", search);
          },
          value === "" || search === "" ? 150 : 500
        );

        return () => clearTimeout(timer);
      }
    }, [searchUsers, value, search]);

    useEffect(() => {
      if (
        inputState.isTouch &&
        props.element === "input" &&
        search &&
        props.isNav
      ) {
        dispatch({ type: "EMPTY_VALUE" });
      }
    }, [search, inputState.isTouch, props.element, props.isNav]);

    const pickImageHandler = () => filePickerRef.current.click();

    const pickHandler = e => {
      let file;
      let fileIsValid = inputState.isValid;

      if (e.target.files && e.target.files.length === 1) {
        file = e.target.files[0];
        dispatch({ type: "PICK_FILE", file: file });
        fileIsValid = true;
      } else {
        dispatch({ type: "NOT_PICKED_FILE" });
        fileIsValid = false;
      }

      props.onInput(props.id, file, fileIsValid);
    };

    const fileValue = props.file && inputState.value;

    useEffect(() => {
      if (!fileValue) {
        return;
      }

      const fileReader = new FileReader();

      fileReader.onload = () => {
        dispatch({ type: "PICKED_FILE", previewFile: fileReader.result });
      };

      fileReader.readAsDataURL(fileValue);
    }, [fileValue]);

    const element =
      props.element === "input" ? (
        <input
          id={props.id}
          type={props.type}
          className={`${props.className} ${
            !props.search &&
            inputState.isTouch &&
            !inputState.isValid &&
            "not-valid"
          }`}
          placeholder={props.placeholder}
          value={inputState.value || ""}
          onChange={valueHandler}
          onBlur={touchHandler}
          onInput={searchUsers && searchUsers}
          ref={ref || searchInput}
        />
      ) : props.element === "textarea" ? (
        <textarea
          id={!props.comment ? props.id : null}
          type={props.type}
          className={`${props.className} ${
            !props.search &&
            inputState.isTouch &&
            !inputState.isValid &&
            "not-valid"
          }`}
          placeholder={props.placeholder}
          value={inputState.value || ""}
          onChange={valueHandler}
          onBlur={touchHandler}
          rows={props.row || "1"}
        />
      ) : props.element === "file" ? (
        <input
          id={props.id}
          type={props.type}
          ref={filePickerRef}
          style={{ display: "none" }}
          accept={props.accept}
          onChange={pickHandler}
        />
      ) : null;

    return (
      <React.Fragment>
        {!props.file ? (
          <Wrapper>
            {props.label && (
              <label
                htmlFor={props.id}
                className={`${
                  !inputState.isValid && inputState.isTouch && "not-valid-label"
                }`}
              >
                {props.label}:
              </label>
            )}

            {element}

            {!inputState.isValid && inputState.isTouch && (
              <P className="input-error">{props.errorText}</P>
            )}
          </Wrapper>
        ) : (
          <Wrapper className="input__file-picker">
            {element}

            <Wrapper className="input__file-picker__image">
              <Button type="button" onClick={pickImageHandler}>
                Pick an image
              </Button>

              {inputState.isValid && inputState.previewFile && (
                <Wrapper
                  className={`${
                    !props.profilePic
                      ? "input__file-picker__image__post"
                      : "input__file-picker__image__profile"
                  }`}
                >
                  <Img src={inputState.previewFile} />
                </Wrapper>
              )}
            </Wrapper>

            {!inputState.isValid && <P>{props.errorText}</P>}
          </Wrapper>
        )}
      </React.Fragment>
    );
  })
);

export default Input;
