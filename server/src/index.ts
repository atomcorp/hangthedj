import * as express from "express";
import fetch from "node-fetch";
import * as helmet from "helmet";
import { checkSchema } from "express-validator";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBeqeW-lV5dg2x-vDzn6_NMN9wtkzJ_K4M",
  authDomain: "passtheaux-3d50c.firebaseapp.com",
  projectId: "passtheaux-3d50c",
  storageBucket: "passtheaux-3d50c.appspot.com",
  messagingSenderId: "807387430755",
  appId: "1:807387430755:web:a916cee52fde2cf36c5d56",
  databaseURL:
    "https://passtheaux-3d50c-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const app = express();

app.use(helmet());
app.use(express.json());

const PORT = 3001;
const client_id = "5280f2bd9b014405839ea087c05c58d1";
const client_secret = "9ebfb80c60314a5b9eaf6870703c161c";

const apiBase =
  process.env.NODE_ENV === "development"
    ? "http://192.168.86.37:3000"
    : "https://www.atomcorp.dev";
export const redirectURI = `${apiBase}/play/redirect`;

app.get("/", (req, res) => res.send("Express + TypeScript Server. Hi!"));
app.get("/api/v1/test", (req, res) =>
  res.send("Express + TypeScript Server. Hi!")
);
app.post(
  "/api/v1/getspotifytoken",
  checkSchema({
    code: {
      in: ["body"],
      escape: true,
      isEmpty: {
        negated: true,
      },
    },
    uid: {
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
                Authorization: `Basic ${Buffer.from(
                  `${client_id}:${client_secret}`
                ).toString("base64")}`,
              },
            }
          );
          const tokens = await getTokens.json();
          console.log(tokens);
          if (!tokens.error) {
            firebase
              .database()
              .ref(`users/${req.body.uid}`)
              .update(
                {
                  spotifyAccessToken: tokens.access_token,
                  spotifyRefreshToken: tokens.refresh_token,
                },
                (error) => {
                  if (!error) {
                    res.send({
                      status: 200,
                    });
                  } else {
                    throw new Error(error.message);
                  }
                }
              );
          } else {
            throw new Error(tokens.error_description);
          }
        } else {
          throw new Error("No code");
        }
      } catch (error) {
        console.log(error);
        res.status(500).send({
          error: true,
          message: error.message,
        });
      }
    };
    main();
  }
);
app.post(
  "/api/v1/createuser",
  checkSchema({
    password: {
      in: ["body"],
      isEmpty: {
        negated: true,
      },
    },
    profilename: {
      in: ["body"],
      escape: true,
      isEmpty: {
        negated: true,
      },
    },
    email: {
      in: ["body"],
      isEmail: true,
      isEmpty: {
        negated: true,
      },
      toLowerCase: true,
    },
  }),
  (req, res) => {
    console.log(req.body);
    const main = async () => {
      try {
        // 1. create user in Firebase Auth
        const { user } = await firebase
          .auth()
          .createUserWithEmailAndPassword(req.body.email, req.body.password);
        if (user) {
          // 2. create user in Firebase database, using Auth Id
          firebase
            .database()
            .ref(`users/${user.uid}`)
            .set(
              {
                email: req.body.email,
                profilename: req.body.profilename,
                packages: [],
                spotifyAccessToken: null,
                spotifyRefreshToken: null,
              },
              (error) => {
                if (!error) {
                  res.status(200).send();
                } else {
                  throw new Error(error.message);
                }
              }
            );
        } else {
          throw new Error("Failed to create authenticated user");
        }
      } catch (error) {
        console.log(error);
        res.status(500).send({
          error: true,
          message: error.message,
        });
      }
    };
    main();
  }
);
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
