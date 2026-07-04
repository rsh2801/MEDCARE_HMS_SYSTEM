import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";

import { errorMiddleware } from "./middlewares/error.js";
import healthCheckRouter from "./router/healthCheckRouter.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import chatbotRouter from "./router/chatbotRouter.js";

const app = express();

//connection
config({ path: "./config/config.env" });

app.use(
  cors({

    origin: [process.env.FRONTEND_URL_ONE, process.env.FRONTEND_URL_TWO, process.env.FRONTEND_URL_THREE].filter(Boolean),
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

//get cookies
app.use(cookieParser());
//json to obj
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/health",healthCheckRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/chatbot", chatbotRouter);

dbConnection();

app.use(errorMiddleware);
export default app;
