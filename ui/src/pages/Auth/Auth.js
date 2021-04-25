import React, { useContext, useEffect, useRef, useState } from "react";

import Wrapper from "../../shared/UI/Wrapper/Wrapper";
import Section from "../../shared/UI/Section/Section";
import { useAuth } from "../../shared/hooks/Auth/Auth-hook";
import AuthInputs from "../../components/Auth-component/Auth-Inputs/Auth-Inputs";
import Err from "../../shared/UI/Err/Err";
import { useHttp } from "../../shared/hooks/http/http-hook";
import Spinner from "../../shared/UI/Spinner/Spinner";
import { AuthContext } from "../../shared/context/Auth/Auth-context";

import "./Auth.css";

const Auth = () => {
  const [formSwitch, setFormSwitch] = useState(false);
  const [isLoading, transitionData] = useHttp();
  const authContext = useContext(AuthContext);
  const nameInput = useRef();
  const emailInput = useRef();

  const [formState, onInput, switchInfo] = useAuth(
    {
      name: { value: "", isValid: false },
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
      fullName: { value: "", isValid: false }
    },
    false
  );

  const formSwitchHandler = () => {
    setFormSwitch(prevState => !prevState);

    if (formSwitch) {
      switchInfo(
        {
          ...formState.inputs,
          name: { value: "", isValid: false },
          fullName: { value: "", isValid: false }
        },
        false
      );
    } else {
      switchInfo(
        { ...formState.inputs, name: undefined, fullName: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    }
  };

  const sendInformationHandler = async e => {
    e.preventDefault();

    if (!formState.formValid) {
      return;
    }

    const header = {
      "Content-Type": "application/json"
    };

    if (!formSwitch) {
      try {
        await transitionData(
          "https://ins-app-clone.herokuapp.com/user/signup",
          "POST",
          JSON.stringify({
            name: formState.inputs.name.value,
            fullName: formState.inputs.fullName.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          header
        );

        setFormSwitch(true);
      } catch (error) {}
    } else {
      try {
        const responseData = await transitionData(
          "https://ins-app-clone.herokuapp.com/user/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          header
        );

        authContext.logIn(
          responseData.token,
          responseData.userId,
          null,
          responseData.profile,
          responseData.name
        );
      } catch (error) {}
    }
  };

  useEffect(() => {
    if (nameInput.current) {
      nameInput.current.focus();
    }
  }, [nameInput]);

  useEffect(() => {
    if (emailInput.current && formSwitch) {
      emailInput.current.focus();
    }
  }, [emailInput, formSwitch]);

  return (
    <React.Fragment>
      <Err />

      <Section className="section">
        <Wrapper className="auth-form__content background-border">
          <Wrapper>
            <h2 className="black">{!formSwitch ? "Sign up" : "log in"}</h2>
          </Wrapper>

          <form onSubmit={sendInformationHandler}>
            <AuthInputs
              formSwitch={formSwitch}
              onInput={onInput}
              emailInput={emailInput}
              nameInput={nameInput}
              formState={formState}
              formSwitchHandler={formSwitchHandler}
              spinner={
                <Spinner isLoading={isLoading} margin="auth" width="1.4rem" height="1.4rem" />
              }
            />
          </form>
        </Wrapper>
      </Section>
    </React.Fragment>
  );
};

export default Auth;
