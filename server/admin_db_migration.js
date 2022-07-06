const mongoose = require("mongoose");
const UserModule = require("./models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const db = config.get("mongoURI");

const save_admin = async () => {
  const salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash("Admin#123", salt);
  let user = new UserModule.User({
    email: "super.admin@yopmail.com",
    first_name: "admin",
    last_name: "admin",
    password: password,
    role: [
      {
        user_type: 1,
      },
    ],
  });
  await user.save((err, result) => {
    if (err) {
      console.log("MongoDB disconnected");
      mongoose.disconnect();
    }
  });
  console.log(
    "Admin Created. Email- super.admin@yopmail.com, Password- Admin#123"
  );
};

try {
  mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  save_admin();
  // mongoose.disconnect();
  // process.exit(1);
} catch (err) {
  console.log("Unable to create Admin.");
  process.exit(1);
}
