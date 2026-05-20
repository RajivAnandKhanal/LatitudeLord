const express = require("express");
const router = express.Router();
const { handleUserSignUp } = require("../controllers/userController");

router.post("/", handleUserSignUp);
// router.get("/")

module.exports = router;
