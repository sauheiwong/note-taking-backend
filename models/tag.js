const mongoose = require("mongoose");
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
    ref: "User",
    required: true,
  },
  note: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

const Tag = mongoose.model("Tag", TagSchema);

module.exports = Tag;
