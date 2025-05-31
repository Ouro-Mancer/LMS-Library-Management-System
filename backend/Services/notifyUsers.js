import cron from "node-cron";
import { User } from "../Model/userModel.js";
import { Borrow } from "../Model/borrowModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const notifyUsers = () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const borrowers = await Borrow.find({
        dueDate: {
          $lt: oneDayAgo,
        },
        returnDate: null,
        notified: false,
      }).populate("book");

      for (const element of borrowers) {
        if (element.user && element.user.email) {
          const user = await User.findById(element.user.id);

          const bookTitle = element.book?.bookName || "Unknown Book";

          await sendEmail({
            email: element.user.email,
            subject: "Book Return Reminder",
            message: `Hello ${element.user.name} !! \n\nThis is a reminder to return the book "${bookName}" to the Library that you borrowed. Please return it as soon as possible to avoid any late fees.\n\nThank you!`,
          });

          element.notified = true;
          await element.save();
          console.log(`Email sent to ${element.user.email} for book ${bookName}`);
        }
      }
    } catch (error) {
      console.error("Error in notifyUsers cron job:", error);
    }
  });
};
