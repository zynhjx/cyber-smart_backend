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

app.use(cors({
    origin: "http://127.0.0.1:5500", 
    credentials: true             
}));


app.use(session({
  secret: "dawdawdasdafsfdrg", // process.env.SESSION_SECRET
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2,
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


async function getUserProgress(userId) {
  const result = await pool.query(
    "SELECT module_id, progress, completed_lessons, locked, finished FROM user_progress WHERE user_id = $1",
    [userId]
  );

  const progress = {};
  result.rows.forEach((row) => {
    progress[row.module_id] = {
      progress: row.progress,
      completed_lessons: row.completed_lessons,
      locked: row.locked,
      finished: row.finished
    };
  });

  return progress;
}

app.get("/dashboard", async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/login");

  const userId = req.user.id;

  try {
    // 1️⃣ Get all modules (ordered)
    const modulesResult = await pool.query(
      "SELECT id, name, thumbnail, order_index FROM modules ORDER BY order_index ASC"
    );
    const modules = modulesResult.rows;

    // 2️⃣ Get user's module progress
    const userProgress = await getUserProgress(userId);
    const modulesWithProgress = modules.map((m) => ({
      ...m,
      progress: userProgress[m.id]?.progress || 0,
      locked: userProgress[m.id]?.locked ?? true,
      finished: userProgress[m.id]?.finished || false
    }));

    // 3️⃣ Pick current module (in progress or first unlocked)
    const inProgress = modulesWithProgress.find(m => m.progress > 0 && m.progress < 100);
    const currentModule = inProgress || modulesWithProgress.find(m => !m.locked) || modulesWithProgress[0];

    // 4️⃣ 🧠 Find the latest uncompleted lesson for this module
    const latestLesson = await pool.query(`
      SELECT l.id, l.module_id, l.order_index, l.title
      FROM lessons l
      WHERE l.module_id = $1
      AND l.id NOT IN (
        SELECT lesson_id FROM user_lessons WHERE user_id = $2 AND completed = TRUE
      )
      ORDER BY l.order_index ASC
      LIMIT 1;
    `, [currentModule.id, userId]);

    // If no uncompleted lessons left, use the last one
    let currentLesson = latestLesson.rows[0];
    if (!currentLesson) {
      const lastLesson = await pool.query(`
        SELECT id, module_id, order_index, title
        FROM lessons
        WHERE module_id = $1
        ORDER BY order_index DESC
        LIMIT 1;
      `, [currentModule.id]);
      currentLesson = lastLesson.rows[0];
    }

    // 5️⃣ Fetch challenges and user challenge progress
    const challengeProgressResult = await pool.query(
      `SELECT 
          c.id, c.name, c.thumbnail, c.module_id, c.order_index,
          ucp.finished, ucp.locked
       FROM challenges c
       JOIN user_challenge_progress ucp ON c.id = ucp.challenge_id
       WHERE ucp.user_id = $1
       ORDER BY c.order_index ASC;`,
      [userId]
    );

    // 6️⃣ Use DB values directly, don't alter locked
    const challengeProgress = challengeProgressResult.rows.map((ch) => ({
      ...ch,
      relatedModuleName: modulesWithProgress.find(m => m.id === ch.module_id)?.name || "Unknown Module"
    }));

    // 7️⃣ Find challenge snapshot for current module
    let challengeSnapshot = challengeProgress.find(ch => ch.module_id === currentModule.id);

    // 8️⃣ Fallback if missing
    if (!challengeSnapshot) {
      challengeSnapshot = challengeProgress[0] || {
        name: "No Challenges Available",
        thumbnail: "/assets/images/placeholder.png",
        finished: false,
        locked: true,
      };
    }

    // 9️⃣ Render dashboard
    res.render("pages/dashboard", {
      user: req.user,
      activePage: "dashboard",
      currentModule,
      currentLesson,
      challengeSnapshot,
      challengeProgress
    });

  } catch (err) {
    console.error("Error loading dashboard:", err);
    res.status(500).send("Server error");
  }
});


app.get("/login", (req, res) => {
  res.render("pages/login")
})

app.get("/logout", (req, res) => {
  if (req.isAuthenticated()) {
    req.logout(err => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).send("Error logging out");
      }

      // Destroy session completely
      req.session.destroy(err => {
        if (err) {
          console.error("Session destroy error:", err);
        }
        res.clearCookie("connect.sid"); // clear session cookie
        return res.redirect("/login");  // redirect to login page
      });
    });
  } else {
    // User not logged in, just redirect
    res.redirect("/login");
  }
});

