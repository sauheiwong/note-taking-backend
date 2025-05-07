import mongoose from "mongoose";
const Schema = mongoose.Schema;

const FolderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A name is required"],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  note: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
  parentFolder: {
    type: Schema.Types.ObjectId,
    ref: "Folder",
    default: null,
  },
  subFolders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Folder",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

FolderSchema.pre("save", (next) => {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("Folder", FolderSchema);
