import mongoose from "mongoose";

const mappingQuestionSchema = new mongoose.Schema({
    mallId:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"mallId is required"],
        ref:"mall"
    },
    questionId:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"questionId is required"]
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, default: null },
})

const mappingQuestionModel = mongoose.model("mappingQuestion",mappingQuestionSchema);
export default mappingQuestionModel;