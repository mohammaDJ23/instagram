const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const DATABASE_URL =
  "mongodb+srv://mohammad-75:ZoIuMpkaDUTpKfRF@cluster0.zp1rc.mongodb.net/INS_APP?retryWrites=true&w=majority";

let _db;
let cli;

const mongoConnect = async callback => {
  try {
    const client = await MongoClient.connect(DATABASE_URL);
    _db = client.db();
    cli = client;
    console.log("database is connected");
    callback();
  } catch (error) {
    callback(error);
  }
};

const db = () => {
  if (_db) return _db;
  throw "no database found!";
};

const client = () => {
  if (cli) return cli;
  throw "no session found!";
};

module.exports = { mongoConnect, db, client };
