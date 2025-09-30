import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors"
import { Pool } from "pg";
import bcrypt from "bcrypt"
import passport from "passport"
import { Strategy } from "passport-local"

const pool = new Pool({
    connectionString: "postgresql://postgres:rwBYvtevrTuVYhQUyFbzUjLVQcAhPgpC@shortline.proxy.rlwy.net:26818/railway" , // process.env.DATABASE_URL,
    ssl: false // { rejectUnauthorized: false }
});

const app = express();
const PORT = 3000
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

// app.use(cors({
//   origin: "https://zynhjx.github.io",
//   credentials: true  
// }))

app.use(cors({
    origin: "http://127.0.0.1:5500", 
    credentials: true             
}));


app.use(session({
  secret: "dawdawdasdafsfdrg", // process.env.SESSION_SECRET
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    secure: false, // process.env.NODE_ENV === "production"
    sameSite: "lax" // "none"
  }
}));

app.set("view engine", "ejs")
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.render("pages/index")
})

app.use(passport.initialize())
app.use(passport.session())

app.get("/dashboard", async (req, res) => {

  if (!req.isAuthenticated()) {
    res.redirect("login")
  } else {
    res.render("pages/dashboard", {
      user: req.user,
      activePage: "dashboard"
     })
  }

});


app.get("/login", (req, res) => {
  res.render("pages/login")
})

app.get("/training", (req, res) => {

  if (!req.isAuthenticated()) {
    res.redirect("login")
  } else {
    res.render("pages/training", {
      user: req.user,
      activePage: "training"
     })
  }
})

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err)

    if (!user) {
      // Generic login failure message for security
      return res.status(401).json({
        success: false,
        message: "Username or password is incorrect"
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err)
      return res.json({ success: true, message: "Login successful", user: { username: user.username } })
    })
  })(req, res, next)
})

app.get("/register", (req, res) => {
  res.render("pages/register")
})

app.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existing = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (existing.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Username or email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users 
        (username, email, password, exp, level, coins, day_streak, lessons_completed, challenges_completed, accuracy_rate) 
       VALUES 
        ($1, $2, $3, 0, 1, 30, 0, 0, 0, 0) 
       RETURNING *`,
      [username, email, hashedPassword]
    );

    const user = result.rows[0];

    // Auto-login with passport
    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ success: true, message: "Registration successful!" });
    });

  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
});

passport.use(
  new Strategy(async function verify(username, password, cb) {
  try {
      const result = await pool.query("SELECT * FROM users WHERE username = $1", [username])

      if (result.rows.length === 0) {
          return cb(null, false, { message: "User not found" });
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          return cb(null, false, { message: "Incorrect password" });
      }

      return cb(null, user)

      
    } catch (err) {
        return cb(err)
    }
}))

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return done(null, false);
    }

    const user = result.rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.listen(PORT, () => {
    console.log("Running...")
})