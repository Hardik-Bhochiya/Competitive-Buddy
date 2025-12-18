import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ------------------------------
// LeetCode Proxy (GraphQL)
// ------------------------------
app.post("/leetcode", async (req, res) => {
  try {
    const r = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "LeetCode Proxy Error", detail: e });
  }
});

// ------------------------------
// CodeChef Proxy (HTML Scrape)
// ------------------------------
app.get("/codechef/:user", async (req, res) => {
  try {
    const r = await fetch(`https://www.codechef.com/users/${req.params.user}`);
    const text = await r.text();
    res.send(text);
  } catch (e) {
    res.status(500).send("CodeChef Proxy Error");
  }
});

app.listen(3001, () => console.log("Proxy running at http://localhost:3001"));
