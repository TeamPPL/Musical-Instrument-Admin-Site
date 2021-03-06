const { MongoClient } = require('mongodb');

const url = "mongodb://localhost:3000";
const uri = process.env.DB_URI;
const dbName = process.env.DB_NAME;

let client = new MongoClient(uri, { useUnifiedTopology: true});

let database;

async function connectDB() {
  try {
    await client.connect();
    console.log('DB connected!');
    //console.log(client);
    database = await client.db(dbName);
  }
  catch (err) {
      return console.log('Database Connection Error!', err.message);
  }
}

connectDB();

const db = () => database;

module.exports.db = db;