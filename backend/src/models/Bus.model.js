const mongoose = require('mongoose');

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: [true, 'Bus number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    plateNumber: {
      type: String,
      required: [true, 'Plate number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    capacity: {
      type: Number,
      min: [1, 'Capacity must be at least 1'],
      default: null,
    },
    // The driver who registered/owns this bus.
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: [true, 'Bus must be linked to a driver'],
    },
    // Denormalised pointer to this bus's weekly schedule (kept in sync by route.controller.js).
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'maintenance', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bus', busSchema);
