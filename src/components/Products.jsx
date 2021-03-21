import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Products() {
  const history = useHistory();
  const { isLoggedIn } = useContext(UserContext);

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/");
    }
  }, [isLoggedIn, history]);
  return <div>TODO GET ALL PRODUCTS</div>;
}
