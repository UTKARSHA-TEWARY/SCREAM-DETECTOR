const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(401).json({ error: "Token is not valid" });
  }
}

module.exports = { verifyToken };
// here i use cookie and jwttockrn we can use local storage but it is not secure because local storage is accessible by any script on the page, making it vulnerable to XSS attacks. Cookies can be set with HttpOnly and Secure flags, making them inaccessible to JavaScript and only sent over HTTPS, providing better security for sensitive tokens.
//we could also use session storage but it is not persistent across tabs or browser sessions, making it less suitable for maintaining user authentication state. Cookies can persist across sessions and can be configured with expiration dates, making them more reliable for authentication purposes.
// we can use auth bearer token in header but it is not secure because if the token is intercepted, it can be used by an attacker to gain unauthorized access. Cookies can be set with HttpOnly and Secure flags, making them inaccessible to JavaScript and only sent over HTTPS, providing better security for sensitive tokens.