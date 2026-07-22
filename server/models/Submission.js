import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    file: {
      public_id: String,
      url: { type: String, required: [true, 'Submission file is required'] },
      name: String,
    },
    marks: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'returned'],
      default: 'submitted',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    gradedAt: Date,
  },
  { timestamps: true }
);

// Prevent duplicate submissions
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
