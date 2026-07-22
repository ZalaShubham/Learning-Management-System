import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
  },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, default: false },
    },
  ],
  explanation: {
    type: String,
    default: '',
  },
  points: {
    type: Number,
    default: 1,
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questions: [questionSchema],
    duration: {
      type: Number, // in minutes
      required: [true, 'Quiz duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    passingScore: {
      type: Number,
      default: 50, // percentage
    },
    attempts: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        answers: [
          {
            questionIndex: Number,
            selectedOptions: [Number],
          },
        ],
        score: Number,
        percentage: Number,
        passed: Boolean,
        completedAt: { type: Date, default: Date.now },
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-calculate total points
quizSchema.pre('save', function (next) {
  if (this.questions && this.questions.length > 0) {
    this.totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0);
  }
  next();
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
