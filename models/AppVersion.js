import mongoose from "mongoose";

const appVersionSchema = new mongoose.Schema({
  version: {
    type: String,
    required: true,
  },
  apkUrl: {
    type: String,
    required: true,
  },
  changelog: {
    type: String,
    default: "",
  },
  forceUpdate: {
    type: Boolean,
    default: false,
  },
  releaseDate: {
    type: Date,
    default: Date.now,
  },
});

const AppVersion = mongoose.model("AppVersion", appVersionSchema);

export { AppVersion};
