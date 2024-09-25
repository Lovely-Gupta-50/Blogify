const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/authenticate")


const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,

    },
    passWord: {
        type: String,
        required: true,
    },
    profileImgUrl: {
        type: String,
        default: "/profiles/defaultImg.webp",
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",

    }

}, { timestamps: true });

//this is used for making hash passwords

userSchema.pre("save", function (next) {   //cannot use this pointr in arrow function 
    const user = this;

    if (!user.isModified("passWord")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
        .update(user.passWord)
        .digest("hex");

    this.salt = salt;
    this.passWord = hashedPassword;

    next();
})

//this is a virtual function used for validating password and user
userSchema.static("matchPasswordAndGenerateToken", async function (emailid, password) {
    const user = await this.findOne({ email: emailid });

    if (!user) throw new Error("User Not Found!");

    const salt = user.salt;
    const hashedPassword = user.passWord;

    const userProvHashedPassword = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    if (hashedPassword !== userProvHashedPassword) throw new Error("Incorrect password")
    const token = createTokenForUser(user);
    return token;
})

const User = model("user", userSchema);

module.exports = User;