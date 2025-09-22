import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors"
import { Pool } from "pg";
import bcrypt from "bcrypt"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const app = express();
const PORT = 3000
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

app.use(cors({
  origin: "https://zynhjx.github.io",
  credentials: true  
}))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none"
  }
}));

function requireLogin(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.status(401).json({ success: false, message: "Not logged in" });
  }
}

app.get("/dashboard-data", requireLogin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [req.session.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = result.rows[0];

    res.json({
      username: user.username,
      email: user.email,
      loggedIn: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.get("/", (req, res) => {
    res.send("try")
})

app.post("/login", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [req.body.username])

        if (result.rows.length === 0) {
            res.status(401).json({ success: false, message: "User not found" });
            return;
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        res.json({ success: true })
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
    
    
})

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (existing.rows.length > 0) {
      res.status(400).json({ success: false, message: "Username or email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );

    res.json({ success: true, message: "User registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.listen(PORT, () => {
    console.log("Running...")
})