app.get("/training", async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/login");

  try {
    const user = req.user;
    const filter = req.query.filter || "all";

    // 1️⃣ Fetch all modules
    const result = await pool.query(`
      SELECT id, name, thumbnail, order_index, total_lessons, price
      FROM modules
      ORDER BY order_index ASC
    `);
    let modules = result.rows;

    // 2️⃣ Fetch purchased modules
    const purchaseResult = await pool.query(
      `SELECT module_id FROM user_purchases WHERE user_id = $1`,
      [user.id]
    );
    const purchasedModuleIds = purchaseResult.rows.map(row => row.module_id);

    // 3️⃣ Get user's progress
    const progress = await getUserProgress(user.id);

    // 4️⃣ Attach progress + lock logic + current lesson
    const modulesWithLesson = [];

    for (const m of modules) {
      const userProgress = progress[m.id]?.progress || 0;
      const bought = purchasedModuleIds.includes(m.id);
      const locked = m.price > 0 && !bought;

      // 🧠 Fetch latest uncompleted lesson for this module
      const lessonRes = await pool.query(`
        SELECT id, title, order_index
        FROM lessons
        WHERE module_id = $1
        AND id NOT IN (
          SELECT lesson_id FROM user_lessons WHERE user_id = $2 AND completed = TRUE
        )
        ORDER BY order_index ASC
        LIMIT 1;
      `, [m.id, user.id]);

      // if all lessons are complete, fallback to last lesson
      let currentLesson = lessonRes.rows[0];
      if (!currentLesson) {
        const fallback = await pool.query(`
          SELECT id, title, order_index
          FROM lessons
          WHERE module_id = $1
          ORDER BY order_index DESC
          LIMIT 1;
        `, [m.id]);
        currentLesson = fallback.rows[0];
      }

      modulesWithLesson.push({
        ...m,
        progress: userProgress,
        locked,
        currentLesson
      });
    }

    // 5️⃣ Filtering
    let filteredModules = modulesWithLesson;
    switch (filter) {
      case "completed":
        filteredModules = filteredModules.filter(m => Number(m.progress) === 100);
        break;
      case "in-progress":
        filteredModules = filteredModules.filter(m => Number(m.progress) > 0 && Number(m.progress) < 100);
        break;
      case "not-started":
        filteredModules = filteredModules.filter(m => Number(m.progress) === 0);
        break;
    }

    // 6️⃣ Stats
    const totalModules = modulesWithLesson.length;
    const completedModules = modulesWithLesson.filter(m => Number(m.progress) === 100).length;
    const inProgressModules = modulesWithLesson.filter(m => Number(m.progress) > 0 && Number(m.progress) < 100).length;
    const notStartedModules = modulesWithLesson.filter(m => Number(m.progress) === 0).length;
    const totalLessonsAll = modulesWithLesson.reduce((sum, m) => sum + m.total_lessons, 0);
    const userRes = await pool.query(
      `SELECT lessons_completed FROM users WHERE id = $1`,
      [req.user.id]
    );
    const userDb = userRes.rows[0];
    // Then use `userDb.completed_lessons` instead of `user.completed_lessons`
    const completedLessonsAll = Number(userDb.lessons_completed) || 0;
    const overallProgress = totalLessonsAll 
        ? Number(((completedLessonsAll / totalLessonsAll) * 100).toFixed(1))
        : 0;


    // 7️⃣ Render
    res.render("pages/training", {
      user,
      modules: filteredModules,
      all_modules: modulesWithLesson,
      totalModules,
      completedModules,
      inProgressModules,
      notStartedModules,
      overallProgress,
      currentFilter: filter,
      activePage: "training",
      totalLessons: 20
    });

  } catch (error) {
    console.error("Error loading training page:", error);
    res.status(500).send("Internal server error");
  }
});


