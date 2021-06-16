import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography, Paper } from "@material-ui/core";
import AllAssets from "./AllAssets";
import OneAsset from "./OneAsset";
import CreateAsset from "./CreateAsset";
import UpdateAsset from "./UpdateAsset";

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
    marginBottom: 20,
    padding: "5px 15px",
    background: "#CCE5FE",
    color: "#0054BA",
    fontWeight: 600,
  },
  btnContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexWrap: "wrap",
    width: "60%",
  },
}));

const Home = () => {
  const classes = useStyles();
  const [sections, setSections] = useState({
    showAll: false,
    showOne: false,
    create: false,
    update: false,
  });

  const handleShowAll = () => {
    setSections({
      showAll: true,
      showOne: false,
      create: false,
      update: false,
    });
  };

  const handleShowOne = () => {
    setSections({
      showAll: false,
      showOne: true,
      create: false,
      update: false,
    });
  };

  const handleCreate = () => {
    setSections({
      showAll: false,
      showOne: false,
      create: true,
      update: false,
    });
  };

  const handleUpdate = () => {
    setSections({
      showAll: false,
      showOne: false,
      create: false,
      update: true,
    });
  };

  return (
    <div className={classes.root}>
      <Paper elevation={2} className={classes.paper}>
        The Ledger has been initialised !
      </Paper>
      <Typography variant="body1">
        We can perform the following operations
      </Typography>
      <div className={classes.btnContainer}>
        <Button
          variant="contained"
          color="primary"
          className={classes.btn}
          onClick={handleShowAll}
        >
          Read all Assets
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.btn}
          onClick={handleShowOne}
        >
          Read an Asset
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.btn}
          onClick={handleCreate}
        >
          Create an Asset
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.btn}
          onClick={handleUpdate}
        >
          Update an Asset
        </Button>
      </div>
      <div style={{ width: "80%" }}>
        {sections.showAll ? <AllAssets /> : null}
        {sections.showOne ? <OneAsset /> : null}
        {sections.create ? <CreateAsset /> : null}
        {sections.update ? <UpdateAsset /> : null}
      </div>
    </div>
  );
};

export default Home;
