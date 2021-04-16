// app/models/user.js
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var findOrCreate = require("mongoose-findorcreate");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is required",
    },
    email: {
      type: String,
      trim: true,
      required: "Email is required",
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 64,
    },
    stripe_account_id: "",
    stripe_seller: {},
    stripeSession: {},
  },
  { timestamps: true }
);

// methods ===============

// save or create a user
// using mongoose middlware that will auto hash the pass before it's saved.
userSchema.pre("save", function (next) {
  let user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt for the password
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

// check if password isValid
userSchema.methods.comparePassword = function (password, next) {
  bcrypt.compare(password, this.password, function (error, match) {
    if (error) {
      console.log("COMPARE PASSWORD ERROR", error);
      return next(error, false);
    }
    // if no error, we get null
    console.log("MATCH", match);
    return next(null, match);
  });
};

userSchema.plugin(findOrCreate);

// create the model for users and expose to the app
module.exports = mongoose.model("User", userSchema);
