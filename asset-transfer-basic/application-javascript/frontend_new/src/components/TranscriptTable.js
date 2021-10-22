import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import { BASE_URL } from "../constants";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles = makeStyles({
  table: {
    width: "100%",
    maxHeight: 500,
    overflow: "auto",
  },
  downloadBtn: {
    background: "#037afb",
    color: "#fff",
    fontWeight: 600,
    "&:hover": {
      background: "#037afb",
    },
  },
  verify: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
});

export default function TranscriptTable({
  transcripts,
  srn,
  setTranscripts,
  setUsername,
}) {
  const classes = useStyles();

  const downloadFile = (index) => {
    let filename = `${srn}_Transcript${index + 1}.pdf`;
    const byteArray = new Uint8Array(transcripts[index].transcript.data);
    const blob = new Blob([byteArray], {
      type: "application/pdf",
    });
    const a = document.createElement("a");
    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const updateVerificationStatus = (index) => {
    setTranscripts((prev) => {
      const updatedTranscripts = prev.map((t, i) => {
        if (index === i) {
          axios.post(`${BASE_URL}/update/asset/verify`, {
            ID: t.ID,
          });
          t.verified = true;
        }
        return t;
      });
      return updatedTranscripts;
    });
  };

  const deleteTranscript = async (index) => {
    setUsername({ response: false });
    await axios.post(`${BASE_URL}/delete/asset`, {
      ID: transcripts[index].ID,
    });
    window.location.reload();
  };

  return (
    <TableContainer className={classes.table} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Download</StyledTableCell>
            <StyledTableCell align="center">Verify</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transcripts.map((t, index) => (
            <TableRow key={index}>
              <StyledTableCell component="th" scope="row">
                Transcript - {index + 1}
              </StyledTableCell>
              <StyledTableCell>
                <Button
                  variant="contained"
                  size="small"
                  className={classes.downloadBtn}
                  onClick={() => downloadFile(index)}
                >
                  Download
                </Button>
              </StyledTableCell>
              <StyledTableCell>
                <div className={classes.verify}>
                  {t.verified ? (
                    <Typography variant="subtitle2">
                      &#10003; Verified
                    </Typography>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        size="small"
                        className={classes.downloadBtn}
                        style={{
                          marginBottom: 4,
                        }}
                        onClick={() => updateVerificationStatus(index)}
                      >
                        Yes
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        className={classes.downloadBtn}
                        style={{
                          marginBottom: 4,
                        }}
                        onClick={() => deleteTranscript(index)}
                      >
                        No
                      </Button>
                    </>
                  )}
                </div>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
