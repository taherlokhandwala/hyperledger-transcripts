import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { readAllAssets } from "../API";
import {
  FormControl,
  InputLabel,
  Select,
  Paper,
  Typography,
  CircularProgress,
  MenuItem,
} from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: "100%",
    marginTop: 30,
    textAlign: "center",
  },
  paperInfo: {
    textAlign: "center",
    marginTop: 20,
    padding: "5px 30px",
    background: "#FFF3CD",
    color: "#856412",
    fontWeight: 600,
  },
  paperData: {
    textAlign: "center",
    marginTop: 30,
    padding: "5px 30px",
    fontWeight: 600,
    background: "#CCE5FE",
    color: "#004088",
  },
});

const OneAsset = () => {
  const classes = useStyles();
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

  const handleChange = (e) => {
    const newAsset = assets.find((asset) => asset.Record.ID === e.target.value);
    setSelectedAsset(newAsset);
  };

  return (
    <div className={classes.root}>
      {Array.isArray(assets) ? (
        assets.length && Object.keys(selectedAsset).length ? (
          <>
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
            <Paper elevation={2} className={classes.paperData}>
              <Typography variant="body1">
                <>
                  <strong>Asset ID</strong> : {selectedAsset.Record.ID}
                </>
              </Typography>
              <Typography variant="body1">
                <>
                  <strong>Color</strong> : {selectedAsset.Record.Color}
                </>
              </Typography>
              <Typography variant="body1">
                <>
                  <strong>Size</strong> : {selectedAsset.Record.Size}
                </>
              </Typography>
              <Typography variant="body1">
                <>
                  <strong>Owner</strong> : {selectedAsset.Record.Owner}
                </>
              </Typography>
              <Typography variant="body1">
                <>
                  <strong>Appraised Value</strong> :{" "}
                  {selectedAsset.Record.AppraisedValue}
                </>
              </Typography>
            </Paper>
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

export default OneAsset;
