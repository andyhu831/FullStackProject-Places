import React from "react";

import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    { id: "u1", name: "Dummy", image: "https://picsum.photos/200/300" },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
