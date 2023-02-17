import config from "config";

export default function requireAuth(req, res, next) {
  const token = req.cookies.jwt;
  const verifyToken = jwt.vefify(token,config.get("JWT_SECRET"))
  if (verifyToken) {
    next(); // allow the next route to run
  } else {
    return res.status(400).json({message:"Authentication failed!"});
  }
}