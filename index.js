const express = require("express");
const sharp = require("sharp");
const multer = require("multer");
const app = express();
const PORT = process.env.PORT || 3000;

// Set up multer for file uploads (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST endpoint for image upload & compression
app.post("/compress-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No image file uploaded");
    }

    const compressedBuffer = await sharp(req.file.buffer)
      .jpeg({ quality: 50 })
      .toBuffer();

    res.set("Content-Type", "image/jpeg");
    res.send(compressedBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Image compression server running on port ${PORT}`);
});
