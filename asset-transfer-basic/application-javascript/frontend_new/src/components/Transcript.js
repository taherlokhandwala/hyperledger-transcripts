import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";
import { BASE_URL } from "../constants";
import { useHistory } from "react-router-dom";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const useStyles = makeStyles(() => ({
  srnContainer: {
    width: "90%",
    margin: "0 auto 16px auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  srnTxt: {
    fontWeight: 600,
    fontSize: "1.2em",
  },
  logoutBtn: {
    margin: "1.5rem 0 0.5rem 0",
    background: "#037afb",
    color: "#fff",
    fontWeight: 700,
    "&:hover": {
      background: "#037afb",
    },
  },
  pdfContainer: {
    height: "650px",
    width: "50%",
    margin: "16px auto",
    border: "1px solid rgba(0, 0, 0, 0.3)",
  },
  waitContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const Transcript = () => {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const classes = useStyles();
  const [username, setUsername] = useState({
    response: false,
    username: "",
  });
  const [pdfs, setPdfs] = useState(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const getData = async () => {
      try {
        const { data, status } = await axios.get(`${BASE_URL}/get/assets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (status === 200) {
          setUsername({
            response: true,
            username: data.username,
          });
          setPdfs(data.transcripts);
        } else {
          throw new Error("Invalid token");
        }
      } catch (error) {
        localStorage.removeItem("token");
        history.push("/");
      }
    };
    getData();
    // eslint-disable-next-line
  }, [token]);

  const logoutUser = () => {
    localStorage.removeItem("token");
    history.push("/");
  };

  return (
    <div>
      {username.response ? (
        <>
          <div className={classes.srnContainer}>
            <Typography className={classes.srnTxt}>
              SRN : {username.username}
            </Typography>
            <Button
              variant="contained"
              className={classes.logoutBtn}
              onClick={logoutUser}
            >
              Logout
            </Button>
          </div>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
            {pdfs && (
              <div className={classes.pdfContainer}>
                <Viewer
                  fileUrl={pdfs.data}
                  defaultScale={SpecialZoomLevel.PageFit}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </div>
            )}
          </Worker>
        </>
      ) : (
        <div className={classes.waitContainer}>
          <Typography variant="body1">Please Wait...</Typography>
          <CircularProgress style={{ marginTop: 8 }} />
        </div>
      )}
    </div>
  );
};

export default Transcript;
