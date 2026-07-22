import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
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
    video: {
      public_id: String,
      url: { type: String, default: '' },
      duration: String,
    },
    pdf: {
      public_id: String,
      url: { type: String, default: '' },
    },
    attachments: [
      {
        name: String,
        public_id: String,
        url: String,
      },
    ],
    duration: {
      type: String,
      default: '0m',
    },
    order: {
      type: Number,
      default: 0,
    },
    isFreePreview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
