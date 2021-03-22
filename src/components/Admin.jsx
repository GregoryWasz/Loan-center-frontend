//TODO REMOVE ERRORS
import { Button, Paper, TextField, Typography } from "@material-ui/core";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../api/axios";
import Alert from "@material-ui/lab/Alert";
import MenuItem from "@material-ui/core/MenuItem";

export default function Admin() {
  let history = useHistory();
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
    <>
      {isError && <Alert severity="error">{errorMessage}</Alert>}
      {users.map((user) => {
        const { admin, user_id, username } = user;
        return (
          <Paper key={user_id}>
            {admin}
            {username}
          </Paper>
        );
      })}
      {sources.map((source) => {
        const { source_id, source_name } = source;
        return <Paper key={source_id}>{source_name}</Paper>;
      })}
      <Paper>
        <Typography variant="h5">Add new source</Typography>
        <TextField
          type="text"
          id="newSource"
          label="newSource"
          variant="outlined"
          value={newSource}
          onChange={(e) => setNewSource(e.target.value)}
        />
        <Button variant="outlined" onClick={createNewSource}>
          Create New Source
        </Button>
      </Paper>
      <Paper>
        <Typography variant="h5">Add new product</Typography>
        <TextField
          type="text"
          id="newProductName"
          label="newProductName"
          variant="outlined"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
        />
        <TextField
          type="text"
          id="newDescription"
          label="newDescription"
          variant="outlined"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <TextField
          type="text"
          id="newCategory"
          label="newCategory"
          variant="outlined"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <TextField
          type="text"
          id="newModel"
          label="newModel"
          variant="outlined"
          value={newModel}
          onChange={(e) => setNewModel(e.target.value)}
        />
        <TextField
          type="number"
          id="newPrice"
          label="newPrice"
          variant="outlined"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
        <TextField
          type="text"
          select
          id="newProductSource"
          label="newProductSource"
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
        <Button variant="outlined" onClick={createNewProduct}>
          Create New product
        </Button>
      </Paper>
    </>
  );
}
