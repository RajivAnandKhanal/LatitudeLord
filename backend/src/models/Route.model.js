const mongoose = require('mongoose');
const { DAYS_OF_WEEK } = require('../config/constants');

// ── Station sub-schema ──────────────────────────────────────────────────────────
const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Station name is required'],
      trim: true,
    },
    lat: {
      type: Number,
      required: [true, 'Station latitude is required'],
      min: -90,
      max: 90,
    },
    lng: {
      type: Number,
      required: [true, 'Station longitude is required'],
      min: -180,
      max: 180,
    },
  },
  { _id: false }
);

// ── One day's worth of stations, in stop order ─────────────────────────────────
const daySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: DAYS_OF_WEEK,
      required: [true, 'Day is required'],
    },
    stations: {
      type: [stationSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 2,
        message: 'Each day needs at least 2 stations (start and end)',
      },
    },
  },
  { _id: false }
);

// ── Route — the 7-day weekly schedule for a single bus ─────────────────────────
const routeSchema = new mongoose.Schema(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: [true, 'busId is required'],
      unique: true, // one weekly schedule per bus
    },
    schedule: {
      type: [daySchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Route', routeSchema);
