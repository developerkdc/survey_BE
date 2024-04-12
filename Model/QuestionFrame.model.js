import mongoose from "mongoose";
const questionsForProductSchema = new mongoose.Schema({
    question: { type: String },
    typeOf: {
        type: String,
        enum: {
            values: ["multiLine", "multipleChoice", "singleChoice", "stars"],
            message: 'Should be any one of multiLine, multipleChoice, or singleChoice'
        }
    },
    options: {
        type: [{ type: String }],
        default: null
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, default: null },

});

const questionsForProductModel = mongoose.model("questionsForProduct", questionsForProductSchema)

export default questionsForProductModel;