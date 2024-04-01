// Replace the uri string with your connection string.

import { MongoClient } from "mongodb";
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@portfolio.tnhj30s.mongodb.net/?retryWrites=true&w=majority&appName=portfolio`;
const client = new MongoClient(uri);

async function dbConn() {
  const database = client.db("portfoliodb");
  const contacts = database.collection("contacts");

  return contacts;
  // const movie = await movies.findOne();
}

export default dbConn;
