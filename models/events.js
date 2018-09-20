const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const eventsSchema = new Schema({
  eventName: String,
  date: String,
  description: String,
  address: String,
  participants: Array,
  comments: Array,
  Categories:String,
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

