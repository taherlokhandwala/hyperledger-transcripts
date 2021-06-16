import axios from "axios";

const baseURL = "http://localhost:5000";

export const InitialiseLedger = async () => {
  try {
    const { status } = await axios.get(`${baseURL}/init_ledger`);
    if (status === 200) return { init: true };
    else throw new Error("Init failed");
  } catch (error) {
    return {
      init: false,
    };
  }
};

export const readAllAssets = async () => {
  try {
    const { data, status } = await axios.get(`${baseURL}/get_assets`);
    if (status === 200)
      return {
        status: true,
        data,
      };
    else throw new Error("Failed");
  } catch (error) {
    return {
      status: false,
    };
  }
};

export const readOneAsset = async (assetID) => {
  try {
    const { data, status } = await axios.get(
      `${baseURL}/read_asset/${assetID}`
    );
    if (status === 200)
      return {
        status: true,
        data,
      };
    else throw new Error("Failed");
  } catch (error) {
    return {
      status: false,
    };
  }
};

export const createAsset = async (asset) => {
  try {
    const { status } = await axios.post(`${baseURL}/create_asset`, asset);
    if (status === 200)
      return {
        status: true,
        data: { msg: "Asset created successfully" },
      };
    else throw new Error("Failed");
  } catch (error) {
    return {
      status: false,
      data: { msg: "Couldn't create an asset" },
    };
  }
};

export const updateAsset = async (asset) => {
  try {
    const { data, status } = await axios.post(`${baseURL}/update_asset`, asset);
    if (status === 200)
      return {
        status: true,
        data,
      };
    else throw new Error("Failed");
  } catch (error) {
    return {
      status: false,
      msg: "Couldn't update asset",
    };
  }
};
