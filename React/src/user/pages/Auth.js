import React, { useState, useContext } from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { Card } from "../../shared/";

import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

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
    } else {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            username: formState.inputs.username.value,
            password: formState.inputs.password.value,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          console.log(data);
          throw new Error(data.ErrorMessage);
        }
        setIsLoading(false);
        auth.login();
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setError(err.message || "An unknown error occurs");
      }
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

  const errorHandler = () => {
    setError(null);
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
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
