import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";

import "./PlaceForm.css";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Locker room",
    description: "Two blocks up from leather club",
    imageUrl:
      "data:image/jpeg;base64,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",
    address: "123 45th St",
    location: {
      lat: 45.2563685,
      lng: -118.5498429,
    },
    creator: "u1",
  },
];

const UpdatePlace = () => {
  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

  useEffect(() => {
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true,
          },
          description: {
            value: identifiedPlace.description,
            isValid: true,
          },
        },
        true
      );
    }
  }, [setFormData, identifiedPlace]);

  const placeUpdateSubmitHandler = (event) => {
    event.preventDefault();
  };

  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>No such place.</h2>
      </div>
    );
  }

  return (
    formState.inputs.title.value && (
      <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          value={formState.inputs.title.value}
          isValid={formState.inputs.title.isValid}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid description."
          onInput={inputHandler}
          value={formState.inputs.description.value}
          isValid={formState.inputs.description.isValid}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>
    )
  );
};

export default UpdatePlace;
