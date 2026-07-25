const mongoose = require('mongoose');

// A single GPS point recorded during an ongoing journey.
const snapshotSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
    speedKmh: { type: Number, default: 0, min: 0 },
    recordedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const pointSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
  },
  { _id: false }
);

// ── Journey — ML training data ──────────────────────────────────────────────────
// Opens when an authenticated passenger boards a bus, records GPS snapshots
// until they disembark, then feeds mlDataExport.job.js for the ML pipeline.
const journeySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user is required'],
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: [true, 'bus is required'],
    },
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'cancelled'],
      default: 'ongoing',
    },
    startLocation: { type: pointSchema, required: true },
    endLocation: { type: pointSchema, default: null },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },
    durationMinutes: { type: Number, default: null },
    distanceKm: { type: Number, default: null },
    snapshots: { type: [snapshotSchema], default: [] },
    // Flipped by mlDataExport.job.js once this journey has been shipped to the ML pipeline.
    exportedForML: { type: Boolean, default: false },
  },
  { timestamps: true }
);

journeySchema.index({ user: 1, status: 1 });
journeySchema.index({ bus: 1, status: 1 });
journeySchema.index({ status: 1, exportedForML: 1 });

module.exports = mongoose.model('Journey', journeySchema);