app.get("/training/module/:moduleId/lesson/:lessonId", async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/login");

  const userId = req.user.id;
  const { moduleId, lessonId } = req.params;

  // Convert URL IDs to DB IDs
  const moduleIdM = parseInt(moduleId, 10) + 5;
  const lessonIdM = parseInt(lessonId, 10) + 3;

  try {
    // Get the current lesson's order_index
    const currentLessonRes = await pool.query(
      `SELECT order_index FROM lessons WHERE id = $1 AND module_id = $2`,
      [lessonIdM, moduleIdM]
    );
    if (currentLessonRes.rowCount === 0) {
      return res.status(404).send("Lesson not found");
    }
    const currentOrder = currentLessonRes.rows[0].order_index;

    // Find the previous lesson in this module
    const prevLessonRes = await pool.query(
      `SELECT l.id, COALESCE(ul.completed, FALSE) AS completed
       FROM lessons l
       LEFT JOIN user_lessons ul
         ON ul.lesson_id = l.id AND ul.user_id = $1
       WHERE l.module_id = $2 AND l.order_index < $3
       ORDER BY l.order_index DESC
       LIMIT 1`,
      [userId, moduleIdM, currentOrder]
    );

    // If previous lesson exists and not completed, redirect
    if (prevLessonRes.rowCount > 0 && prevLessonRes.rows[0].completed === false) {
      // Convert DB ID back to URL-friendly ID
      const redirectLessonId = prevLessonRes.rows[0].id - 3;
      const redirectModuleId = moduleId;
      return res.redirect(`/training/module/${redirectModuleId}/lesson/${redirectLessonId}`);
    }

    // Otherwise, render the requested lesson
    res.render(`pages/module${moduleId}/lesson${lessonId}`, { moduleId, lessonId });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/challenge", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  try {
    const user = req.user;
    const filter = req.query.filter || "all";

    // 1️⃣ Fetch all challenges + module info
    const challengesResult = await pool.query(`
      SELECT c.*, m.name AS module_name, m.total_lessons
      FROM challenges c
      JOIN modules m ON c.module_id = m.id
      ORDER BY c.order_index ASC;
    `);
    const challenges = challengesResult.rows;

    // 2️⃣ Fetch user's challenge progress (locked + finished)
    const challengeProgressResult = await pool.query(
      `SELECT challenge_id, finished, locked FROM user_challenge_progress WHERE user_id = $1;`,
      [user.id]
    );

    const challengeProgressMap = {};
    challengeProgressResult.rows.forEach((row) => {
      challengeProgressMap[row.challenge_id] = {
        finished: row.finished,
        locked: row.locked
      };
    });

    // 3️⃣ Merge challenges with progress info from DB
    const challengesWithStatus = challenges.map((ch) => {
      const progress = challengeProgressMap[ch.id] || { finished: false, locked: true };
      return {
        ...ch,
        finished: progress.finished,
        locked: progress.locked
      };
    });

    // 4️⃣ Apply filtering based on query
    let filteredChallenges = challengesWithStatus;
    if (filter === "completed") {
      filteredChallenges = challengesWithStatus.filter((ch) => ch.finished);
    } else if (filter === "not-started") {
      filteredChallenges = challengesWithStatus.filter((ch) => !ch.finished);
    }

    // 5️⃣ Stats
    const totalChallenges = challengesWithStatus.length;
    const completedChallenges = challengesWithStatus.filter((c) => c.finished).length;
    const notStartedChallenges = challengesWithStatus.filter((c) => !c.finished).length;
    const inProgressChallenges = 0; // still using finished/not-finished only
    const overallPercent = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;

    // 6️⃣ Render page
    res.render("pages/challenge", {
      user,
      challenges: filteredChallenges,
      totalChallenges,
      completedChallenges,
      notStartedChallenges,
      inProgressChallenges,
      overallProgress: completedChallenges,
      overallPercent,
      currentFilter: filter,
      activePage: "challenge"
    });

  } catch (err) {
    console.error("Error fetching challenges:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/challenge/module/:moduleId", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  const userId = req.user.id;
  const { moduleId } = req.params;
  const moduleIdM = Number(moduleId) + 5

  try {
    // 1️⃣ Get the challenge tied to this module
    const challengeRes = await pool.query(
      `SELECT id FROM challenges WHERE module_id = $1 LIMIT 1`,
      [moduleIdM]
    );

    if (challengeRes.rowCount === 0) {
      return res.status(404).send("Challenge not found for this module");
    }

    const challengeId = challengeRes.rows[0].id;

    // 2️⃣ Check if user's challenge is locked
    const userChallengeRes = await pool.query(
      `SELECT locked, finished 
       FROM user_challenge_progress 
       WHERE user_id = $1 AND challenge_id = $2 LIMIT 1`,
      [userId, challengeId]
    );

    if (userChallengeRes.rowCount === 0) {
      return res.status(403).send("Challenge progress not found for this user");
    }

    const { locked, finished } = userChallengeRes.rows[0];

    // 3️⃣ If locked, deny access
    if (locked) {
      return res.status(403).json({
        success: false,
        message: "Challenge is locked. Finish the module first."
      });
    }

    // 4️⃣ Otherwise, render the corresponding challenge page
    res.render(`pages/challenges/challenge${moduleId}`, {
      user: req.user,
      moduleId,
      challengeId,
      finished
    });

  } catch (err) {
    console.error("Error loading challenge page:", err);
    res.status(500).send("Internal server error");
  }
});



app.post("/api/lesson/complete", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  const userId = req.user.id;
  const { moduleId, lessonId } = req.body;

  // Server-side constants for rewards
  const expReward = Number(req.body.expReward) || 50;
  const orbReward = Number(req.body.orbReward) || 30;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1️⃣ Validate lesson belongs to module
    const lessonCheck = await client.query(
      `SELECT id FROM lessons WHERE id = $1 AND module_id = $2 LIMIT 1`,
      [lessonId, moduleId]
    );
    if (lessonCheck.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ success: false, message: "Lesson does not belong to module" });
    }

    // 2️⃣ Mark lesson completed only if it wasn't already
    const markLesson = await client.query(`
      UPDATE user_lessons
      SET completed = TRUE
      WHERE user_id = $1 AND lesson_id = $2 AND completed = FALSE
      RETURNING *;
    `, [userId, lessonId]);

    if (markLesson.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.json({ success: false, message: "Lesson already completed" });
    }

    // 3️⃣ Increment completed lessons in user_progress
    const incRes = await client.query(`
      UPDATE user_progress
      SET completed_lessons = completed_lessons + 1
      WHERE user_id = $1 AND module_id = $2
      RETURNING completed_lessons;
    `, [userId, moduleId]);

    if (incRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(500).json({ success: false, message: "user_progress row missing" });
    }

    const completedLessons = Number(incRes.rows[0].completed_lessons);

    // 4️⃣ Get total lessons for the module
    const totalRes = await client.query(
      `SELECT total_lessons FROM modules WHERE id = $1`,
      [moduleId]
    );
    if (totalRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(500).json({ success: false, message: "Module not found" });
    }
    const totalLessons = Number(totalRes.rows[0].total_lessons);

    // 5️⃣ Compute progress and update finished flag
    const progressValue = Math.min(100, (completedLessons / totalLessons) * 100);
    await client.query(`
      UPDATE user_progress
      SET progress = $1::numeric, finished = ($1 >= 100)
      WHERE user_id = $2 AND module_id = $3
    `, [parseFloat(progressValue.toFixed(1)), userId, moduleId]);

    // 6️⃣ Reward user only if marking succeeded
    await client.query(`
      UPDATE users
      SET lessons_completed = lessons_completed + 1,
          exp = exp + $2,
          orbs = orbs + $3
      WHERE id = $1
    `, [userId, expReward, orbReward]);

    // 7️⃣ Unlock challenge if module is finished
    if (progressValue >= 100) {
      await client.query(`
        UPDATE user_challenge_progress
        SET locked = FALSE
        FROM challenges c
        WHERE user_challenge_progress.challenge_id = c.id
          AND c.module_id = $1
          AND user_challenge_progress.user_id = $2
      `, [moduleId, userId]);
    }

    await client.query("COMMIT");

    return res.json({
      success: true,
      progress: Number(progressValue.toFixed(1)),
      completedLessons,
      totalLessons,
      expReward,
      orbReward
    });

  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Lesson complete error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});



