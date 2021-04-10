const User = require("../models/user");

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

  // for (const [key, value] of Object.entries(user)) {
  //   if (value == null) {
  //     return res.status(400).json({
  //       error: { message: `Missing '${key}' in request body.` },
  //     });
  //   }
  // }
  // call RegisterService.insertRegisterUser();

  // register user
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

module.exports = register;
