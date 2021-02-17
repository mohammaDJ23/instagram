import React, { useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

import Section from "../../shared/UI/Section/Section";
import Wrapper from "../../shared/UI/Wrapper/Wrapper";
import CreateUpdatePostInputs from "../../components/Create-Update-Post-component/Create-Update-Post-Inputs/Create-Update-Post-Inputs";
import { useAuth } from "../../shared/hooks/Auth/Auth-hook";
import { AuthContext } from "../../shared/context/Auth/Auth-context";
import { useHttp } from "../../shared/hooks/http/http-hook";
import Spinner from "../../shared/UI/Spinner/Spinner";
import Err from "../../shared/UI/Err/Err";

const CreateUpdatePost = () => {
  const authContext = useContext(AuthContext);
  const [isLoading, transiationData] = useHttp();
  const history = useHistory();
  const addressInput = useRef();

  const [formState, onInput] = useAuth(
    {
      address: { value: "", isValid: false },
      description: { value: "", isValid: false },
      image: { value: null, isValid: false }
    },
    false
  );

  const sendInformationHandler = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("address", formState.inputs.address.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("image", formState.inputs.image.value);

    try {
      await transiationData(
        `https://ins-app-clone.herokuapp.com/post/${authContext.userId}/create-post`,
        "POST",
        formData
      );

      history.push(`/`);
    } catch (error) {}
  };

  useEffect(() => {
    if (addressInput.current) {
      addressInput.current.focus();
    }
  }, [addressInput]);

  return (
    <React.Fragment>
      <Err />

      <Section className="section">
        <Wrapper className="auth-form__content  background-border">
          <Wrapper>
            <h2 className="black">Create Post</h2>
          </Wrapper>

          <form onSubmit={sendInformationHandler}>
            <CreateUpdatePostInputs
              onInput={onInput}
              formState={formState}
              addressInput={addressInput}
              spinner={
                <Spinner
                  isLoading={isLoading}
                  margin="auth"
                  width="1.4rem"
                  height="1.4rem"
                />
              }
            />
          </form>
        </Wrapper>
      </Section>
    </React.Fragment>
  );
};
export default CreateUpdatePost;
