import React, { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "../api/axios";
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
  loginTypo: {
    margin: "0.2rem",
  },
  loginForm: {
    margin: "0.25rem",
  },
  button: {
    margin: "0.25rem",
  },
  message: {
    margin: "0.25rem",
  },
}));

export default function Login() {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  let history = useHistory();

  const { setIsLoggedIn, setIsAdmin, setCurrentUsername } = useContext(
    UserContext,
  );

  async function handleLogin(e) {
    e.preventDefault();
    const login = { name, password };

    await axios
      .post("/login", login)
      .then((response) => {
        localStorage.removeItem("token");
        const token = response.data.token;
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        setCurrentUsername(token.name);
        setIsAdmin(token.admin);
        history.push("/products");
      })
      .catch((error) => {
        setIsError(true);
        setMessage(error.response.data.message);
      });
  }

  return (
    <Paper className={classes.paper}>
      <form className={classes.form}>
        <Typography className={classes.login} variant="h5">
          Login to loan center
        </Typography>
        <TextField
          className={classes.loginForm}
          fullWidth={true}
          type="text"
          id="name"
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          className={classes.loginForm}
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
          onClick={handleLogin}
        >
          Login
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