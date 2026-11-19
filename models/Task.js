const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    lead: {
      type: String,
      required: true,
      trim: true
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: false
    },
    dueDate: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Done'],
      default: 'Pending'
    },
    assignedTo: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
