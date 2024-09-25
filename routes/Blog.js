const { Router } = require("express");
const router = Router();
const path = require("path");
const multer = require("multer");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("./public/uploads"))
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`
        cb(null, filename)
    }
})

const upload = multer({ storage: storage })

router.get("/add-new", (req, res) => {
    return res.render("addBlog", {
        user: req.user
    });
});

router.get("/:id",async (req,res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comment = await Comment.find({blogId : req.params.id}).populate("createdBy")
    return res.render("blog",{
        user : req.user,
        blog : blog,
        comments : comment,
    }) 
})

router.post("/", upload.single("coverImg"),async (req, res) => {
    const blog = await Blog.create({
        title : req.body.title,
        body : req.body.body,
        coverImgUrl : `/uploads/${req.file.filename}`,
        createdBy : req.user._id,
    })
    return res.redirect(`/blog/${blog._id}`);
});

router.post("/comment/:blogId", async (req,res) => {
    const comment = await Comment.create({
        content : req.body.content,
        blogId : req.params.blogId,
        createdBy : req.user._id,
    })

    return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
