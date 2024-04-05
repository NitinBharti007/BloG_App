require('dotenv').config()

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");

const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const { checkAuthenticationCokkie } = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("MongoDB Connected!"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthenticationCokkie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async(req, res) => {
  const allBlogs = await Blog.find({});
  res.render("Home", {
    user : req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

app.listen(PORT, () => console.log(`Server is runnig on PORT:${PORT}`));
