const mongoose = require("mongoose");
const argon2 = require("argon2");

const userSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        unique: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    Avatar: {
        type: String,
        required: true
    }
}, { timestamps: true });

userSchema.methods.comparePassword = async function(Password) {
    try {
        console.log("Comparing entered password with hashed password...");
        const isMatch = await argon2.verify(this.Password, Password);
        console.log("Password match:", isMatch);
        return isMatch;
    } catch (error) {
        console.error("Error verifying password:", error);
        return false;
    }
};

module.exports = mongoose.model("UserModel", userSchema);
