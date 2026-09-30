const dotenv = require("dotenv");

dotenv.config();

const mongoose = require("mongoose");
const User = require("../models/User");

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
    console.log("");
    console.log("========== REGISTERED USERS ==========");
    console.log("");

    const users = await User.find({})
      .select("name email role")
      .sort({ createdAt: 1 })
      .lean();

    if (users.length === 0) {
      console.log("No users found in the database.");
    } else {
      users.forEach((user, index) => {
        console.log(`User ${index + 1}`);
        console.log(`Name  : ${user.name}`);
        console.log(`Email : ${user.email}`);
        console.log(`Role  : ${user.role}`);
        console.log("-----------------------------------");
      });
    }

    console.log("");
    console.log(`Total users: ${users.length}`);

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to list users:",
      error.message
    );

    process.exit(1);
  }
};

listUsers();