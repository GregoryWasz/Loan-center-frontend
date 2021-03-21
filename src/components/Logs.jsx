import { Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../api/axios";

export default function Logs() {
  const history = useHistory();
  const [logs, setLogs] = useState([]);

  async function getLogs() {
    await axios
      .get("/logs")
      .then((response) => {
        setLogs(response.data.logs);
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
    <>
      {logs.map((log) => {
        const { date, log_id, product_id, product_name, state, username } = log;
        return (
          <Paper key={log_id}>
            {date}
            {product_name}
            {product_id}
            {state}
            {username}
          </Paper>
        );
      })}
    </>
  );
}
