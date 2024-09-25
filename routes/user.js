const { Router } = require("express");

const User = require("../models/user");

const router = Router();

router.get("/signup",(req,res) => {
    return res.render("signup")
})

router.get("/signin",(req,res) => {
    return res.render("signin")
})

router.post("/signup",async (req,res) => {
    const { fullname, emailid, password} = req.body;
    
    await User.create({
        fullName : fullname,
        email : emailid,
        passWord : password,
    });

    return res.redirect("/");
 
});

router.post("/signin",async (req,res) => {
    const { emailid, password } = req.body;
    try{
        const token = await User.matchPasswordAndGenerateToken( emailid , password );
        return res.cookie("token",token).redirect("/");
    }
    catch(error){
        res.render("signin",{
            error : "Incorrect Email or Password",
        });
    }

});

router.get("/logout",(erq,res) => {
    res.clearCookie("token").redirect("/");
})

module.exports = router;