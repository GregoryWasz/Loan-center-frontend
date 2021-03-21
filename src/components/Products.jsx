import { Button, Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "../api/axios";

export default function Products() {
  const history = useHistory();
  const [products, setProducts] = useState([]);

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
      {products.map((product) => {
        const {
          borrowed_by,
          category,
          description,
          model,
          price,
          product_id,
          product_name,
          source,
          state,
        } = product;
        return (
          <Paper key={product_id}>
            {borrowed_by}
            {category}
            {description}
            {state}
            {model}
            {price}
            {product_name}
            {source}
            <Button component={Link} to={`/product/${product_id}`}>
              GO TO
            </Button>
          </Paper>
        );
      })}
    </>
  );
}
