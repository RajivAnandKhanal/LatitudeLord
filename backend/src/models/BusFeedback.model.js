const mongoose = require('mongoose');

// Deliberately has NO user/sender reference of any kind — feedback is
// anonymous by design (see initial_system_design.txt: "all message are
// sent anonymously"). Do not add a submitter field here without a product
// conversation first, since that would break the anonymity guarantee.
const busFeedbackSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [1000, 'Message must be at most 1000 characters'],
    },
    status: {
      type: String,
      enum: ['open', 'reviewed', 'resolved'],
      default: 'open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BusFeedback', busFeedbackSchema);
