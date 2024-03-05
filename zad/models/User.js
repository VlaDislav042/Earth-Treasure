const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        minLength: 10,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: 4,
        unique: true,
    },
    createdStones: [{
        type: mongoose.Types.ObjectId,
        ref: 'Course',
    }],
    likedStones: [{
        type: mongoose.Types.ObjectId,
        ref: 'Course',
    }],
});

userSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 12);
});


userSchema.virtual('rePassword')
    .set(function (value) {
        if (value !== this.password) {
            throw new Error('Password mismatch!')
        }
    });


const User = mongoose.model('User', userSchema);

module.exports = User;