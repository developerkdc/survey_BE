import mongoose from "mongoose";

const surveySchema = new mongoose.Schema({
  survey_name: {
    type: String,
    required: [true, "Survey name is required."],
    indexedDB: true,
    trim: true,
    unique: [true, "Survey name already exist."],
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const surveyModel = mongoose.model("mall", surveySchema);
export default surveyModel;
