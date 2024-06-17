require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/database");
const multer = require("multer");
const path = require("path");

const app = express();

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + path.extname(file.originalname);
    console.log("Saving file as", filename);
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques depuis le dossier "uploads"
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Servir les fichiers statiques du dossier "client/build"
app.use(express.static(path.join(__dirname, '../client/build')));

const userRoutes = require("./routes/user.js");
const postRoutes = require("./routes/post.js");
const commentRoutes = require("./routes/comment.js");

app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 5002;

sequelize
  .sync({ alter: true }) // Utilisez `alter: true` pour mettre à jour les tables sans les recréer
  .then(async () => {
    console.log("Database synced");
    const User = require("./models/User");

    // Vérifier si les utilisateurs existent déjà
    const user1 = await User.findOne({ where: { email: "user1@example.com" } });
    const user2 = await User.findOne({ where: { email: "user2@example.com" } });

    // Ajouter les utilisateurs si nécessaire
    if (!user1) {
      await User.create({
        name: "User1",
        email: "user1@example.com",
        password: "password1",
      });
    }
    if (!user2) {
      await User.create({
        name: "User2",
        email: "user2@example.com",
        password: "password2",
      });
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// Serve React client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});