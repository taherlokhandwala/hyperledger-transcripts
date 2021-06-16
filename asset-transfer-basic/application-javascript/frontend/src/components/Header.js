import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  header: {
    height: "10vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
  },
}));

const Header = () => {
  const classes = useStyles();
  return (
    <header className={classes.header}>
      <Typography variant="h4">Transcripts Processing</Typography>
    </header>
  );
};

export default Header;
