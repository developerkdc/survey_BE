import mongoose from "mongoose";
import RatingAndReviewsModel from "../Model/RatingAndReviews.model.js";
import mallModel from "../Model/mall.model.js";
import questionsForProductModel from "../Model/QuestionFrame.model.js";

// export const addRatingAndReviews = async (req,res)=>{
//     try {
//         const addRNR = await RatingAndReviewsModel.create(req.body);
//         res.status(200).json({
//             status:"created",
//             RatingAndReviews:addRNR
//         })
//     } catch (error) {
//         res.status(500).json({
//             status:"failed",
//             message:error.message
//         })
//     }
// }
export const addRatingAndReviews = async (req, res) => {
  try {
    const starQuestions = req.body.questionAndAnswer.filter((question) => question.typeOf === "stars");
    let averageRating = 0;
    if (starQuestions && starQuestions.length) {
      // Calculate the sum of star ratings
      const sumOfStars = starQuestions.reduce((sum, question) => sum + parseInt(question.answer), 0);
      // Calculate the average star rating
      averageRating = parseFloat(((sumOfStars * 5) / (starQuestions.length * 5)).toFixed(1));
    }
    const addRNR = await RatingAndReviewsModel.create({ ...req.body, ratingAvg: averageRating });
    res.status(200).json({
      status: true,
      RatingAndReviews: addRNR,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
export const addUser = async (req, res, cloudinaryUrl) => {
  try {
    // const files = req.files;
    // let imageName = null;

    // if (files && Object.keys(files).length > 0) {
    //   imageName = files.bill_image[0].filename;
    // }
    let metaData = {};
    if (req.body.meta_data) {
      metaData = JSON.parse(req.body.meta_data) || {};
    }
    const addRNRUser = await RatingAndReviewsModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          "user.name": req.body.name,
          "user.email": req.body.email,
          "user.contact": req.body.contact,
          "user.city": req.body.city,
          "user.feedback": req.body.feedback,
          "user.gender": req.body.gender,
          "user.dob": req.body.dob,
          "user.profession": req.body.profession,
          "user.bill": cloudinaryUrl || "",
          "user.meta_data": metaData,
        },
      },
      { new: true }
    );
    res.status(200).json({
      status: true,
      RatingAndReviews: addRNRUser,
    });
  } catch (error) {
    res.status(500).json({
      status:false,
      message: error.message,
    });
  }
};

export const getRatingAndReviewsUser = async (req, res) => {
  try {
    const { search, sortOrder = "desc", sortField = "created_at", mall_id } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const match = {};
    if (search) {
      match.$or = [
        { "user.name": { $regex: new RegExp(search, "i") } },
        { "user.email": { $regex: new RegExp(search, "i") } },
        { "user.city": { $regex: new RegExp(search, "i") } },
        { "user.contact": { $regex: new RegExp(search, "i") } },
        { "mall.name": { $regex: new RegExp(search, "i") } },
        { "user.profession": { $regex: new RegExp(search, "i") } },
        { "user.gender": { $regex: new RegExp(search, "i") } },
        { "user.contact": { $regex: new RegExp(search, "i") } },
      ];
    }
    const filter = {};
    if (mall_id) filter["mall.mallId"] = mall_id;
    console.log(sortOrder, sortField);
    const sort = {};
    if (sortField) sort[sortField] = sortOrder === "asc" ? 1 : -1;
    console.log(sort);
    const getRNR = await RatingAndReviewsModel.find({ ...match, ...filter })
      .sort(sort)
      .collation({ locale: "en", caseLevel: true })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalDocuments = await RatingAndReviewsModel.countDocuments({
      ...match,
      ...filter,
    });

    // const totalPages = Math.ceil(totalDocuments / limit);
    res.status(200).json({
      status: "success",
      RatingAndReviews: getRNR,
      totalPages: totalDocuments,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

// export const getRatingAndReviews = async (req, res) => {
//     try {
//         const { id } = req.query;
//       console.log(id);
//         // Find the mall by mallId
//         // Extract questions and answers count
//         const feedbackData = await RatingAndReviewsModel.find({
//           "mall.mallId": id,
//         });

//         const result = {};

//         for (const feedback of feedbackData) {
//           for (const qa of feedback.questionAndAnswer) {
//             const questionInfo = await questionsForProductModel.findById(qa.questionId);

//             let optionIndexMap;

//             if (!result[qa.questionId]) {
//               // Create a map to store the index of each option in questionInfo.options
//               optionIndexMap = new Map();
//               questionInfo.options.forEach((option, index) => {
//                 optionIndexMap.set(option, index);
//               });

//               // Initialize the option counts for each question in the same sequence as questionInfo.options
//               const optionCounts = {};
//               questionInfo.options.forEach((option) => {
//                 optionCounts[option] = 0;
//               });

//               result[qa.questionId] = {
//                 question: questionInfo.question,
//                 typeOf: questionInfo.typeOf,
//                 options: questionInfo.options,
//                 totalAnswers: 0,
//                 optionCounts,
//                 users: [],
//               };
//             } else {
//               optionIndexMap = new Map();
//               result[qa.questionId].options.forEach((option, index) => {
//                 optionIndexMap.set(option, index);
//               });
//             }

//             result[qa.questionId].totalAnswers += 1;

//             // Update the option counts in the correct order
//             qa.answer.forEach((option) => {
//               const index = optionIndexMap.get(option);
//               result[qa.questionId].optionCounts[option] += 1;
//             });

//             result[qa.questionId].users.push({
//               name: feedback.user.name,
//               email: feedback.user.email,
//               contact: feedback.user.contact,
//               city: feedback.user.city,
//               feedback: feedback.user.feedback,
//             });
//           }
//         }

//         res.json(result);
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }

// };

export const getRatingAndReviews = async (req, res) => {
  try {
    console.log("hvbsdfbb");
    const { id } = req.query;

    const result = await RatingAndReviewsModel.aggregate([
      {
        $match: {
          "mall.mallId": new mongoose.Types.ObjectId(id),
        },
      },
      {
        $unwind: "$questionAndAnswer",
      },
      {
        $lookup: {
          from: "questionsforproducts",
          localField: "questionAndAnswer.questionId",
          foreignField: "_id",
          as: "questionInfo",
        },
      },
      {
        $unwind: "$questionInfo",
      },
      {
        $group: {
          _id: "$questionAndAnswer.questionId",
          question: { $first: "$questionInfo.question" },
          typeOf: { $first: "$questionInfo.typeOf" },
          options: { $first: "$questionInfo.options" },
          totalAnswers: { $sum: 1 },
          optionCounts: {
            $push: "$questionAndAnswer.answer",
          },
          users: {
            $push: {
              name: "$user.name",
              email: "$user.email",
              contact: "$user.contact",
              city: "$user.city",
              feedback: "$user.feedback",
            },
          },
        },
      },
      {
        $unwind: "$optionCounts",
      },
      {
        $group: {
          _id: "$_id",
          question: { $first: "$question" },
          typeOf: { $first: "$typeOf" },
          options: { $first: "$options" },
          totalAnswers: { $first: "$totalAnswers" },
          optionCounts: {
            $push: "$optionCounts",
          },
          users: { $first: "$users" },
        },
      },
      {
        $project: {
          _id: 0,
          questionId: "$_id",
          question: 1,
          typeOf: 1,
          options: 1,
          totalAnswers: 1,
          optionCounts: 1,
          users: 1,
        },
      },
    ]);

    // console.log("Raw Result:", result);
    // console.log("Result Before Match:", result);

    // const resultAfterMatch = result.filter(item => item.optionCounts.every(answer => answer !== undefined && answer !== ''));

    // console.log("Result After Match:", resultAfterMatch);

    // Transform result into a more structured format
    // const formattedResult = result.reduce((acc, item) => {
    //   acc[item.questionId] = {
    //     question: item.question,
    //     typeOf: item.typeOf,
    //     options: item.options,
    //     totalAnswers: item.totalAnswers,
    //     optionCounts: item.optionCounts.reduce((counts, option) => {
    //       if (Array.isArray(option)) {
    //         option.forEach((individualOption) => {
    //           counts[individualOption] = (counts[individualOption] || 0) + 1;
    //         });
    //       } else {
    //         counts[option] = (counts[option] || 0) + 1;
    //       }
    //       return counts;
    //     }, {}),
    //     users: item.users,
    //   };
    //   return acc;
    // }, {});

    // console.log("Formatted Result:", formattedResult);

    // res.json(formattedResult);
    const formattedResult = result.reduce((acc, item) => {
      acc[item.questionId] = {
        question: item.question,
        typeOf: item.typeOf,
        options: item.options,
        totalAnswers: item.totalAnswers,
        optionCounts: item.optionCounts.reduce((counts, option) => {
          if (option !== "") {
            if (Array.isArray(option)) {
              option.forEach((individualOption) => {
                counts[individualOption] = (counts[individualOption] || 0) + 1;
              });
            } else {
              counts[option] = (counts[option] || 0) + 1;
            }
          }
          return counts;
        }, {}), // Initialize optionCounts as an empty object
        users: item.users,
      };

      return acc;
    }, {});

    // console.log("Formatted Result:", formattedResult);

    res.json(formattedResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// app.get('/mallQuestions', async (req, res) => {
//     try {
//       // Replace 'mallId' with the actual ObjectId of the mall you're interested in
//       const mallId = mongoose.Types.ObjectId('653362ce556d3b50f165fe9c');

//       // Find the mall by mallId
//       const mall = await Mall.findOne({ 'mall.mallId': mallId });

//       // Extract questions and answers count
//       const result = mall.questionAndAnswer.map((qa) => {
//         const questionSummary = {
//           question: qa.question,
//           totalAnswers: qa.answer.length,
//           optionCounts: {},
//         };

//         // Count occurrences of each option
//         qa.answer.forEach((option) => {
//           questionSummary.optionCounts[option] = (questionSummary.optionCounts[option] || 0) + 1;
//         });

//         return questionSummary;
//       });

//       // Send the result
//       res.json(result);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

// db.review.aggregate([
//     {
//       $unwind: "$answer"
//     },
//     {
//       $lookup: {
//         from: "questionsforproduct",
//         localField: "question",
//         foreignField: "_id",
//         as: "questionDetails"
//       }
//     },
//     {
//       $unwind: "$questionDetails"
//     },
//     {
//       $group: {
//         _id: {
//           questionId: "$question",
//           option: "$answer"
//         },
//         users: {
//           $addToSet: "$user.email"
//         },
//         optionCount: {
//           $sum: 1
//         }
//       }
//     },
//     {
//       $group: {
//         _id: "$_id.questionId",
//         options: {
//           $push: {
//             option: "$_id.option",
//             userCount: {
//               $size: "$users"
//             },
//             optionCount: "$optionCount"
//           }
//         }
//       }
//     },
//     {
//       $project: {
//         _id: 0,
//         questionId: "$_id",
//         options: 1
//       }
//     }
//   ]);

export const getAllUserForQuestion = async (req, res, next) => {
  try {
    const { mallId, questionId } = req.query;

    const data = await RatingAndReviewsModel.find({
      "mall.mallId": mallId,
      "questionAndAnswer.questionId": questionId,
    });

    // Extracting the desired information from the result
    const extractedData = data.map((entry) => {
      const userAndMall = {
        user: entry.user,
        mall: entry.mall,
      };

      // Find the specific object from the questionAndAnswer array
      const questionAndAnswer = entry.questionAndAnswer.find((qa) => qa.questionId.toString() === questionId);

      return questionAndAnswer ? { ...userAndMall, questionAndAnswer } : null;
    });

    // Filter out null entries (where the questionAndAnswer wasn't found)
    const filteredData = extractedData.filter((entry) => entry !== null);

    // Do something with the extracted data, such as sending it in the response
    return res.status(200).json(filteredData);
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
