import React, { useState, useEffect } from "react";
import { Typography, makeStyles, Paper, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants";

const useStyles = makeStyles(() => ({
  loginTxtMain: {
    fontWeight: 700,
    fontSize: "1.5rem",
  },
  loginTxt: {
    fontWeight: 500,
    fontSize: "1rem",
    marginTop: "0.5rem",
  },
  input: {
    display: "none",
  },
}));

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [logging, setLogging] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (token) {
      history.push("/transcript");
    }
    // eslint-disable-next-line
  }, [token]);

  const fileUpload = async (e) => {
    setLogging(true);
    setError(false);
    const form = new FormData();
    form.append("key", e.target.files[0], e.target.files[0].name);
    try {
      const { data, status } = await axios.post(`${BASE_URL}/login`, form);
      if (status === 200) {
        localStorage.setItem("token", data.token);
        history.push("/transcript");
      } else throw new Error("error occured");
    } catch {
      setError(true);
    }

    e.target.value = "";
    setLogging(false);
  };

  return (
    <div className="login-container">
      <Paper elevation={2} className="login">
        <Typography className={classes.loginTxtMain}>Log-In</Typography>
        <Typography className={classes.loginTxt}>
          Please upload your key to login
        </Typography>
        <input
          className={classes.input}
          id="contained-button-file"
          type="file"
          onChange={fileUpload}
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            component="span"
            disabled={logging}
            style={{
              margin: "1.5rem 0 0.5rem 0",
              background: "#037afb",
              color: "#fff",
              fontWeight: 700,
              opacity: logging ? 0.6 : 1,
            }}
          >
            Upload
          </Button>
        </label>
        <Typography
          style={{ display: logging ? "block" : "none" }}
          className={classes.loginTxt}
        >
          Please wait ...
        </Typography>
        {error && (
          <Typography className={classes.loginTxt} style={{ color: "red" }}>
            Invalid Key
          </Typography>
        )}
      </Paper>
    </div>
  );
};

export default Login;
