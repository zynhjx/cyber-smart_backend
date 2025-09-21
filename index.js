
import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("hilo");
})

app.listen(3000, () => {
    console.log("ridawd")
})