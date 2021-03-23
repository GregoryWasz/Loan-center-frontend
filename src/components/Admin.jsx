//TODO REMOVE ERRORS
import { Button, Paper, TextField, Typography } from "@material-ui/core";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../api/axios";
import Alert from "@material-ui/lab/Alert";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "1rem",
    padding: "1rem",
    display: "flex",
    minWidth: "25rem",
    justifyContent: "center",
    flexDirection: "column",
  },
  wrapper: {
    padding: "0.25rem",
    margin: "0.25rem",
  },
  middle: {
    padding: "0.25rem",
    margin: "0.25rem",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  button: {
    margin: "0.25rem",
    backgroundColor: "#939597",
    color: "#FFFFFF",
  },
  input: {
    margin: "0.25rem",
  },
}));

export default function Admin() {
  let history = useHistory();
  const classes = useStyles();
  const [sources, setSources] = useState(["first"]);
  const [users, setUsers] = useState([]);
  const [newSource, setNewSource] = useState("");
  const [isChanged, setIsChanged] = useState(0);

  const [newProductName, setNewProductName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newProductSource, setNewProductSource] = useState("");

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function createNewSource(e) {
    e.preventDefault();

    await axios
      .post("/source", { source_name: newSource })
      .then((response) => {
        setNewSource("");
        setIsChanged(1);
        setIsError(false);
        setErrorMessage("");
      })
      .catch((error) => {
        setIsError(true);
        setErrorMessage(error.response.data.message);
        console.log(error);
      });
  }

  async function createNewProduct(e) {
    e.preventDefault();
    const payload = {
      product_name: newProductName,
      description: newDescription,
      category: newCategory,
      model: newModel,
      price: newPrice,
      source: newProductSource,
    };

    await axios
      .post("/product", payload)
      .then((response) => {
        console.log("new product created");
        setNewProductName("");
        setNewDescription("");
        setNewCategory("");
        setNewModel("");
        setNewPrice("");
        setNewProductSource("");
        setIsError(false);
        setErrorMessage("");
      })
      .catch((error) => {
        setIsError(true);
        setErrorMessage(error.response.data.message);
        console.log(error);
      });
  }

  async function getAllSources() {
    await axios
      .get("/source")
      .then((response) => {
        setSources(response.data.sources);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function getAllUsers() {
    await axios
      .get("/user")
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      if (!token) {
        history.push("/");
      }
      if (!decoded.admin) {
        history.push("/");
      }
    } catch {
      history.push("/");
    }
    getAllSources();
    getAllUsers();
  }, [history, isChanged]);

  return (
    <Paper elevation={10} className={classes.paper}>
      <Typography variant="h5">Admin</Typography>
      {isError && <Alert severity="error">{errorMessage}</Alert>}
      <Paper
        variant="outlined"
        className={classes.wrapper}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div style={{ width: "50%" }}>
          <Typography variant="h5">Users</Typography>
          {users.map((user) => {
            const { admin, user_id, username } = user;
            return (
              <Paper
                variant="outlined"
                className={classes.wrapper}
                key={user_id}
              >
                {admin}
                {username}
              </Paper>
            );
          })}
        </div>
        <div style={{ width: "50%" }}>
          <Typography variant="h5">Sources</Typography>
          {sources.map((source) => {
            const { source_id, source_name } = source;
            return (
              <Paper
                variant="outlined"
                className={classes.wrapper}
                key={source_id}
              >
                {source_name}
              </Paper>
            );
          })}
        </div>
      </Paper>
      <Paper variant="outlined" className={classes.middle}>
        <Typography variant="h5">Add new source</Typography>
        <TextField
          className={classes.input}
          type="text"
          id="newSource"
          label="Source name"
          variant="outlined"
          value={newSource}
          onChange={(e) => setNewSource(e.target.value)}
        />
        <Button className={classes.button} onClick={createNewSource}>
          Create New Source
        </Button>
      </Paper>
      <Paper variant="outlined" className={classes.middle}>
        <Typography variant="h5">Add new product</Typography>
        <TextField
          className={classes.input}
          type="text"
          id="newProductName"
          label="Product name"
          variant="outlined"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
        />
        <TextField
          className={classes.input}
          type="text"
          id="newDescription"
          label="Product description"
          variant="outlined"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <TextField
          className={classes.input}
          type="text"
          id="newCategory"
          label="Product Category"
          variant="outlined"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <TextField
          className={classes.input}
          type="text"
          id="newModel"
          label="Product Model"
          variant="outlined"
          value={newModel}
          onChange={(e) => setNewModel(e.target.value)}
        />
        <TextField
          className={classes.input}
          type="number"
          id="newPrice"
          label="Product price"
          variant="outlined"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
        <TextField
          className={classes.input}
          type="text"
          select
          id="newProductSource"
          label="Choose product source"
          variant="outlined"
          value={newProductSource}
          onChange={(e) => setNewProductSource(e.target.value)}
        >
          {sources.map((source) => {
            const { source_id, source_name } = source;
            return (
              <MenuItem key={source_id} value={source_name}>
                {source_name}
              </MenuItem>
            );
          })}
        </TextField>
        <Button className={classes.button} onClick={createNewProduct}>
          Create New product
        </Button>
      </Paper>
    </Paper>
  );
}
