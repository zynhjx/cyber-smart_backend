
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors"
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const app = express();
const PORT = 3000

app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

app.use(cors({
    origin: "https://zynhjx.github.io/cyber-smart/"
}))

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("Connected to database successfully");
    client.release();
  } catch (err) {
    console.error("Database connection error:", err.stack);
  }
}

testConnection();

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

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, password]
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