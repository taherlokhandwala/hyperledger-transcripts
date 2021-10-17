const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
} = require("../../test-application/javascript/CAUtil.js");
const {
  buildCCPOrg1,
  buildWallet,
} = require("../../test-application/javascript/AppUtil.js");
const mspOrg1 = "Org1MSP";
const walletPath = path.join(__dirname, "wallet");
const org1UserId = "appUser";

const enroll = async () => {
  try {
    const ccp = buildCCPOrg1();
    const caClient = buildCAClient(
      FabricCAServices,
      ccp,
      "ca.org1.example.com"
    );
    const wallet = await buildWallet(Wallets, walletPath);
    await enrollAdmin(caClient, wallet, mspOrg1);
    // await registerAndEnrollUser(
    //   caClient,
    //   wallet,
    //   mspOrg1,
    //   org1UserId,
    //   "org1.department1"
    // );
    // await registerAndEnrollUser(
    //   caClient,
    //   wallet,
    //   mspOrg1,
    //   "appUser2",
    //   "org1.department1"
    // );
  } catch (error) {
    console.error(`******** FAILED to run the application: ${error}`);
  }
};

enroll();
