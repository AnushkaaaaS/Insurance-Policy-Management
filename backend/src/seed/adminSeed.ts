import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";

import connectDB from "../config/db";
import User from "../models/User";

const seedAdmin = async (): Promise<void> => {

  try {

    await connectDB();

    const existingAdmin =
      await User.findOne({
        role: "admin",
      });

    if (existingAdmin) {

      console.log(
        "✅ Admin already exists"
      );

      process.exit(0);

    }

    const hashedPassword =
      await bcrypt.hash(
        "Admin@123",
        10
      );

    await User.create({
      name: "Admin",
      email: "admin@insurance.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log(
      "🎉 Admin Created Successfully"
    );

    process.exit(0);

  } catch (error) {

    console.error(error);

    process.exit(1);

  }

};

seedAdmin();