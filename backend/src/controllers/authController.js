const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getPrisma = () => {
  try { return require("../db/prisma"); } catch { return null; }
};

exports.register = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing fields" });
    }

    if (!["JOB_SEEKER", "RECRUITER"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const normalizedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (prisma) {
      const user = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          password_hash: hashedPassword,
          role,
          recruiterStatus: role === "RECRUITER" ? "PENDING" : "APPROVED",
        },
      });
      const { password_hash, ...safeUser } = user;
      return res.json(safeUser);
    }
  } catch (err) {
    if (err.code === "P2002") return res.status(400).json({ error: "Email already exists" });
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const normalizedEmail = email.toLowerCase();

    if (prisma) {
      const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (!user) return res.status(400).json({ error: "User not found" });

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(400).json({ error: "Invalid password" });

      const token = jwt.sign({ id: user.id, role: user.role, recruiterStatus: user.recruiterStatus }, (process.env.JWT_SECRET || "dev_secret"), { expiresIn: "7d" });
      const { password_hash, ...safeUser } = user;
      return res.json({ token, user: safeUser });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
