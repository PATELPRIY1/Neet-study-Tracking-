const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
  console.log("Cookies received:", req.cookies);

  const token = req.cookies.token;

  if (!token) {
    console.log("❌ Token not found");
    return res.status(401).json({ message: "Unauthorized - token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ Token decoded:", decoded);

    if (decoded.role !== "user") {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ JWT error:", err.message);

    return res.status(401).json({
      message: "Unauthorized - invalid token",
    });
  }
};

module.exports = { authUser };