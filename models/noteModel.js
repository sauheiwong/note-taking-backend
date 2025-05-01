import mongoose from "mongoose";
const Schema = mongoose.Schema;

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Title",
  },
  content: {
    type: String,
  },
  tag: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  editer: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  viewer: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  parentFolder: {
    type: Schema.Types.ObjectId,
    ref: "Folder",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

NoteSchema.pre("save", (next) => {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("Note", NoteSchema);
