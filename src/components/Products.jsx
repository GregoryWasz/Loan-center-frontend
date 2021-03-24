import { Paper, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import axios from "../api/axios";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  data: {
    minWidth: "60rem",
    minHeight: "20rem",
    margin: "0.25rem",
    padding: "0.25rem",
  },
  wrapper: {
    padding: "1rem",
    margin: "1rem",
  },
  tip: {
    margin: "0.25rem",
    padding: "0.25rem",
  },
  typo: {
    display: "flex",
    justifyContent: "center",
  },
}));

export default function Products() {
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const classes = useStyles();

  function handleDoubleClick(e) {
    history.push(`/product/${e.id}`);
  }

  const columns = [
    { field: "Category", width: 110 },
    { field: "Product name", width: 145 },
    { field: "Model" },
    { field: "Description", width: 130 },
    { field: "State" },
    { field: "Price" },
    { field: "Source" },
    { field: "Borrowed by", width: 140 },
  ];

  async function getProducts() {
    await axios
      .get("/product")
      .then((response) => {
        setProducts(response.data.products);
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
    getProducts();
  }, [history]);

  return (
    <>
      <Paper elevation={10} className={classes.wrapper}>
        <Typography className={classes.typo} variant="h4">
          Our Products
        </Typography>
        <DataGrid
          disableSelectionOnClick={true}
          onCellDoubleClick={handleDoubleClick}
          autoHeight={true}
          className={classes.data}
          rows={products}
          columns={columns}
        />
        <Alert className={classes.tip} variant="outlined" severity="info">
          To get product details double click on it!
        </Alert>
      </Paper>
    </>
  );
}
