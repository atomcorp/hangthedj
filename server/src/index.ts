import * as express from "express";
import fetch from "node-fetch";

const app = express();

app.use(express.json());

const PORT = 3001;
const client_id = "5280f2bd9b014405839ea087c05c58d1";
const client_secret = "9ebfb80c60314a5b9eaf6870703c161c";

app.get("/", (req, res) => res.send("Express + TypeScript Server. Hi!"));
app.get("/api/v1/test", (req, res) =>
  res.send("Express + TypeScript Server. Hi!")
);
app.post("/api/v1/getspotifytoken", (req, res) => {
  console.log(req.body);
  if (req.body.code) {
    fetch(`https://accounts.spotify.com/api/token`, {
      method: "POST",
      body: `grant_type=authorization_code&code=${req.body.code}&redirect_uri=${req.body.redirectURI}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${client_id}:${client_secret}`
        ).toString("base64")}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        res.send(response);
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  // res.send("hello");
});
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
