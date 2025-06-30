'use server'

import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    github: {
        type: String,
        required: true
    },
    preview: {
        type: String
    },
    draft: {
        type: Boolean,
        default: false
    }
});

export default mongoose.models?.Project || mongoose.model('Project', projectSchema);