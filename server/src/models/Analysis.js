import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    userInput: {
      type: String,
      required: true,
      trim: true,
    },
    aiOutput: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Analysis =
  mongoose.models.Analysis || mongoose.model("Analysis", analysisSchema);

export default Analysis;
