import React, { useState, useEffect } from "react";
import { Paper, makeStyles, Typography, Button } from "@material-ui/core";
import { BASE_URL } from "../constants";
import axios from "axios";
import { useHistory } from "react-router-dom";

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
  txtBox: {
    marginTop: "1rem",
  },
  verifyBtn: {
    margin: "1rem",
    background: "#037afb",
    color: "#fff",
    fontWeight: 700,
    "&:hover": {
      background: "#037afb",
    },
  },
  msgTxt: {
    fontWeight: 500,
    fontSize: "1rem",
    marginTop: "0.5rem",
    textAlign: "center",
  },
}));

const Verify = () => {
  const classes = useStyles();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      history.push("/transcript");
    }
    // eslint-disable-next-line
  }, [token]);

  const fileUpload = async (e) => {
    setVerifying(true);
    setError(false);
    setSuccess(false);
    const form = new FormData();
    form.append("transcript", e.target.files[0], e.target.files[0].name);
    try {
      const { status } = await axios.post(`${BASE_URL}/verify`, form);
      if (status === 200) {
        setSuccess(true);
      } else throw new Error("error occured");
    } catch {
      setError(true);
    }
    e.target.value = "";
    setVerifying(false);
  };

  return (
    <div className="login-container">
      <Paper elevation={2} className="login">
        <Typography className={classes.loginTxtMain}>
          Verify Transcript
        </Typography>
        <Typography className={classes.loginTxt}>
          Please upload the transcript for verification
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
            size="medium"
            component="span"
            disabled={verifying}
            className={classes.verifyBtn}
            style={{
              opacity: verifying ? 0.6 : 1,
            }}
          >
            {verifying ? "Verifying..." : "Upload"}
          </Button>
        </label>
        {error && (
          <Typography className={classes.msgTxt} style={{ color: "red" }}>
            Invalid Transcript ID
          </Typography>
        )}
        {success && (
          <Typography className={classes.msgTxt} style={{ color: "green" }}>
            Valid Transcript
          </Typography>
        )}
      </Paper>
    </div>
  );
};

export default Verify;
