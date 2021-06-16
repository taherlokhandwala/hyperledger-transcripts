//Express Server
const express = require("express");
const cors = require("cors");
require("dotenv").config();

//NodeSDK for Hyperledger Fabric
const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const {
  buildWallet,
  buildCCPOrg1,
} = require("../../test-application/javascript/AppUtil.js");
const channelName = "mychannel";
const chaincodeName = "basic";
const walletPath = path.join(__dirname, "wallet");
const org1UserId = "appUser";

//Web server configs
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());

//Hyperledger config
const ccp = buildCCPOrg1();

//API endpoints
app.get("/init_ledger", async (req, res) => {
  const gateway = new Gateway();
  try {
    const wallet = await buildWallet(Wallets, walletPath);
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);
    await contract.submitTransaction("InitLedger");
    res.status(200).json({
      msg: "Ledger initialised",
    });
  } catch (error) {
    res.status(500).json(error);
  } finally {
    gateway.disconnect();
  }
});

app.get("/get_assets", async (req, res) => {
  const gateway = new Gateway();
  try {
    const wallet = await buildWallet(Wallets, walletPath);
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);
    const result = await contract.evaluateTransaction("GetAllAssets");
    res.status(200).json(JSON.parse(result.toString()));
  } catch (error) {
    res.status(500).json(error);
  } finally {
    gateway.disconnect();
  }
});

app.get("/read_asset/:assetID", async (req, res) => {
  const gateway = new Gateway();
  try {
    const wallet = await buildWallet(Wallets, walletPath);
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);

    const result = await contract.evaluateTransaction(
      "ReadAsset",
      req.params.assetID
    );
    if (`${result}` !== "") {
      res.status(200).json(JSON.parse(result.toString()));
    } else throw new Error("Couldn't create asset");
  } catch (error) {
    res.status(500).json(error);
  } finally {
    gateway.disconnect();
  }
});

app.post("/create_asset", async (req, res) => {
  const gateway = new Gateway();
  try {
    const wallet = await buildWallet(Wallets, walletPath);
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);

    const result = await contract.submitTransaction(
      "CreateAsset",
      req.body.ID,
      req.body.color,
      req.body.size,
      req.body.owner,
      req.body.appraisedValue
    );
    if (`${result}` !== "") {
      res.status(200).json(JSON.parse(result.toString()));
    } else throw new Error("Couldn't create asset");
  } catch (error) {
    res.status(500).json(error);
  } finally {
    gateway.disconnect();
  }
});

app.post("/update_asset", async (req, res) => {
  const gateway = new Gateway();
  try {
    const wallet = await buildWallet(Wallets, walletPath);
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);

    await contract.submitTransaction(
      "UpdateAsset",
      req.body.ID,
      req.body.color,
      req.body.size,
      req.body.owner,
      req.body.appraisedValue
    );
    res.status(200).json({
      msg: `${req.body.ID} has been updated`,
    });
  } catch (error) {
    res.status(500).json(error);
  } finally {
    gateway.disconnect();
  }
});

app.listen(PORT, () => console.log(`Server running on PORT : ${PORT}`));
