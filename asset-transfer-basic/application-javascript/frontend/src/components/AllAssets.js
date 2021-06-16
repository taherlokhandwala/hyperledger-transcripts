import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@material-ui/core";
import { readAllAssets } from "../API";

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
  root: {
    width: "100%",
    marginTop: 30,
    textAlign: "center",
    marginBottom: 30,
  },
  table: {
    maxHeight: "400px",
    overflow: "auto",
  },
  paperInfo: {
    textAlign: "center",
    marginTop: 20,
    padding: "5px 30px",
    background: "#FFF3CD",
    color: "#856412",
    fontWeight: 600,
  },
});

export default function AllAssets() {
  const classes = useStyles();
  const [assets, setAssets] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const data = await readAllAssets();
      if (data.status) setAssets(data.data);
      else setAssets([]);
    };
    getData();
  }, []);

  return (
    <div className={classes.root}>
      {Array.isArray(assets) ? (
        assets.length ? (
          <TableContainer className={classes.table} component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Asset ID</StyledTableCell>
                  <StyledTableCell align="center">Color</StyledTableCell>
                  <StyledTableCell align="center">Size</StyledTableCell>
                  <StyledTableCell align="center">Owner</StyledTableCell>
                  <StyledTableCell align="center">
                    Appraised Value
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.Record.ID}>
                    <StyledTableCell align="center" component="th" scope="row">
                      {asset.Record.ID}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {asset.Record.Color}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {asset.Record.Size}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {asset.Record.Owner}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {asset.Record.AppraisedValue}
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper elevation={2} className={classes.paperInfo}>
            No assets stored in the ledger
          </Paper>
        )
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}
