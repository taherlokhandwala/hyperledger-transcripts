import React, { useState, useEffect } from "react";
import {
  TextField,
  Paper,
  makeStyles,
  Typography,
  withStyles,
  Button,
} from "@material-ui/core";
import { BASE_URL } from "../constants";
import axios from "axios";
import { useHistory } from "react-router-dom";

const StyledTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#037afb",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#037afb",
    },
  },
})(TextField);

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
  txtBox: {
    marginTop: "1rem",
  },
  verifyBtn: {
    margin: "1rem",
    background: "#037afb",
    color: "#fff",
    fontWeight: 700,
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
  const [id, setId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [srn, setSrn] = useState("");

  useEffect(() => {
    if (token) {
      history.push("/transcript");
    }
    // eslint-disable-next-line
  }, [token]);

  const handleVerify = async () => {
    setVerifying(true);
    setError(false);
    setSuccess(false);
    try {
      const { data, status } = await axios.get(`${BASE_URL}/verify/${id}`);
      if (status === 200) {
        setSuccess(true);
        setSrn(data.srn);
      } else {
        throw new Error("error occured");
      }
    } catch (error) {
      setError(true);
    }
    setVerifying(false);
  };

  return (
    <div className="login-container">
      <Paper elevation={2} className="login">
        <Typography className={classes.loginTxtMain}>
          Verify Transcript
        </Typography>
        <Typography className={classes.loginTxt}>
          Please enter transcript ID
        </Typography>
        <StyledTextField
          fullWidth
          className={classes.txtBox}
          size="small"
          label="Transcript ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <Button
          variant="contained"
          size="medium"
          disabled={verifying}
          className={classes.verifyBtn}
          style={{
            opacity: verifying ? 0.6 : 1,
          }}
          onClick={handleVerify}
        >
          {verifying ? "Verifying..." : "Verify"}
        </Button>
        {error && (
          <Typography className={classes.msgTxt} style={{ color: "red" }}>
            Invalid Transcript ID
          </Typography>
        )}
        {success && (
          <Typography className={classes.msgTxt} style={{ color: "green" }}>
            Valid Transcript <br /> Belongs to {srn}
          </Typography>
        )}
      </Paper>
    </div>
  );
};

export default Verify;
