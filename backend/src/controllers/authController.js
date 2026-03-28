const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getPrisma = () => {
  try { return require("../db/prisma"); } catch { return null; }
};

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_in_production";

exports.register = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) {
      return res.status(503).json({ error: "Database unavailable" });
    }

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields: name, email, password, role" });
    }

    if (!["JOB_SEEKER", "RECRUITER"].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be JOB_SEEKER or RECRUITER" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password_hash: hashedPassword,
        role,
        recruiterStatus: role === "RECRUITER" ? "PENDING" : null,
      },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, recruiterStatus: user.recruiterStatus },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password_hash, ...safeUser } = user;
    return res.status(201).json({ token, user: safeUser });

  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({ error: "An account with this email already exists" });
    }
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
};

exports.login = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) {
      return res.status(503).json({ error: "Database unavailable" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, recruiterStatus: user.recruiterStatus },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password_hash, ...safeUser } = user;
    return res.json({ token, user: safeUser });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};