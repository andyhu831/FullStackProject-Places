import React, { useState, useContext } from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { Card } from "../../shared/";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      username: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLogin) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            username: formState.inputs.username.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        auth.login(responseData.user.id);
      } catch (err) {}
    } else {
      try {
        const responseData =await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",

          JSON.stringify({
            name: formState.inputs.name.value,
            username: formState.inputs.username.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        auth.login(responseData.user.id);
      } catch (err) {}
    }
  };

  const switchModeHandler = () => {
    if (!isLogin) {
      setFormData(
        { ...formState.inputs, name: undefined },
        formState.inputs.username.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLogin((prevMode) => !prevMode);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <div className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <Card>
          <h2>Login Required</h2>
          <hr />
          <form onSubmit={authSubmitHandler}>
            {!isLogin && (
              <Input
                element="input"
                id="name"
                type="text"
                label="Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a name."
                onInput={inputHandler}
              />
            )}
            <Input
              id="username"
              element="input"
              type="text"
              label="username"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter an username."
              onInput={inputHandler}
            />
            <Input
              id="password"
              element="input"
              type="password"
              label="password"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a password."
              onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
              {isLogin ? "LOGIN" : "SIGNUP"}
            </Button>
          </form>
          <Button inverse onClick={switchModeHandler}>
            SWITCH TO {isLogin ? "SIGNUP" : "LOGIN"}
          </Button>
        </Card>
      </div>
    </>
  );
};

export default Auth;
