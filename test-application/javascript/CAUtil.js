"use strict";

const adminUserId = "admin";
const adminUserPasswd = "adminpw";

const fs = require("fs");
const path = require("path");

/**
 *
 * @param {*} FabricCAServices
 * @param {*} ccp
 */
exports.buildCAClient = (FabricCAServices, ccp, caHostName) => {
  const caInfo = ccp.certificateAuthorities[caHostName];
  const caTLSCACerts = caInfo.tlsCACerts.pem;
  const caClient = new FabricCAServices(
    caInfo.url,
    { trustedRoots: caTLSCACerts, verify: false },
    caInfo.caName
  );

  console.log(`Built a CA Client named ${caInfo.caName}`);
  return caClient;
};

exports.enrollAdmin = async (caClient, wallet, orgMspId) => {
  try {
    const identity = await wallet.get(adminUserId);
    if (identity) {
      console.log(
        "An identity for the admin user already exists in the wallet"
      );
      return;
    }

    const enrollment = await caClient.enroll({
      enrollmentID: adminUserId,
      enrollmentSecret: adminUserPasswd,
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspId,
      type: "X.509",
    };
    await wallet.put(adminUserId, x509Identity);
    console.log(
      "Successfully enrolled admin user and imported it into the wallet"
    );
  } catch (error) {
    console.error(`Failed to enroll admin user : ${error}`);
  }
};

exports.registerAndEnrollUser = async (
  caClient,
  wallet,
  orgMspId,
  userId,
  affiliation
) => {
  try {
    const userIdentity = await wallet.get(userId);
    if (userIdentity) {
      console.log(
        `An identity for the user ${userId} already exists in the wallet`
      );
      return;
    }

    const adminIdentity = await wallet.get(adminUserId);
    if (!adminIdentity) {
      console.log(
        "An identity for the admin user does not exist in the wallet"
      );
      console.log("Enroll the admin user before retrying");
      return;
    }

    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

    const secret = await caClient.register(
      {
        affiliation: affiliation,
        enrollmentID: userId,
        role: "client",
      },
      adminUser
    );

    const enrollment = await caClient.enroll({
      enrollmentID: userId,
      enrollmentSecret: secret,
    });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspId,
      type: "X.509",
      version: 1,
      username: userId,
    };

    const data = JSON.stringify(x509Identity);
    const pathToWrite = path.join(
      __dirname,
      "..",
      "..",
      "asset-transfer-basic",
      "application-javascript",
      "wallet",
      `${userId}.id`
    );

    fs.writeFileSync(pathToWrite, data);

    //await wallet.put(userId, x509Identity);
    console.log(
      `Successfully registered and enrolled user ${userId} and imported it into the wallet`
    );
  } catch (error) {
    console.error(`Failed to register user : ${error}`);
  }
};

exports.registerUser = async (
  caClient,
  wallet,
  orgMspId,
  userId,
  affiliation
) => {
  try {
    const userIdentity = await wallet.get(userId);
    if (userIdentity) {
      console.log(
        `An identity for the user ${userId} already exists in the wallet`
      );
      return;
    }

    const adminIdentity = await wallet.get(adminUserId);
    if (!adminIdentity) {
      console.log(
        "An identity for the admin user does not exist in the wallet"
      );
      console.log("Enroll the admin user before retrying");
      return;
    }

    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

    const secret = await caClient.register(
      {
        affiliation: affiliation,
        enrollmentID: userId,
        role: "client",
      },
      adminUser
    );

    const enrollment = await caClient.enroll({
      enrollmentID: userId,
      enrollmentSecret: secret,
    });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspId,
      type: "X.509",
      version: 1,
      username: userId,
    };

    await wallet.put(userId, x509Identity);
    console.log(
      `Successfully registered and enrolled user ${userId} and imported it into the wallet`
    );
    return x509Identity;
  } catch (error) {
    console.error(`Failed to register user : ${error}`);
  }
};

exports.getAllUsers = async (wallet) => {
  try {
    let users = await wallet.list();
    users = users.filter((user) => user !== "admin");
    return users;
  } catch (error) {
    return [];
  }
};