app.post("/api/challenge/complete", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  const userId = req.user.id;
  const { challengeId, expReward = 50, orbReward = 30 } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Check if challenge exists and get module_id
    const challengeRes = await client.query(
      "SELECT module_id FROM challenges WHERE id = $1 LIMIT 1",
      [challengeId]
    );

    if (challengeRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Challenge not found" });
    }

    const moduleId = challengeRes.rows[0].module_id;

    // 2️⃣ Check if user already completed it
    const userChRes = await client.query(
      "SELECT finished, locked FROM user_challenge_progress WHERE user_id = $1 AND challenge_id = $2 LIMIT 1",
      [userId, challengeId]
    );

    if (userChRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(500).json({ success: false, message: "User challenge record missing" });
    }

    const { finished, locked } = userChRes.rows[0];
    if (finished) {
      await client.query("ROLLBACK");
      return res.json({ success: false, message: "Challenge already completed" });
    }

    if (locked) {
      await client.query("ROLLBACK");
      return res.json({ success: false, message: "Challenge is locked" });
    }

    // 3️⃣ Mark challenge as finished
    await client.query(
      `UPDATE user_challenge_progress 
       SET finished = TRUE 
       WHERE user_id = $1 AND challenge_id = $2`,
      [userId, challengeId]
    );

    // 4️⃣ Reward the user
    await client.query(
      `UPDATE users
       SET exp = exp + $2,
           orbs = orbs + $3,
           challenges_completed = challenges_completed + 1
       WHERE id = $1`,
      [userId, expReward, orbReward]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Challenge completed!",
      expReward,
      orbReward
    });

  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Challenge completion error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});




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

    // 1️⃣ Check if username or email already exists
    const existing = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (existing.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Username or email already exists" });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Insert user
    const result = await pool.query(
      `INSERT INTO users 
        (username, email, password, exp, level, lessons_completed, challenges_completed, accuracy_rate) 
       VALUES 
        ($1, $2, $3, 0, 1, 0, 0, 0) 
       RETURNING id, username, email`,
      [username, email, hashedPassword]
    );

    const user = result.rows[0];

    // 4️⃣ Initialize MODULE progress
    const modulesResult = await pool.query(
      "SELECT id FROM modules ORDER BY order_index ASC"
    );
    const modules = modulesResult.rows;

    const insertModuleProgress = modules.map((m, index) => {
      const isFirst = index === 0;
      return pool.query(
        `INSERT INTO user_progress 
         (user_id, module_id, progress, completed_lessons, locked, finished)
         VALUES ($1, $2, 0, 0, $3, false)`,
        [user.id, m.id, !isFirst] // only first unlocked
      );
    });

    await Promise.all(insertModuleProgress);

    // 5️⃣ Initialize CHALLENGE progress
    const challengeResult = await pool.query(
      "SELECT id FROM challenges ORDER BY order_index ASC"
    );
    const challenges = challengeResult.rows;

    for (const c of challenges) {
      await pool.query(
        `INSERT INTO user_challenge_progress 
         (user_id, challenge_id, finished, locked)
         VALUES ($1, $2, $3, $4)`,
        [user.id, c.id, false, true] // locked by default
      );
    }

    // 6️⃣ Initialize LESSON progress
    await pool.query(`
      INSERT INTO user_lessons (user_id, lesson_id)
      SELECT $1, id FROM lessons
      ON CONFLICT DO NOTHING;
    `, [user.id]);

    // 7️⃣ Log user in after registration
    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ success: true, message: "Registration successful!" });
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Server error" });
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