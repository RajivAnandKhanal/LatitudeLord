const mongoose = require('mongoose');

// ── BusLocation — one document per bus, holding its latest known position ──────
// Historical pings aren't kept here (that's what ML export jobs are for later);
// this collection is a fast-lookup "current state" table, upserted on every ping.
const busLocationSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: [true, 'bus is required'],
      unique: true,
    },
    lat: {
      type: Number,
      required: [true, 'lat is required'],
      min: -90,
      max: 90,
    },
    lng: {
      type: Number,
      required: [true, 'lng is required'],
      min: -180,
      max: 180,
    },
    speedKmh: {
      type: Number,
      default: 0,
      min: 0,
    },
    heading: {
      type: Number, // degrees, 0-360
      default: null,
      min: 0,
      max: 360,
    },
    // Updated on every ping, independent of `updatedAt`, so a job can query it
    // even if other fields are later touched without a real GPS fix.
    lastPingAt: {
      type: Date,
      default: Date.now,
    },
    isOnline: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

busLocationSchema.index({ lastPingAt: 1 });

module.exports = mongoose.model('BusLocation', busLocationSchema);
