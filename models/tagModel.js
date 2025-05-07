import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A name is required"],
    lowercase: true,
    trim: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  note: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

export default mongoose.model("Tag", TagSchema);
