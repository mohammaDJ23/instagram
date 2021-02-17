const path = require("path");
const fs = require("fs");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const helmet = require("helmet");
const xXssProtection = require("x-xss-protection");

const { mongoConnect } = require("./utils/database-connection/database");
const { tkn } = require("./utils/token/tkn");

const postRoutes = require("./routes/post/post-route");
const userRoutes = require("./routes/user/user-route");

const notFoundController = require("./controllers/not-found/not-found-controller");

const app = express();

const PORT = process.env.PORT || 5000;

const MIME_TYPE = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "images"),
  filename: (req, file, cb) => cb(null, `${Math.random()}-${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
  const isValid = !!MIME_TYPE[file.mimetype];
  const error = isValid ? null : new Error("invalid mime type");
  cb(error, isValid);
};

app.use(cors());

app.use(helmet());

app.use(xXssProtection());

app.use(bodyParser.json({ limit: "50mb" }));

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));

app.use("/post", postRoutes);
app.use("/user", userRoutes);
app.use(notFoundController.notFound);

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, error => console.log(error));
  }

  console.log(error);

  res.status(error.code || 500).json({
    message: error.message || "something went wrong"
  });
});

(async () => {
  await mongoConnect(error => {
    if (error) {
      console.log(error);
    } else {
      const server = app.listen(PORT, () =>
        console.log(`server is running on ${PORT} port`)
      );

      const io = require("socket.io")(server, {
        cors: {
          origin: "*"
        }
      });

      io.use((socket, next) => {
        const message = "Authentication failed, you can't chat with any users.";

        if (socket.handshake.headers.authorization) {
          try {
            const token = socket.handshake.headers.authorization.split(" ")[1];
            tkn({ token, from: "socket-io" }, next);
          } catch (error) {
            next(new Error(message));
          }
        } else {
          next(new Error(message));
        }
      });

      io.on("connection", socket => {
        require("./controllers/socket-io/socket-io-controller")(socket, io);
      });
    }
  });
})();
