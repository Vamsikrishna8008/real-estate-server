import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/asserts"); // Specify the directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the original file name
  },
});

export const upload = multer({ storage: storage });

// export const deleteFile=async(path:string)=>{
//   await fs.promises.unlink(path);
// }
