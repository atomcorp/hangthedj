import * as express from "express";

const app = express();
const PORT = 3001;
app.get("/", (req, res) => res.send("Express + TypeScript Server. Hi!"));
app.get("/api/v1/test", (req, res) =>
  res.send("Express + TypeScript Server. Hi!")
);
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
