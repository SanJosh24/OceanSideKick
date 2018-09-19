const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const eventsSchema = new Schema({
  name: String,
  date: String,
  description: String,
  location: String,
  participants: Array,
  comments: Array,
  picture: String,
  creatorId: String
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Events = mongoose.model("Events", eventsSchema);

module.exports = Events;