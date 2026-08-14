import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET || "default_access_secret_key_123"
    );
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default isAuthenticated;
