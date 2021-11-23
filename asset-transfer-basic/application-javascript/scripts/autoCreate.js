const axios = require("axios");
const generateSrn = require("./generateSrn");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const { Base64Encode } = require("base64-stream");
const CryptoJS = require("crypto-js");
const { v4: uuidv4 } = require("uuid");
const { Gateway, Wallets } = require("fabric-network");
const {
  buildWallet,
  buildCCPOrg1,
} = require("../../../test-application/javascript/AppUtil.js");
require("dotenv").config();
const encKey = "oWtjcvvcvzShoGPXYOEwGLmToiKvGszikpavNLyzMQtrBHZtXy";
const idDir = "./id";
const channelName = "mychannel";
const chaincodeName = "basic";
let args = process.argv;

const autoRegister = async (start, end) => {
  let wallet = await buildWallet(Wallets, "../wallet");
  const ccp = buildCCPOrg1();
  for (let i = start; i <= end; ++i) {
    const srn = generateSrn(i);
    try {
      const { data, status } = await axios.post(
        "http://localhost:5000/register",
        {
          userId: srn,
        }
      );
      if (status === 200) {
        if (!fs.existsSync(idDir)) {
          fs.mkdirSync(idDir);
        }
        fs.writeFileSync(`${idDir}/${srn}.id`, JSON.stringify(data));

        const doc = new PDFDocument();
        let finalString = "";
        let stream = doc.pipe(new Base64Encode());

        doc.fontSize(20).text(srn, 100, 100);
        doc.end();

        stream.on("data", function (chunk) {
          finalString += chunk;
        });

        stream.on("end", async function () {
          const gateway = new Gateway();
          try {
            await gateway.connect(ccp, {
              wallet,
              identity: srn,
              discovery: { enabled: true, asLocalhost: true },
            });

            const network = await gateway.getNetwork(channelName);
            const contract = network.getContract(chaincodeName);

            const transcript = finalString;
            const encTranscript = CryptoJS.AES.encrypt(transcript, encKey);
            const hash = CryptoJS.SHA256(transcript);

            const result = await contract.submitTransaction(
              "CreateAsset",
              uuidv4(),
              srn,
              encTranscript,
              hash.toString(CryptoJS.enc.Hex)
            );

            if (`${result}` !== "") {
              console.log(`Upload successful for ${srn}`);
            } else throw new Error();
            gateway.disconnect();
          } catch (error) {
            console.log(`Upload failed for ${srn}`);
            console.log(error);
            gateway.disconnect();
          }
        });
      } else throw new Error();
    } catch (error) {
      console.log(`Error in registering ${srn}`);
    }
  }
};

const startArg = parseInt(args[2]);
const endArg = parseInt(args[3]);

if (args.length === 4 && startArg >= 1 && endArg >= 1 && endArg >= startArg)
  autoRegister(startArg, endArg);
else console.log("Invalid arguments for start and end");
