import React, { useEffect } from "react";
import { Paper, Button, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const Home = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      history.push("/transcript");
    }
    // eslint-disable-next-line
  }, [token]);

  return (
    <div className="login-container">
      <Paper elevation={2} className="login">
        <Typography variant="body1" gutterBottom>
          Welcome Student, please chose an option
        </Typography>
        <Button
          variant="contained"
          size="medium"
          style={{
            margin: "1rem",
            background: "#037afb",
            color: "#fff",
            fontWeight: 700,
          }}
          onClick={() => history.push("/login")}
        >
          Login
        </Button>
        <Button
          variant="contained"
          size="medium"
          style={{
            margin: "0.5rem",
            background: "#037afb",
            color: "#fff",
            fontWeight: 700,
          }}
          onClick={() => history.push("/register")}
        >
          Register
        </Button>
      </Paper>
    </div>
  );
};

export default Home;
