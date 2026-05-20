const USER = require("../models/usersModel");

async function handleUserSignUp(req, res) {
  const { name, email, password } = req.body;

  await USER.create({
    name,
    email,
    password,
  });

  return res.status(201).json({ Message: "User Created" });
}

module.exports = { handleUserSignUp };
