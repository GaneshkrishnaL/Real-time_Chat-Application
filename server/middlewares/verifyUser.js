const { verify } = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "no token" });

  const bearerToken = authHeader?.split(" ")[1];
  if (!bearerToken) return res.status(401).json({ error: "invalid token" });

  verify(bearerToken, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(500).json({ error: err?.message });
    req.user = user;
    next();
  });
};
