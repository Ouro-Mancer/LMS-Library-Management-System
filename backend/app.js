import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./Database/db.js";
import { errorMiddlewares } from "./Middlewares/errorMiddlewares.js";
import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRoutes.js"
import borrowRouter from "./routes/borrowRoutes.js"
import userRouter from "./routes/userRouter.js"
import expressFileupload from "express-fileupload"
import { notifyUsers } from "./Services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./Services/removeUnverifiedAccounts.js";



export const app = express();
config({ path: "./Config/config.env" }); // Load .env first

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressFileupload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
  limits: { fileSize: 50 * 1024 * 1024 },
}))

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);

connectDB();
notifyUsers();
removeUnverifiedAccounts();

app.use(errorMiddlewares);
