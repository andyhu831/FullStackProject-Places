import React from "react";
import { Link } from "react-router-dom";

import { Avatar, Card } from "../../shared";
import "./UserItem.css";

const UserItem = ({ id, name, placeCount, image }) => {
  return (
    <li className="user-item">
      <div className="user-item__content">
        <Card>
          <Link to={`/${id}/places`}>
            <div className="user-item__image">
              <Avatar image={image} alt={name} />
            </div>
            <div className="user-item__info">
              <h2>{name}</h2>
              <h3>
                {placeCount} {placeCount === 1 ? "Place" : "Places"}
              </h3>
            </div>
          </Link>
        </Card>
      </div>
    </li>
  );
};

export default UserItem;
