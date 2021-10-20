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
} from "@material-ui/core";

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
    maxHeight: 250,
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
});

export default function TranscriptTable({ transcripts, srn }) {
  const classes = useStyles();

  const downloadFile = (index) => {
    let filename = `${srn}_Transcript${index + 1}.pdf`;
    const byteArray = new Uint8Array(transcripts[index].data);
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

  return (
    <TableContainer className={classes.table} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Download</StyledTableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
