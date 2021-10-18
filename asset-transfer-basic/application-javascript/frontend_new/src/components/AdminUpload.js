import React, { useState, useEffect } from "react";
import {
  Typography,
  makeStyles,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@material-ui/core";
import axios from "axios";
import { BASE_URL } from "../constants";
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
}));

const Admin = () => {
  const classes = useStyles();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [logging, setLogging] = useState(false);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState([]);
  const [student, setStudent] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState({
    show: false,
    message: "",
    success: false,
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/get/users`);
        setUsers(data);
        setStudent(data[0]);
      } catch (error) {
        setUsers([]);
      }
    };

    if (token) {
      history.push("/transcript");
    } else getData();
    // eslint-disable-next-line
  }, [token]);

  const adminLogin = () => {
    setError(false);
    if (username === "admin" && password === "admin") setLoggedIn(true);
    else setError(true);
  };

  const handleChange = (event) => {
    setStudent(event.target.value);
  };

  const fileUpload = async (e) => {
    setLogging(true);
    setError(false);
    setMessage({
      show: false,
      message: "",
      success: false,
    });
    const form = new FormData();
    form.append("transcript", e.target.files[0], e.target.files[0].name);
    form.append("srn", student);
    try {
      const { data, status } = await axios.post(
        `${BASE_URL}/create/asset`,
        form
      );
      if (status === 200) {
        setMessage({
          show: true,
          message: data.message,
          success: true,
        });
      } else throw new Error("Unable to upload transcript");
    } catch (error) {
      setMessage({
        show: true,
        message: "Unable to upload transcript",
        success: false,
      });
    }
    e.target.value = "";
    setLogging(false);
  };

  return (
    <div className="login-container">
      <Paper elevation={2} className="login">
        {loggedIn ? (
          <>
            <Typography gutterBottom className={classes.loginTxtMain}>
              Admin
            </Typography>
            <Typography gutterBottom className={classes.loginTxt}>
              Please select a student and upload their transcript
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">SRN</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={student}
                label="SRN"
                onChange={handleChange}
              >
                {users.map((srn) => (
                  <MenuItem key={srn} value={srn}>
                    {srn}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <input
              className={classes.input}
              id="contained-button-file"
              type="file"
              onChange={fileUpload}
              accept="application/pdf"
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
                {logging ? "Uploading" : "Upload"}
              </Button>
            </label>
            {message.show && (
              <Typography
                className={classes.loginTxt}
                style={{ color: message.success ? "green" : "red" }}
              >
                {message.message}
              </Typography>
            )}
          </>
        ) : (
          <>
            <Typography gutterBottom className={classes.loginTxtMain}>
              Admin Login
            </Typography>
            <TextField
              type="text"
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              type="password"
              fullWidth
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              component="span"
              style={{
                margin: "1.5rem 0 0.5rem 0",
                background: "#037afb",
                color: "#fff",
                fontWeight: 700,
              }}
              onClick={adminLogin}
            >
              Login
            </Button>
            {error && (
              <Typography className={classes.loginTxt} style={{ color: "red" }}>
                Invalid username or password
              </Typography>
            )}
          </>
        )}
      </Paper>
    </div>
  );
};

export default Admin;
