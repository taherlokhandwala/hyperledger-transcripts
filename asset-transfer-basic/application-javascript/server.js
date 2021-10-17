/*
 * Express Server Utils
 */

const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { merge } = require("merge-pdf-buffers");
require("dotenv").config();

/*
 * NodeSDK for Hyperledger Fabric
 */

const { Gateway, Wallets } = require("fabric-network");
const {
  buildWallet,
  buildCCPOrg1,
} = require("../../test-application/javascript/AppUtil.js");
const FabricCAServices = require("fabric-ca-client");
const {
  registerUser,
  getAllUsers,
  buildCAClient,
} = require("../../test-application/javascript/CAUtil");

/*
 * Web server configs
 */

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(cors());

/*
 * Hyperledger Fabric Blockchain configs
 */

const channelName = "mychannel";
const chaincodeName = "basic";
const walletPath = path.join(__dirname, "wallet");
const org1UserId = "appUser";
const mspOrg1 = "Org1MSP";
const secretKey = "secretkey";
let wallet;
const ccp = buildCCPOrg1();
const caClient = buildCAClient(FabricCAServices, ccp, "ca.org1.example.com");
const initWallet = async () => {
  wallet = await buildWallet(Wallets, walletPath);
};
initWallet();

/*
 * API endpoints
 */

app.post("/create/asset", async (req, res) => {
  const gateway = new Gateway();
  try {
    await gateway.connect(ccp, {
      wallet,
      identity: req.body.srn,
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);

    const result = await contract.submitTransaction(
      "CreateAsset",
      uuidv4(),
      req.body.srn,
      req.files.transcript.data.toString("base64")
    );
    if (`${result}` !== "") {
      res.status(200).json({ message: "Transcript uploaded successfully" });
    } else throw new Error("Couldn't upload transcript");
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  } finally {
    gateway.disconnect();
  }
});

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    req.token = bearerHeader.split(" ")[1];
    next();
  } else {
    res.status(403).json({ message: "Invalid token" });
  }
};

app.get("/get/assets", verifyToken, async (req, res) => {
  const gateway = new Gateway();
  try {
    const authData = jwt.verify(req.token, secretKey);
    await gateway.connect(ccp, {
      wallet,
      identity: authData.username,
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);

    const result = await contract.evaluateTransaction(
      "GetAllAssets",
      authData.username
    );
    const record = JSON.parse(result);
    const transcripts = [];
    const ids = [];
    for (let i of record) {
      transcripts.push(Buffer.from(i.transcript, "base64"));
      ids.push(i.ID);
    }
    console.log(ids);
    const mergedBuffers = await merge(transcripts);
    res.status(200).json({
      transcripts: mergedBuffers,
      username: authData.username,
      ids,
    });
  } catch (error) {
    res.status(403).json({
      message: error.message,
    });
  } finally {
    gateway.disconnect();
  }
});

app.post("/login", async (req, res) => {
  try {
    const keyFile = req.files.key;
    const data = keyFile.data.toString();
    const dataObject = JSON.parse(data);
    const pathToWrite = path.join(
      __dirname,
      "wallet",
      `${dataObject.username}.id`
    );
    fs.writeFileSync(pathToWrite, data);
    const gateway = new Gateway();

    await gateway.connect(ccp, {
      wallet,
      identity: dataObject.username,
      discovery: { enabled: true, asLocalhost: true },
    });

    jwt.sign({ username: dataObject.username }, secretKey, (err, token) => {
      if (err) throw new Error("Error occured");
      else {
        res.status(200).json({
          token,
        });
      }
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.post("/register", async (req, res) => {
  try {
    const data = await registerUser(
      caClient,
      wallet,
      mspOrg1,
      req.body.userId,
      "org1.department1"
    );
    if (typeof data !== "undefined") res.status(200).json(data);
    else throw new Error("error occured");
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.get("/get/users", async (req, res) => {
  try {
    const data = await getAllUsers(wallet);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.get("/verify/:id", async (req, res) => {
  const gateway = new Gateway();
  try {
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);

    const result = await contract.evaluateTransaction(
      "VerifyId",
      req.params.id
    );

    const record = JSON.parse(result);

    if (record.status) {
      res.status(200).json({
        status: true,
        srn: record.srn,
      });
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  } finally {
    gateway.disconnect();
  }
});

// ! Extra endpoints. To be deleted soon.
app.get("/init_ledger", async (req, res) => {
  const gateway = new Gateway();
  try {
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

app.get("/read_asset/:assetID", async (req, res) => {
  const gateway = new Gateway();
  try {
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

app.post("/update_asset", async (req, res) => {
  const gateway = new Gateway();
  try {
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
