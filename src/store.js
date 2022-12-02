import { writable } from "svelte/store";
import "./appwrite.js";

const sdk = require("node-appwrite");
export const client = new sdk.Client();
export const users = new sdk.Users(client);
export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const query = sdk.Query;

export const getUserName = async (user_id) => {
  let query = databases.getDocument("633fe0ac171c362df477", "633fe0baf186f65a0376", user_id);
  query.then(
    (r) => {
        return "agaegae";
    },
    (e) => {
        return "error";
    }
  );
  
};
