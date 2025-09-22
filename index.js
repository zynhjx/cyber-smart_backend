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

app.use(cors())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  }
}));

function requireLogin(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.status(401).json({ success: false, message: "Not logged in" });
  }
}

app.get("/dashboard-data", requireLogin, (req, res) => {
  res.json({ 
    username: req.session.user.username,
    loggedIn: true
  });
});


app.get("/", (req, res) => {
    res.send("try")
})

app.post("/login", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [req.body.username])

        if (result.rows.length === 0) {

            req.session.user = {
              id: result.rows[0].id,
              username: result.rows[0].username,
              email: result.rows[0].email
            };

            res.status(401).json({ success: false, message: "User not found" });
            return;
        }

        if (req.body.password === result.rows[0].password) {
            res.json({ success: true })
        } else {
            res.json({ success: false })
        }
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