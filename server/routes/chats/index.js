const router = require("express").Router();
const {
  addChatController,
  getChatsController,
} = require("../../controllers/chats");
const verifyUser = require("../../middlewares/verifyUser");

router.get("/", verifyUser, getChatsController);
router.post("/", verifyUser, addChatController);

module.exports = router;
