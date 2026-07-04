import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { askAI } from "../services/aiService.js";

export const askChatbot = catchAsyncErrors(async (req, res, next) => {
  const { message, history } = req.body;

  if (!message) {
    return next(new ErrorHandler("Please provide a message", 400));
  }

  const chatHistory = Array.isArray(history) ? history : [];

  const { reply, suggestedDepartment, urgency } = await askAI(message, chatHistory);

  res.status(200).json({
    success: true,
    reply,
    suggestedDepartment,
    urgency,
  });
});
