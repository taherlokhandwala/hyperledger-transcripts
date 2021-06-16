import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography, CircularProgress, Paper } from "@material-ui/core";
import { useLedger } from "../context/LedgerContext";
import { InitialiseLedger } from "../API";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  btn: {
    marginTop: 20,
    fontWeight: 600,
  },
  paper: {
    textAlign: "center",
    marginTop: 20,
    padding: "5px 30px",
    background: "#F8D7DA",
    color: "#AC3924",
    fontWeight: 600,
  },
  paperInfo: {
    textAlign: "center",
    marginTop: 20,
    padding: "5px 30px",
    background: "#FFF3CD",
    color: "#856412",
    fontWeight: 600,
  },
  circular: {
    color: "#fff",
  },
}));

const InitLedger = () => {
  const classes = useStyles();
  const { setLedgerInit } = useLedger();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setError(false);
    const data = await InitialiseLedger();
    if (data.init) {
      sessionStorage.setItem("ledger_init", "true");
      setLedgerInit(true);
    } else setError(true);
    setLoading(false);
  };

  return (
    <div className={classes.root}>
      <Typography variant="body1">
        Before you begin, please intialise the ledger
      </Typography>
      <Paper elevation={2} className={classes.paperInfo}>
        Info : This initialises the Ledger with some dummy data
      </Paper>
      {loading ? (
        <Button
          variant="contained"
          color="primary"
          className={classes.btn}
          startIcon={
            <CircularProgress className={classes.circular} size={26} />
          }
        >
          Initialising
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          className={classes.btn}
          onClick={handleClick}
        >
          Initialise Ledger
        </Button>
      )}
      {error ? (
        <Paper elevation={3} className={classes.paper}>
          Couldn't initialise the ledger
        </Paper>
      ) : null}
    </div>
  );
};

export default InitLedger;
