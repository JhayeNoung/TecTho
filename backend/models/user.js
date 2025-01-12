const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 100,
        required: true,
    },
    email: {
        type: String,
        minlength: 3,
        maxlength: 255,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        min: 5,
        max: 255,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
})

userSchema.methods.generateAuthToken = function () {
    // The 'this' context refers to the document, so no need to pass the user as a parameter
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('privateKey'));
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string()
            .min(8)
            .max(20)
            .pattern(/[A-Z]/, "Password must contain at least one uppercase letter.")
            .pattern(/[a-z]/, "Password must contain at least one lowercase letter.")
            .pattern(/[0-9]/, "Password must contain at least one number.")
            .pattern(
                /[!@#$%^&*(),.?":{}|<>]/,
                "Password must contain at least one special character."
            )
            .required(),
        isAdmin: Joi.boolean(),
    });

    return schema.validate(user);
}

// all fields are optional and empty string allowed
function validateUpdateUser(payload) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(100).allow('').optional(),
        email: Joi.string().min(3).max(255).email().allow('').optional(),
        password: Joi.string()
            .min(8)
            .max(20)
            .pattern(/[A-Z]/, "Password must contain at least one uppercase letter.")
            .pattern(/[a-z]/, "Password must contain at least one lowercase letter.")
            .pattern(/[0-9]/, "Password must contain at least one number.")
            .pattern(
                /[!@#$%^&*(),.?":{}|<>]/,
                "Password must contain at least one special character."
            ).allow('').optional(),
        isAdmin: Joi.boolean(),
    });

    return schema.validate(payload);
}


function validateAuth(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });

    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
exports.validateAuth = validateAuth;
exports.validateUpdateUser = validateUpdateUser;