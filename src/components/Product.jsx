import { Paper, Button } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "../api/axios";
import { UserContext } from "./UserContext";
import Alert from "@material-ui/lab/Alert";

export default function Product() {
  const history = useHistory();
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isChanged, setIsChanged] = useState(0);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
      .catch((error) => {
        setIsError(true);
        setErrorMessage(error.response.data.message);
      });
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
    async function getProductLogs() {
      await axios
        .get("/logs/" + id)
        .then((response) => {
          setLogs(response.data.logs.reverse());
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getProduct();
    getProductLogs();
  }, [history, id, isChanged]);

  return (
    <>
      {isError && <Alert severity="error">{errorMessage}</Alert>}
      <Paper>
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
      {logs.map((log) => {
        const { date, log_id, state, username } = log;
        return (
          <Paper key={log_id}>
            {date}
            {state}
            {username}
          </Paper>
        );
      })}
    </>
  );
}
