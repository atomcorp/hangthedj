import * as express from "express";
import fetch from "node-fetch";
import * as helmet from "helmet";
import { checkSchema } from "express-validator";

const app = express();

app.use(helmet());
app.use(express.json());

const PORT = 3001;
const client_id = "5280f2bd9b014405839ea087c05c58d1";
const client_secret = "9ebfb80c60314a5b9eaf6870703c161c";

const authorizationString = `Basic ${Buffer.from(
  `${client_id}:${client_secret}`
).toString("base64")}`;

const apiBase =
  process.env.NODE_ENV === "development"
    ? "http://192.168.86.37:3000"
    : "https://www.atomcorp.dev";
export const redirectURI = `${apiBase}/play/redirect`;

app.post(
  "/api/v1/createspotifytoken",
  checkSchema({
    code: {
      in: ["body"],
      escape: true,
      isEmpty: {
        negated: true,
      },
    },
  }),
  (req, res) => {
    const main = async () => {
      try {
        if (req.body.code) {
          // using the code created clientside, create spotfy tokens
          const getTokens = await fetch(
            `https://accounts.spotify.com/api/token`,
            {
              method: "POST",
              body: `grant_type=authorization_code&code=${req.body.code}&redirect_uri=${redirectURI}`,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: authorizationString,
              },
            }
          );
          const tokens = await getTokens.json();
          if (!tokens.error) {
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            res.status(200).send({
              spotifyAccessToken: tokens.access_token,
              spotifyRefreshToken: tokens.refresh_token,
              spotifyAccessTokenExpiresIn: expiryDate.toISOString(),
            });
          } else {
            throw new Error(tokens.error_description);
          }
        } else {
          throw new Error("No code");
        }
      } catch (error) {
        console.log(error);
        res.status(500).statusMessage(error.message);
      }
    };
    main();
  }
);

app.post("/api/v1/refreshspotifytoken", async (req, res) => {
  try {
    if (req.body.spotifyRefreshToken) {
      const response = await fetch(`https://accounts.spotify.com/api/token`, {
        method: "POST",
        body: `grant_type=refresh_token&refresh_token=${req.body.spotifyRefreshToken}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: authorizationString,
        },
      });
      if (response.status === 200) {
        const tokens = await response.json();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        res.status(200).send({
          spotifyAccessToken: tokens.access_token,
          spotifyAccessTokenExpiresIn: expiryDate.toISOString(),
        });
      } else {
        throw "refresh_token failed";
      }
    } else {
      throw "no token provided";
    }
  } catch (error) {
    res.status(500).send();
  }
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
