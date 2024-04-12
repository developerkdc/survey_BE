import mongoose from "mongoose";

const mallSchema = new mongoose.Schema({
  mall_name: {
    type: String,
    required: [true, "Mall name is required."],
    indexedDB: true,
    trim: true,
    unique: [true, "Mall Name already exist."],
  },
  first_name: { type: String, required: true, trim: true },
  last_name: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  device_type: { type: String, trim: true },
  model: { type: String, trim: true },
  sr_no: { type: String, trim: true },
  email_id: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: [true, "Email ID Required"],
    trim: true,
    unique: [true, "Email ID already exist."],
  },
  password: { type: String, required: true, trim: true },
  mobile_no: { type: String, trim: true, default: null },
  status: { type: Boolean, default: true },
//   role_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: [true, "Role is Required"],
//     ref: "roles",
//   },
//   otp: { type: String, trim: true, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const mallModel = mongoose.model("mall", mallSchema);
export default mallModel;
