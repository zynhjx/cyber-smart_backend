
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


app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

app.use(cors({
    origin: "https://zynhjx.github.io/cyber-smart/"
}))

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

app.listen(3000, () => {
    console.log("ridawd")
})