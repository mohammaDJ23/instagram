import React, { useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

import Section from "../../shared/UI/Section/Section";
import Wrapper from "../../shared/UI/Wrapper/Wrapper";
import { useAuth } from "../../shared/hooks/Auth/Auth-hook";
import EditPostInputs from "../../components/Edit-Profile-component/Edit-Profile-Inputs/Edit-Profile-Inputs";
import { AuthContext } from "../../shared/context/Auth/Auth-context";
import { useHttp } from "../../shared/hooks/http/http-hook";
import Spinner from "../../shared/UI/Spinner/Spinner";
import { ProfileContext } from "../../shared/context/Profile/Profile-context";
import Err from "../../shared/UI/Err/Err";

const EditProfile = () => {
  const [isLoading, transitionData] = useHttp();
  const authContext = useContext(AuthContext);
  const profileContext = useContext(ProfileContext);
  const history = useHistory();
  const nameInput = useRef();

  const [formState, onInput] = useAuth(
    {
      name: { value: "", isValid: false },
      fullName: { value: "", isValid: false },
      description: { value: "", isValid: false },
      image: { value: null, isValid: false }
    },
    false
  );

  const sendInformationHandler = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", formState.inputs.name.value);
    formData.append("fullName", formState.inputs.fullName.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("image", formState.inputs.image.value);

    try {
      const responseData = await transitionData(
        `https://ins-app-clone.herokuapp.com/user/${authContext.userId}/edit-profile`,
        "PUT",
        formData
      );

      authContext.profileHandler(responseData.profile);
      const storage = localStorage.getItem("userData");
      const storageData = JSON.parse(storage);

      if (Object.getOwnPropertyNames(storage).length !== 0) {
        localStorage.setItem(
          "userData",
          JSON.stringify({ ...storageData, profile: responseData.profile })
        );
      }

      history.replace(`/${authContext.userId}/profile`);
      profileContext.navigateToProfile();
    } catch (error) {}
  };

  useEffect(() => {
    if (nameInput.current) {
      nameInput.current.focus();
    }
  }, [nameInput]);

  return (
    <React.Fragment>
      <Err />

      <Section className="section">
        <Wrapper className="auth-form__content background-border">
          <Wrapper>
            <h2 className="black">Edit Profile</h2>
          </Wrapper>

          <form onSubmit={sendInformationHandler}>
            <EditPostInputs
              formState={formState}
              onInput={onInput}
              nameInput={nameInput}
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

export default EditProfile;
