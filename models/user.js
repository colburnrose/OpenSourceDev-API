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
// userSchema.pre("save", function (next) {
//   let user = this;
//   if (user.isModified("password")) {
//     return bcrypt.hashSync(
//       user.password,
//       bcrypt.genSaltSync(8),
//       function (error, hash) {
//         if (error) {
//           console.log("Hash error", error);
//           return next(error);
//         }
//         user.password = hash;
//         return user.save();
//       }
//     );
//     e;
//   } else {
//     return next();
//   }
// });
// generate a hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check if password isValid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.plugin(findOrCreate);

// create the model for users and expose to the app
module.exports = mongoose.model("User", userSchema);
