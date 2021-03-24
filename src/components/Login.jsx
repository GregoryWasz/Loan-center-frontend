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
    paddingRight: "5rem",
    paddingLeft: "5rem",
    display: "flex",
    justifyContent: "center",
    maxWidth: "20rem",
    maxHeight: "20rem",
  },
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  loginTypo: {
    spacing: "0.25rem",
  },
  loginForm: {
    margin: "0.25rem",
  },
  button: {
    margin: "0.25rem",
    backgroundColor: "#939597",
    color: "#FFFFFF",
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
        localStorage["token"] = response.data.token;
        setIsLoggedIn(true);
        setCurrentUsername(token.name);
        setIsAdmin(token.admin);
        history.push("/products");
        window.location.reload();
        // XD
      })
      .catch((error) => {
        setIsError(true);
        setMessage(error.response.data.message);
      });
  }

  return (
    <Paper elevation={10} className={classes.paper}>
      <form className={classes.form}>
        <Typography className={classes.login} variant="h4">
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
