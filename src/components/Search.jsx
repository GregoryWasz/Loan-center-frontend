import { Paper, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../api/axios";

export default function Search() {
  const history = useHistory();
  const [results, setResults] = useState([]);

  async function handleSearch(e) {
    e.preventDefault();
    setResults([]);

    await axios
      .get("/search", {
        params: {
          product_name: e.target.value,
        },
      })
      .then((response) => {
        setResults(response.data.search);
        console.log(response.data.search);
      })
      .catch();
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      history.push("/");
    }
  }, [history]);

  return (
    <>
      <Paper>
        <TextField variant="outlined" onChange={handleSearch}></TextField>
      </Paper>
      {results.map((result) => {
        const { category, product_id, product_name } = result;
        return (
          <Paper key={product_id}>
            {category}
            {product_name}
          </Paper>
        );
      })}
    </>
  );
}
