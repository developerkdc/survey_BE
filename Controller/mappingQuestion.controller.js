import mongoose from "mongoose";
import mappingQuestionModel from "../Model/mappingQuestion.model.js";

export const addMappingQuestions = async (req, res) => {
  try {
    const { mallId, questionId } = req.body;
    console.log(mallId, questionId, "added");
    if (!mallId.length || !questionId) throw new Error("No mapping");
    let alreadymapped = await mappingQuestionModel.findOne({
      $and: [{ questionId: questionId }, { mallId: mallId }],
    });
    console.log(alreadymapped);
    if (alreadymapped) {
      return res.status(409).json({
        status: "failed",
        message: "This question is already mapped to this mall",
      });
    }
    const addMappingQuestions = await mappingQuestionModel.insertMany(
      mallId.map((mallId) => {
        return {
          mallId: mallId,
          questionId: questionId,
        };
      })
    );
    return res.status(200).json({
      status: "created",
      addMappingQuestions,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const getMappingQuestions = async (req, res) => {
  try {
    let matchType = {};
    if (req.query.type === "stars") {
      matchType = { "questionId.typeOf": { $eq: req.query.type } };
    } else if (req.query.type === "all") {
      matchType = {};
    } else {
      matchType = { "questionId.typeOf": { $ne: "stars" } };
    }
    const getMappingQuestions = await mappingQuestionModel.aggregate([
      {
        $match: { mallId: new mongoose.Types.ObjectId(req.params.mallId) },
      },
      {
        $lookup: {
          from: "malls",
          foreignField: "_id",
          localField: "mallId",
          as: "mallId",
        },
      },
      {
        $lookup: {
          from: "questionsforproducts",
          foreignField: "_id",
          localField: "questionId",
          as: "questionId",
        },
      },
      {
        $unwind: "$mallId",
      },
      {
        $unwind: "$questionId",
      },
      {
        $match: matchType,
      },
      {
        $project: {
          mallId: {
            __v: 0,
          },
          questionId: {
            __v: 0,
          },
          __v: 0,
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      getMappingQuestions,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const deleteMappingQuestions = async (req, res) => {
  try {
    const { mallId, questionId } = req.params;
    console.log(mallId, questionId, "deleted");
    const deleteMappingQuestions = await mappingQuestionModel.deleteOne({
      mallId: mallId,
      questionId: questionId,
    });
    res.status(200).json({
      status: "deleted",
      deleteMappingQuestions,
    });
  } catch (error) {
    res.status(200).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const mappedQuestionsList = async (req, res) => {
  try {
    const mappedquestion = await mappingQuestionModel.find({});
    console.log(mappedquestion);
    res.status(200).json({
      status: "success",
      mappedquestion,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};
