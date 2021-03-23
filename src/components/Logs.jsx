import { Paper, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../api/axios";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "1rem",
    padding: "1rem",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  wrapper: {
    padding: "0.25rem",
    margin: "0.25rem",
  },
}));

export default function Logs() {
  const classes = useStyles();
  const history = useHistory();
  const [logs, setLogs] = useState([]);

  async function getLogs() {
    await axios
      .get("/logs")
      .then((response) => {
        setLogs(response.data.logs.reverse());
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      history.push("/");
    }
    getLogs();
  }, [history]);

  return (
    <Paper elevation={10} className={classes.paper}>
      <Typography variant="h5">History: </Typography>
      {logs.map((log) => {
        const { date, log_id, product_id, product_name, state, username } = log;
        return (
          <Paper variant="outlined" className={classes.wrapper} key={log_id}>
            Date: {date}, ID: {product_id}, Product: {product_name}, Username:{" "}
            {username}, State: {state}.
          </Paper>
        );
      })}
    </Paper>
  );
}
