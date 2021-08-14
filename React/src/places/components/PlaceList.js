import React from "react";

import PlaceItem from "./PlaceItem";
import {Card} from "../../shared";
import Button from '../../shared/components/FormElements/Button';
import "./PlaceList.css";

const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No place found. </h2>
          <Button to="/places/new">Create a place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          title={place.title}
          image={place.image}
          address={place.address}
          description={place.description}
          creatorId={place.creator}
          coordinates={place.location}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
