import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Admin() {
  let history = useHistory();
  const { isLoggedIn, isAdmin } = useContext(UserContext);

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/");
    }
    if (!isAdmin) {
      history.push("/");
    }
  }, [isLoggedIn, isAdmin, history]);

  return (
    <>
      <div>TODO GET ALL USERS, TODO ADD SOURCE, TODO GET ALL SOURCES</div>
    </>
  );
}
