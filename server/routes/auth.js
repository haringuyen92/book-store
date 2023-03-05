const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password)
      return res.json({ status: "bad", msg: "missing parameter" });
    username = username.trim().toLowerCase();
    password = password.trim().toLowerCase();

    if (username.length < 5)
      return res.json({ status: "bad", msg: "username min length 5" });
    if (username.length > 20)
      return res.json({ status: "bad", msg: "username max length 20" });
    if (password.length > 20)
      return res.json({ status: "bad", msg: "password max length 20" });

    const existUser = await User.findOne({ username });
    if (existUser) return res.json({ status: "bad", msg: "exist User" });

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPass,
    });
    const token = await jwt.sign({ user: newUser }, "tokensecret");

    return res.json({
      status: "OK",
      msg: "success user register",
      user: newUser,
      token,
    });
  } catch (error) {
    return res.json({ status: "bad request", msg: error.message });
  }
});
router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) return res.json({ status: "bad", msg: "missing parameter" });

    const existUser = await User.findOne({ username });

    if (!existUser) return res.json({ status: "bad", msg: "user not exist" });

    const comparedPass = await bcrypt.compare(password, existUser.password);
    if (!comparedPass)
      return res.json({ status: "bad", msg: "user and password not matching" });

    const token = await jwt.sign({ user: existUser }, "tokensecret");

    return res.json({
      status: "OK",
      msg: "success user login",
      user: existUser,
      token,
    });

  } catch (error) {
    return res.json({ status: "bad request" });
  }
});

module.exports = router;
