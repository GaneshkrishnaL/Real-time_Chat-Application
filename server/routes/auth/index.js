const router = require("express").Router();
const {
  registerUserController,
  loginUserController,
  getUserController,
  getUsersController,
  updateUserController,
} = require("../../controllers/auth");
const verifyUser = require("../../middlewares/verifyUser");

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/user", verifyUser, getUserController);
router.patch("/user", verifyUser, updateUserController);
router.get("/users", verifyUser, getUsersController);

module.exports = router;
