import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { UserContext } from "./UserContext";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Button, Paper, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "1rem",
    padding: "1rem",
    display: "flex",
    justifyContent: "center",
  },
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  registerTypo: {
    margin: "0.2rem",
  },
  registerForm: {
    margin: "0.25rem",
  },
  button: {
    margin: "0.25rem",
  },
  message: {
    margin: "0.25rem",
  },
}));

export default function Register() {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const { isLoggedIn, isAdmin } = useContext(UserContext);
  let history = useHistory();

  async function handleRegister(e) {
    e.preventDefault();
    const register = { name, password };

    await axios
      .post("/user", register)
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        setIsError(true);
        setMessage(error.response.data.message);
      });
  }

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/");
    }
    if (!isAdmin) {
      history.push("/");
    }
  }, [isLoggedIn, isAdmin, history]);

  return (
    <Paper className={classes.paper}>
      <form className={classes.form}>
        <Typography className={classes.registerTypo} variant="h5">
          Create user
        </Typography>
        <TextField
          className={classes.registerForm}
          fullWidth={true}
          type="text"
          id="name"
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          className={classes.registerForm}
          fullWidth={true}
          type="password"
          id="password"
          label="Password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          className={classes.button}
          fullWidth={true}
          variant="outlined"
          onClick={handleRegister}
        >
          Create user
        </Button>
        {isError && (
          <Alert severity="error" className={classes.message}>
            {message}
          </Alert>
        )}
      </form>
    </Paper>
  );
}
