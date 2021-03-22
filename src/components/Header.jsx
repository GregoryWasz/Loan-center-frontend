import React, { useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link, useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { capitalize } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    color: "#698CC3",
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header() {
  const classes = useStyles();
  const history = useHistory();
  const {
    isLoggedIn,
    setIsLoggedIn,
    isAdmin,
    setIsAdmin,
    currentUsername,
    setCurrentUsername,
  } = useContext(UserContext);

  function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentUsername("");
    history.push("/");
    window.location.reload();
  }

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.admin);
      setCurrentUsername(decoded.name);
      setIsLoggedIn(true);
    } catch (e) {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setCurrentUsername("");
    }
  }, [isLoggedIn, isAdmin, setIsAdmin, setCurrentUsername, setIsLoggedIn]);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            className={classes.title}
            component={Link}
            to="/products"
          >
            Loan center
          </Typography>
          {isLoggedIn && (
            <>
              <Button color="inherit" component={Link} to="/logs">
                History
              </Button>
              <Button color="inherit" component={Link} to="/search">
                Search
              </Button>
              {isAdmin && (
                <>
                  <Button color="inherit" component={Link} to="/admin">
                    Admin Site
                  </Button>
                  <Button color="inherit" component={Link} to="/register">
                    Create User
                  </Button>
                </>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
              Hi {capitalize(currentUsername)}
            </>
          )}
          {!isLoggedIn && (
            <Button color="inherit" component={Link} to="/">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
