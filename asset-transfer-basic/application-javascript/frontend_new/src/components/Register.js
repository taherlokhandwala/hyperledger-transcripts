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
  txtBox: {
    marginTop: "1rem",
  },
}));

const Register = () => {
  const classes = useStyles();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [srn, setSrn] = useState("");
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (token) {
      history.push("/transcript");
    }
    // eslint-disable-next-line
  }, [token]);

  const handleRegister = async () => {
    setRegistering(true);
    setError(false);
    try {
      const { data, status } = await axios.post(`${BASE_URL}/register`, {
        userId: srn,
      });
      if (status === 200) {
        let filename = `${srn}.id`;
        let contentType = "application/json;charset=utf-8;";
        var a = document.createElement("a");
        a.download = filename;
        a.href =
          "data:" +
          contentType +
          "," +
          encodeURIComponent(JSON.stringify(data));
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        history.push("/");
      } else {
        throw new Error("error occured");
      }
    } catch (error) {
      setError(true);
    }
    setRegistering(false);
  };

  return (
    <div className="login-container">
      <Paper elevation={2} className="login">
        <Typography className={classes.loginTxtMain}>Register</Typography>
        <StyledTextField
          fullWidth
          className={classes.txtBox}
          size="small"
          label="SRN"
          value={srn}
          onChange={(e) => setSrn(e.target.value)}
        />
        <Button
          variant="contained"
          size="medium"
          disabled={registering}
          style={{
            margin: "1rem",
            background: "#037afb",
            color: "#fff",
            fontWeight: 700,
            opacity: registering ? 0.6 : 1,
          }}
          onClick={handleRegister}
        >
          Register
        </Button>
        {error && (
          <Typography
            style={{
              color: "red",
              fontWeight: 500,
              fontSize: "1rem",
              marginTop: "0.5rem",
              textAlign: "center",
            }}
          >
            You have already registered.
            <br /> Please contact admin.
          </Typography>
        )}
      </Paper>
    </div>
  );
};

export default Register;
