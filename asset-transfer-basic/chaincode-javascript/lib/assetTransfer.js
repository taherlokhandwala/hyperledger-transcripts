"use strict";

const { Contract } = require("fabric-contract-api");

class AssetTransfer extends Contract {
  async InitLedger(ctx) {
    const assets = [
      {
        ID: "asset1",
        Color: "blue",
        Size: 5,
        Owner: "Tomoko",
        AppraisedValue: 300,
      },
      {
        ID: "asset2",
        Color: "red",
        Size: 5,
        Owner: "Brad",
        AppraisedValue: 400,
      },
      {
        ID: "asset3",
        Color: "green",
        Size: 10,
        Owner: "Jin Soo",
        AppraisedValue: 500,
      },
      {
        ID: "asset4",
        Color: "yellow",
        Size: 10,
        Owner: "Max",
        AppraisedValue: 600,
      },
      {
        ID: "asset5",
        Color: "black",
        Size: 15,
        Owner: "Adriana",
        AppraisedValue: 700,
      },
      {
        ID: "asset6",
        Color: "white",
        Size: 15,
        Owner: "Michel",
        AppraisedValue: 800,
      },
    ];

    for (const asset of assets) {
      asset.docType = "asset";
      await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));
      console.info(`Asset ${asset.ID} initialized`);
    }
  }

  async CreateAsset(ctx, id, srn, transcript, hash) {
    const asset = JSON.stringify({
      ID: id,
      srn,
      transcript,
      hash,
      verified: false,
    });
    console.log(asset);
    await ctx.stub.putState(id, Buffer.from(asset));
    return JSON.stringify(asset);
  }

  async GetAllAssets(ctx, srn) {
    const allResults = [];
    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      try {
        const record = JSON.parse(strValue);
        if (record.srn === srn) allResults.push(record);
      } catch (err) {
        console.log(err);
      }
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }

  async VerifyTranscript(ctx, hash) {
    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      try {
        const record = JSON.parse(strValue);
        if (record.hash === hash)
          return JSON.stringify({
            status: true,
            srn: record.srn,
          });
      } catch (err) {
        return JSON.stringify({
          status: false,
        });
      }
      result = await iterator.next();
    }
    return JSON.stringify({
      status: false,
    });
  }

  async UpdateAsset(ctx, id) {
    const exists = await this.AssetExists(ctx, id);
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }

    const asset = await ctx.stub.getState(id);
    const assetJSON = JSON.parse(asset);
    assetJSON.verified = true;

    return ctx.stub.putState(id, Buffer.from(JSON.stringify(assetJSON)));
  }

  async DeleteAsset(ctx, id) {
    const exists = await this.AssetExists(ctx, id);
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }
    return ctx.stub.deleteState(id);
  }

  async AssetExists(ctx, id) {
    const assetJSON = await ctx.stub.getState(id);
    return assetJSON && assetJSON.length > 0;
  }

  /*
  ! Extra Chaincode function. To be deleted soon. 
  */

  async ReadAsset(ctx, id) {
    const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
    if (!assetJSON || assetJSON.length === 0) {
      throw new Error(`The asset ${id} does not exist`);
    }
    return assetJSON.toString();
  }

  async TransferAsset(ctx, id, newOwner) {
    const assetString = await this.ReadAsset(ctx, id);
    const asset = JSON.parse(assetString);
    asset.Owner = newOwner;
    return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
  }
}

module.exports = AssetTransfer;
