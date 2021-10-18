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
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

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
  pdfContainer: {
    height: "650px",
    width: "50%",
    margin: "16px auto",
    border: "1px solid rgba(0, 0, 0, 0.3)",
  },
}));

const AdminView = () => {
  const classes = useStyles();
  const history = useHistory();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const token = localStorage.getItem("token");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState([]);
  const [student, setStudent] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [status, setStatus] = useState({
    response: false,
    status: false,
  });
  const [pdfs, setPdfs] = useState(null);
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

  const handleView = async () => {
    setFetching(true);
    setError(false);
    setStatus({
      response: false,
      status: false,
    });
    setPdfs(null);
    try {
      const { data, status } = await axios.get(
        `${BASE_URL}/get/assets/${student}`
      );
      if (status === 200) {
        setStatus({
          response: true,
          status: true,
        });
        setPdfs(data.transcripts);
      } else throw new Error("error occured");
    } catch (error) {
      setStatus({
        response: true,
        status: false,
      });
    }
    setFetching(false);
  };

  return (
    <div className="pdf-container">
      <Paper elevation={2} className="login">
        {loggedIn ? (
          <>
            <Typography gutterBottom className={classes.loginTxtMain}>
              Admin
            </Typography>
            <Typography gutterBottom className={classes.loginTxt}>
              Please select a student to view their transcript
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
            <Button
              variant="contained"
              component="span"
              disabled={fetching}
              style={{
                margin: "1.5rem 0 0.5rem 0",
                background: "#037afb",
                color: "#fff",
                fontWeight: 700,
                opacity: fetching ? 0.6 : 1,
              }}
              onClick={handleView}
            >
              {fetching ? "Fetching" : "View"}
            </Button>
            {status.response && !(status.status && pdfs) && (
              <Typography className={classes.loginTxt} style={{ color: "red" }}>
                No PDF's to display
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
      {status.response && status.status && pdfs && (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
          <div className={classes.pdfContainer}>
            <Viewer
              fileUrl={pdfs.data}
              defaultScale={SpecialZoomLevel.PageFit}
              plugins={[defaultLayoutPluginInstance]}
            />
          </div>
        </Worker>
      )}
    </div>
  );
};

export default AdminView;
