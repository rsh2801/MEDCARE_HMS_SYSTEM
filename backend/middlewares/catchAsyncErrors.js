export const catchAsyncErrors = (theFunction) => {
  return (req, res, next) => {
    //wrap in promise and directly asking for error middleware
    Promise.resolve(theFunction(req, res, next)).catch((err) => next(err));
  };
};
