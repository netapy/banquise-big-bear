import { writable } from 'svelte/store';
import './appwrite.js';

const sdk = require("node-appwrite");
export const client = new sdk.Client();
export const users = new sdk.Users(client);
export const databases = new sdk.Databases(client);
