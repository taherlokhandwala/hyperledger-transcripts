import React, { useRef, useState, useEffect } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { updateAsset, readAllAssets } from "../API";

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

const UpdateAsset = () => {
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
  const [assets, setAssets] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState({});

  useEffect(() => {
    const getData = async () => {
      const data = await readAllAssets();
      if (data.status) {
        setAssets(data.data);
        if (data.data.length) {
          setSelectedAsset(data.data[0]);
        }
      } else setAssets([]);
    };
    getData();
  }, []);

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

    const data = await updateAsset(asset);
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

  const handleChange = (e) => {
    const newAsset = assets.find((asset) => asset.Record.ID === e.target.value);
    setSelectedAsset(newAsset);
    assetIDRef.current.getElementsByTagName("input")[0].value =
      newAsset.Record.ID;
    colorRef.current.getElementsByTagName("input")[0].value =
      newAsset.Record.Color;
    sizeRef.current.getElementsByTagName("input")[0].value =
      newAsset.Record.Size;
    ownerRef.current.getElementsByTagName("input")[0].value =
      newAsset.Record.Owner;
    appraisedValueRef.current.getElementsByTagName("input")[0].value =
      newAsset.Record.AppraisedValue;
  };

  return (
    <div className={classes.root}>
      {showMessage.show ? (
        <Paper elevation={2} className={classes.paperInfo}>
          {showMessage.msg}
        </Paper>
      ) : Array.isArray(assets) ? (
        assets.length && Object.keys(selectedAsset).length ? (
          <>
            <div className={classes.inputContainer}>
              <FormControl style={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-label">
                  Select Asset
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedAsset.Record.ID}
                  onChange={handleChange}
                >
                  {assets.map((asset) => (
                    <MenuItem key={asset.Record.ID} value={asset.Record.ID}>
                      {asset.Record.ID}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                ref={assetIDRef}
                label="Asset ID"
                className={classes.input}
                defaultValue={`${selectedAsset.Record.ID}`}
              />
              <TextField
                ref={colorRef}
                label="Color"
                className={classes.input}
                defaultValue={`${selectedAsset.Record.Color}`}
              />
              <TextField
                ref={sizeRef}
                label="Size"
                className={classes.input}
                defaultValue={`${selectedAsset.Record.Size}`}
              />
              <TextField
                ref={ownerRef}
                label="Owner"
                className={classes.input}
                defaultValue={`${selectedAsset.Record.Owner}`}
              />
              <TextField
                ref={appraisedValueRef}
                label="Appraised Value"
                className={classes.input}
                defaultValue={`${selectedAsset.Record.AppraisedValue}`}
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
                Updating Asset
              </Button>
            ) : (
              <Button
                className={classes.btn}
                size="small"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Update
              </Button>
            )}
          </>
        ) : (
          <Paper elevation={4} className={classes.paperInfo}>
            No assets stored in the ledger
          </Paper>
        )
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default UpdateAsset;
