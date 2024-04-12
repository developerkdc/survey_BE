import questionsForProductModel from "../Model/QuestionFrame.model.js"

export const addQuestion = async (req,res)=>{
    try {
        const questionAdd = await questionsForProductModel.create(req.body)
        return res.status(200).json({
            status:"created",
            questionAdd
        })
    } catch (error) {
       return  res.status(500).json({
            status:"failed",
            message:error.message
        })
    }
}

export const getQuestion = async (req,res)=>{
    try {
        const getQuestion = await questionsForProductModel.findOne({_id:req.params.id});
        return res.status(200).json({
            status:"success",
            question:getQuestion
        })
    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:error.message
        })
    }
}

export const getAllQuestion = async (req,res)=>{
    try {
        const getAllQuestion = await questionsForProductModel.find();
        return res.status(200).json({
            status:"success",
            question:getAllQuestion
        })
    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:error.message
        })
    }
}

export const updateQuestion = async (req,res)=>{
    try {
        const {id} = req.params
        const getQuestion = await questionsForProductModel.updateOne({_id:id},{
            $set:{
                "question":req.body.question,
                "options":req.body.options,
                "typeOf":req.body.typeOf,
            }
        });
        return res.status(200).json({
            status:"updated",
            question:getQuestion
        })
    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:error.message
        })
    }
}

export const deleteQuestion = async (req,res)=>{
    try {
        const {id} = req.params
        const deleteQuestion = await questionsForProductModel.deleteOne({_id:id});

        return res.status(200).json({
            status:"deleted",
            question:deleteQuestion
        })
    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:error.message
        })
    }
}