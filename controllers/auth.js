const User = require("../models/user");

const jwt = require("jsonwebtoken");

// REGISTER USER ======================
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // validation
  if (!name) return res.status(400).send("Name is required");
  if (!password || password.length < 6)
    return res
      .status(400)
      .send("Password is required and should be minimum 6 characters long");

  let userExist = await User.findOne({ email: email });
  if (userExist) return res.status(400).send("Email is already taken");

  // save user
  const user = new User(req.body);
  try {
    await user.save();
    console.log("USER CREATED", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log("Create User failed", err);
    return res.status(400).send("Error. Try again!");
  }
};

// LOGIN USER =====================
const login = async (req, res) => {
  const { email } = req.body;

  // check if user exist
  let user = await User.findOne({ email }).exec();
  console.log("USER EXIST: ", user);
  if (!user) res.status(400).send("User not found!");

  user.comparePassword(req.body.password, (err, match) => {
    console.log("COMPARED ERROR", err);
    if (!match) {
      return res.status(400).send("Wrong password!");
    }
    let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, user });
  });
};

module.exports = { register, login };
