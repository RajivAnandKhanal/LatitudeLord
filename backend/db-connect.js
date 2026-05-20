const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

async function connectToMongoDb(DBurl) {
  return mongoose.connect(DBurl);
}

module.exports = {
  connectToMongoDb,
};
