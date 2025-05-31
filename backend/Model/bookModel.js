import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true
    },
    bookName: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    publication: {
        type: String,
        required: true,
        trim: true
    },
    bookType: {
        type: String,
        required: true,
    },
    charges: {
        type: Number,
        required: true,
        min: 0,
    },
    quantity: {
        type: Number,
        required: true,
        min:0,
    },
    availability: {
        type: Boolean,
        default: true,
    },
    language: {
        type: String,
        required: true,
        enum: ["English", "Hindi", "Bilingual"],
        trim: true
    },
    serialNo: {
        type: Number,
        required: true,
        min:0,
    },
}, {
    timestamps: true,
});

export const Book = mongoose.model("Book", bookSchema);