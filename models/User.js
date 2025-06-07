'use server'

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        unique: true,
        required: [true, "Username is required"]
    },
    password: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

export default mongoose.models?.User || mongoose.model('User', userSchema);