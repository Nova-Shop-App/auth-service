function authorization(req, res, next) {
  if (req.user.role != "ADMIN") {
    return res
      .status(403)
      .json({ message: "Access denied. Insufficient privileges." });
  }
  next();
}

export default authorization;
