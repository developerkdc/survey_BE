import mongoose from "mongoose";
import mallModel from "../Model/mall.model.js";
import jwt from "jsonwebtoken";


export const getMall = async (req, res) => {
  try {
    const mall = await mallModel.find();
    return res.status(200).json({
      status: "success",
      mall,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const addMall = async (req, res) => {
  try {
    const mallAdd = await mallModel.create(req.body);
    return res.status(200).json({
      status: "created",
      mall: mallAdd,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const updateMall = async (req, res) => {
  try {
    const { id } = req.params;
    const updateMall = await mallModel.updateOne(
      { _id: id },
      {
        $set: req.body,
      }
    );

    return res.status(200).json({
      status: "updated",
      mall: updateMall,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const deleteMall = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteMall = await mallModel.deleteOne({ _id: id });

    return res.status(200).json({
      status: "deleted",
      mall: deleteMall,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const GetMall = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const { sortField = "mall_name", sortOrder = "desc", search, id } = req.query;

    if (id) {
      const mall = await mallModel.findById(id);

      if (!mall) {
        return res.status(400).json({
          status: false,
          data: null,
          message: "Mall not found.",
        });
      }

      return res.status(200).json({
        status: true,
        data: mall,
        message: "Fetched successfully",
      });
    }
    const sort = {};
    if (sortField) sort[sortField] = sortOrder === "asc" ? 1 : -1;

    //search  functionality
    var searchQuery = { deleted_at: null };
    if (search) {
      const searchRegex = new RegExp(".*" + search + ".*", "i");
      searchQuery = {
        ...searchQuery,
        $or: [
          { first_name: searchRegex },
          { last_name: searchRegex },
          { email_id: searchRegex },
          { mobile_no: searchRegex },
          { mall_name: searchRegex },
        ],
      };
    }
    const users = await mallModel
      .find({ ...searchQuery })
      .sort(sort)
      .collation({ locale: "en", caseLevel: true })
      .skip(skip)
      .limit(limit);

    //total pages
    const totalDocuments = await mallModel.countDocuments({
      ...searchQuery,
    });
    // const totalPages = Math.ceil(totalDocuments / limit);

    return res.status(200).json({
      status: true,
      data: users,
      message: "Fetched successfully",
      totalPages: totalDocuments,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      message: "Something went wrong.",
    });
  }
};

export const UpdateUser = async (req, res) => {
  try {
    const mallId = req.params.id;
    const updateData = req.body;
    updateData.updated_at = Date.now();
    if (!mongoose.Types.ObjectId.isValid(mallId)) {
      return res.status(400).json({ status: false, message: "Invalid mall Id", data: null });
    }

    // if (updateData.password) {
    //   const hashedPassword = await bcrypt.hash(updateData.password, 10);
    //   updateData.password = hashedPassword;
    // }
    updateData.updated_at = Date.now();

    const user = await mallModel.findByIdAndUpdate(mallId, { $set: updateData }, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Mall not found.",
      });
    }

    return res.status(200).json({
      status: true,
      data: user,
      message: "Mall updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      message: "Something went wrong.",
    });
  }
};

export const LoginUser = async (req, res) => {
  try {
    const { email_id, password } = req.body;
    // const secretKey = process.env.JWT_SECRET;
    const mall = await mallModel.findOne({ email_id: email_id });
    if (!mall) {
      return res.status(401).json({ message: "User not found with this email Id." });
    }
    // const passwordMatch = await bcrypt.compare(password, mall.password);
    if (!mall.status) {
      return res.status(401).json({ message: "Account has been suspended." });
    }
    if (!(password === mall.password)) {
      return res.status(401).json({ message: "Invalid Password.", status: false });
    }

    const token = jwt.sign({ id: mall._id, emailId: mall.email_id }, "LXSzmpoL1d0FFIlyjzlUIAzV0gARbLoBF4JA2bo", {
      expiresIn: "24hr",
    });

    return res.status(200).json({
      status: true,
      data: {
        mall: mall,
        token: token,
      },
      message: "Login success.",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      message: "Something went wrong.",
    });
  }
};
