const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")


mongoose.connect("mongodb://localhost:27017/blogify")
.then((e) => console.log("mongoDB connected"))

const userRoute = require("./routes/user");
const blogRoute = require("./routes/Blog")
const { checkUserAuthentication } = require("./middlewares/authenticate");
const Blog = require("./models/blog");

const app = express()
const PORT = 8000;

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(checkUserAuthentication("token"));
app.use(express.static(path.resolve("./public")));

app.get("/",async (req,res) => {
    const allBlogs =  await Blog.find({});
    res.render("home",{
        blogs : allBlogs,
        user : req.user,
    });
})

app.use("/user",userRoute);
app.use("/blog",blogRoute)

app.listen(PORT,() => console.log(`server started at port ${PORT}`))