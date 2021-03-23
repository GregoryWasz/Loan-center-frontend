import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Admin from "./components/Admin";
import Search from "./components/Search";
import Product from "./components/Product";
import Products from "./components/Products";
import Logs from "./components/Logs";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UserContext } from "./components/UserContext";
import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

const theme = createMuiTheme({
  overrides: {},
  palette: {
    primary: {
      main: "#F5DF4D",
    },
    secondary: {
      main: "#939597",
    },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      setIsLoggedIn(true);
      setIsAdmin(decoded.admin);
      setCurrentUsername(decoded.name);
    } catch (e) {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setCurrentUsername("");
    }
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <UserContext.Provider
          value={{
            isLoggedIn,
            setIsLoggedIn,
            isAdmin,
            setIsAdmin,
            currentUsername,
            setCurrentUsername,
          }}
        >
          <Router>
            <Header />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Switch>
                <Route exact path="/">
                  <Login />
                </Route>
                <Route path="/register">
                  <Register />
                </Route>
                <Route path="/admin">
                  <Admin />
                </Route>
                <Route path="/search">
                  <Search />
                </Route>
                <Route exact path="/product/:id">
                  <Product />
                </Route>
                <Route path="/products">
                  <Products />
                </Route>
                <Route path="/logs">
                  <Logs />
                </Route>
                <Route>Site not found</Route>
              </Switch>
            </div>
          </Router>
        </UserContext.Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
