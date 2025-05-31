import { User } from "../Model/userModel.js";
import bcrypt from "bcryptjs";

const createMainAdmin = async () => {
  try {
    const mainAdminExists = await User.findOne({ role: "main-Admin" });

    if (!mainAdminExists) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      await User.create({
        name: "Karuna Sheel",
        email: "karuna@nielit.gov.in",
        password: hashedPassword,
        role: "main-Admin",
        accountVerified: true,
      });

      console.log("✅ Default main-Admin user created successfully");
    } else {
      console.log("ℹ️ Main-Admin already exists");
    }
  } catch (error) {
    console.error("❌ Error creating main-Admin:", error.message);
  }
};

export default createMainAdmin;
