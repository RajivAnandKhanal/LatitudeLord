// TODO: Week 7 — in-memory MongoDB setup with jest + supertest
// Example with mongodb-memory-server:
//
// const { MongoMemoryServer } = require('mongodb-memory-server');
// const mongoose = require('mongoose');
//
// let mongo;
//
// beforeAll(async () => {
//   mongo = await MongoMemoryServer.create();
//   await mongoose.connect(mongo.getUri());
// });
//
// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongo.stop();
// });
//
// afterEach(async () => {
//   const collections = await mongoose.connection.db.collections();
//   for (const col of collections) await col.deleteMany({});
// });
