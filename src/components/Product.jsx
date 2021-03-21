import { Paper, Button } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "../api/axios";
import { UserContext } from "./UserContext";

export default function Product() {
  const history = useHistory();
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [isChanged, setIsChanged] = useState(0);
  const { isAdmin } = useContext(UserContext);

  async function handleChangeStateToOk(e) {
    e.preventDefault();

    await axios
      .put("/product/" + id, {
        state: "Ok",
      })
      .then((response) => {
        console.log("STATE CHANGED TO OK");
        setIsChanged(1);
      })
      .catch((error) => {});
  }

  async function handleChangeStateToBorrowed(e) {
    e.preventDefault();

    await axios
      .put("/product/" + id, {
        state: "Borrowed",
      })
      .then((response) => {
        console.log("STATE CHANGED TO BORROWED");
        setIsChanged(2);
      })
      .catch((error) => {});
  }

  async function handleChangeStateToBroken(e) {
    e.preventDefault();

    await axios
      .put("/product/" + id, {
        state: "Broken",
      })
      .then((response) => {
        console.log("STATE CHANGED TO BROKEN");
        setIsChanged(3);
      })
      .catch((error) => {});
  }

  async function handleDeleteProduct(e) {
    e.preventDefault();

    await axios
      .delete("/product/" + id)
      .then((response) => {
        history.push("/products");
      })
      .catch((error) => {});
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      history.push("/");
    }
    async function getProduct() {
      await axios
        .get("/product/" + id)
        .then((response) => {
          setProduct(response.data.product[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getProduct();
  }, [history, id, isChanged]);

  return (
    <Paper>
      TODO CHANGE STATES TODO ADMIN: DELETE,
      {product.product_id}
      {product.product_name}
      {product.category}
      {product.model}
      {product.state}
      {product.source}
      {product.price}
      {product.description}
      {product.borrowed_by}
      <Button onClick={handleChangeStateToOk}>OK</Button>
      <Button onClick={handleChangeStateToBorrowed}>BORROW</Button>
      <Button onClick={handleChangeStateToBroken}>Broken</Button>
      {isAdmin && <Button onClick={handleDeleteProduct}>DELETE</Button>}
    </Paper>
  );
}
