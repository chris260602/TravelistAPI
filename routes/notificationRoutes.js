const express = require("express");
const {
  getAllNotification,
  getNotificationById,
  sendNotificationToUser,
  sendNotificationToAll,
  deleteNotificationAll,
  deleteNotificationById,
  updateSeenNotification,
  deleteUserNotification,
} = require("../controllers/notificationController");

const router = express.Router();

router.route("/").get(getAllNotification);
router.route("/all").post(sendNotificationToAll);
router.route("/deleteall").delete(deleteNotificationAll);
router.route("/deleteusernotification").delete(deleteUserNotification);
router.route("/deletebyId").delete(deleteNotificationById);
router.route("/setseen").patch(updateSeenNotification);
router.route("/send").post(sendNotificationToUser);
router.route("/:id").get(getNotificationById);

module.exports = router;
