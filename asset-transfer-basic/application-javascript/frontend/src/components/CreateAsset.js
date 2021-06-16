import React, { useRef, useState } from "react";
import { TextField, Button, CircularProgress, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { createAsset } from "../API";

const useStyles = makeStyles({
  root: {
    width: "100%",
    marginTop: 30,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
  },
  input: {
    marginTop: 10,
  },
  paperInfo: {
    textAlign: "center",
    marginTop: 20,
    padding: "5px 30px",
    background: "#FFF3CD",
    color: "#856412",
    fontWeight: 600,
  },
  btn: {
    marginTop: 20,
  },
});

const CreateAsset = () => {
  const classes = useStyles();
  const assetIDRef = useRef();
  const colorRef = useRef();
  const sizeRef = useRef();
  const ownerRef = useRef();
  const appraisedValueRef = useRef();
  const [showMessage, setShowMessage] = useState({
    show: false,
    msg: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const asset = {
      ID: assetIDRef.current.getElementsByTagName("input")[0].value,
      color: colorRef.current.getElementsByTagName("input")[0].value,
      size: sizeRef.current.getElementsByTagName("input")[0].value,
      owner: ownerRef.current.getElementsByTagName("input")[0].value,
      appraisedValue:
        appraisedValueRef.current.getElementsByTagName("input")[0].value,
    };

    const data = await createAsset(asset);
    if (data.status) {
      setShowMessage({
        show: true,
        msg: data.data.msg,
      });
    } else {
      setShowMessage({
        show: true,
        msg: data.data.msg,
      });
    }
    setLoading(false);
  };

  return (
    <div className={classes.root}>
      {showMessage.show ? (
        <Paper elevation={2} className={classes.paperInfo}>
          {showMessage.msg}
        </Paper>
      ) : (
        <>
          <div className={classes.inputContainer}>
            <TextField ref={assetIDRef} label="Asset ID" />
            <TextField ref={colorRef} label="Color" className={classes.input} />
            <TextField ref={sizeRef} label="Size" className={classes.input} />
            <TextField ref={ownerRef} label="Owner" className={classes.input} />
            <TextField
              ref={appraisedValueRef}
              label="Appraised Value"
              className={classes.input}
            />
          </div>
          {loading ? (
            <Button
              className={classes.btn}
              size="small"
              variant="contained"
              color="primary"
              disabled={true}
              startIcon={
                <CircularProgress size={26} style={{ color: "#fff" }} />
              }
            >
              Creating Asset
            </Button>
          ) : (
            <Button
              className={classes.btn}
              size="small"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Create
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default CreateAsset;
