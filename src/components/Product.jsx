import { Paper, Button, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "../api/axios";
import { UserContext } from "./UserContext";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "1rem",
    margin: "1rem",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  wrapper: {
    padding: "0.25rem",
    margin: "0.25rem",
  },
  typo: {
    padding: "0.25rem",
    margin: "0.25rem",
    display: "flex",
    justifyContent: "center",
  },
  ok: { backgroundColor: "#6F926E", margin: "0.1rem" },
  borrowed: { backgroundColor: "#F5E403", margin: "0.1rem" },
  broken: { backgroundColor: "#CF5D78", margin: "0.1rem" },
  delete: { backgroundColor: "#990112", margin: "0.1rem" },
}));

export default function Product() {
  const history = useHistory();
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isChanged, setIsChanged] = useState(0);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { isAdmin } = useContext(UserContext);
  const classes = useStyles();

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
    <Paper elevation={10} className={classes.paper}>
      <Typography className={classes.typo} variant="h4">
        Product Details
      </Typography>
      {isError && <Alert severity="error">{errorMessage}</Alert>}
      <Paper variant="outlined" className={classes.wrapper}>
        <Typography>Product: {product.product_name}</Typography>
        <Typography>Category: {product.category}</Typography>
        <Typography>Model: {product.model}</Typography>
        <Typography>Actual state: {product.state}</Typography>
        <Typography>Source: {product.source}</Typography>
        <Typography>Price: {product.price}</Typography>
        <Typography>Description: {product.description}</Typography>
        {product.borrowed_by && (
          <Typography>Borrowed by: {product.borrowed_by}</Typography>
        )}
      </Paper>
      <Typography className={classes.typo} variant="h5">
        Actions
      </Typography>
      <Paper variant="outlined" className={classes.wrapper}>
        <Button className={classes.ok} onClick={handleChangeStateToOk}>
          OK
        </Button>
        <Button
          className={classes.borrowed}
          onClick={handleChangeStateToBorrowed}
        >
          BORROW
        </Button>
        <Button className={classes.broken} onClick={handleChangeStateToBroken}>
          Broken
        </Button>
        {isAdmin && (
          <Button className={classes.delete} onClick={handleDeleteProduct}>
            DELETE
          </Button>
        )}
      </Paper>
      <Typography className={classes.typo} variant="h5">
        History
      </Typography>
      {logs.map((log) => {
        const { date, log_id, state, username } = log;
        return (
          <Paper variant="outlined" key={log_id} className={classes.wrapper}>
            <Typography>{date}</Typography>
            <Typography>
              {state}, {username}
            </Typography>
          </Paper>
        );
      })}
    </Paper>
  );
}
