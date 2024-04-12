import fs from "fs";
import multer from "multer";
import { promises as fsPromises } from "fs";
import { join } from "path";
import { v2 as cloudinary } from 'cloudinary';

// export const MulterFunction = (dist) => {
//   const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       if (!fs.existsSync(dist)) {
//         fs.mkdirSync(dist, { recursive: true });
//       }
//       cb(null, dist);
//     },
//     filename: function (req, file, cb) {
//       const sanitizedFileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
//       cb(null, sanitizedFileName);
//     },
//   });
//   const upload = multer({ storage: storage });
//   return upload;
// };

// const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dxhmvzcsl',
  api_key: '227118887392159',
  api_secret: 'Tdn7L6P7-aDvQ0qH-sDYCgbWZ8U',
});

export const MulterFunction = (dist) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync(dist)) {
        fs.mkdirSync(dist, { recursive: true });
      }
      cb(null, dist);
    },
    filename: function (req, file, cb) {
      const sanitizedFileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
      cb(null, sanitizedFileName);
    },
  });

  const upload = multer({ storage: storage });

  // Middleware to upload to Cloudinary
  const cloudinaryUpload = (req, res, next) => {
    if (!req.file) {
      return next(); // No file to upload to Cloudinary
    }

    const filePath = req.file.path;

    cloudinary.uploader.upload(filePath, {  resource_type: 'auto'  }, (error, result) => {
      if (error) {
        // Handle Cloudinary upload error
        return res.status(500).json({ error: 'Error uploading to Cloudinary' });
      }

      // Remove the local file after successful Cloudinary upload
      fs.unlinkSync(filePath);

      // Set Cloudinary URL in the req object for further use if needed
      req.cloudinaryUrl = result.secure_url;

      next();
    });
  };

  return [upload.single('bill_image'), cloudinaryUpload];
};

