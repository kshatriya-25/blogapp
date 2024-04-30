/* OM VIGHNHARTAYE NAMO NAMAH : */

require("dotenv").config();

const express = require("express");

const app = express();

const mongoose = require("mongoose");

const path = require("path");

const cookieParser = require("cookie-parser");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const blog = require("./models/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const port = process.env.PORT || 8000;

//USE THIS IN LOCALhOST = mongodb://127.0.0.1:27017/blogify

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongodb Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await blog.find({});
  console.log(req.user);
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(port, () => console.log(`server started at port ${port}`));
