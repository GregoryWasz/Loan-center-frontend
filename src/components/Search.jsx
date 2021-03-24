import { Paper, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "../api/axios";
import { makeStyles } from "@material-ui/core/styles";
import DescriptionIcon from "@material-ui/icons/Description";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "1rem",
    padding: "1rem",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    minWidth: "25rem",
  },
  wrapper: {
    padding: "0.25rem",
    marginTop: "0.25rem",
    marginBottom: "0.25rem",
    textDecoration: "none",
    display: "flex",
  },
  typo: {
    display: "flex",
    justifyContent: "center",
  },
}));

export default function Search() {
  const classes = useStyles();
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
    <Paper elevation={10} className={classes.paper}>
      <Typography className={classes.typo} variant="h4">
        Search:
      </Typography>
      <TextField
        label="Type product name to start search"
        variant="outlined"
        onChange={handleSearch}
      ></TextField>
      {results.map((result) => {
        const { category, product_id, product_name } = result;
        return (
          <Paper
            variant="outlined"
            className={classes.wrapper}
            key={product_id}
            component={Link}
            to={`/product/${product_id}`}
          >
            <div
              style={{
                width: "50%",
              }}
            >
              <Typography>Product Name: {product_name}</Typography>
              <Typography>Category: {category}</Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                width: "50%",
              }}
            >
              <DescriptionIcon />
            </div>
          </Paper>
        );
      })}
    </Paper>
  );
}
