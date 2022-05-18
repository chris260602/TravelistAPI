const express = require("express");
const {
  getAllNotification,
  sendNotificationToUser,
  sendNotificationToAll,
  deleteNotificationAll,
  deleteNotificationById,
  updateSeenNotification,
  deleteUserNotification,
  getNotificationByUserId,
  getNotReadNotificationByUserId,
} = require("../controllers/notificationController");

const router = express.Router();

router.route("/").get(getAllNotification);
router.route("/all").post(sendNotificationToAll);
router.route("/deleteall").delete(deleteNotificationAll);
router.route("/deleteusernotification").delete(deleteUserNotification);
router.route("/deletebyId").delete(deleteNotificationById);
router.route("/setseen").patch(updateSeenNotification);
router.route("/send").post(sendNotificationToUser);
router.route("/notread/:id").get(getNotReadNotificationByUserId);
router.route("/:id").get(getNotificationByUserId);

module.exports = router;
