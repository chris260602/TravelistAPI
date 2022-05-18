const mongoose = require("mongoose");
let ObjectId = mongoose.Types.ObjectId;
const notificationSchema = new mongoose.Schema({
  userID: {
    type: ObjectId,
    ref: "User",
    required: [true, "Must Include User ID"],
  },
  type: {
    type: String,
    required: [true, "Must Include Type"],
  },
  title: {
    type: String,
    required: [true, "Must Include Title"],
  },
  content: {
    type: String,

    required: [true, "Must Include Content"],
  },
  seen: {
    type: Boolean,
    default: false,
    required: [true, "Must Include Seen"],
  },
  timeSent: {
    type: Date,
    required: [true, "Date needed"],
    default: Date(Date.now()),
  },
});

const notifications = mongoose.model("Notification", notificationSchema);

module.exports = notifications;
