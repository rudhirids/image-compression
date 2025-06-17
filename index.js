const express = require("express");
const sharp = require("sharp");
const multer = require("multer");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// For JSON body parsing
app.use(bodyParser.json());

// For multipart form uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Combined POST route
app.post("/compress-image", upload.single("image"), async (req, res) => {
  try {
    let imageBuffer;

    if (req.file) {
      // If image file is uploaded
      console.log("Image uploaded via form.");
      imageBuffer = req.file.buffer;
    } else if (req.body.url) {
      // If image URL is provided
      console.log("Image fetched via URL.");
      const response = await axios({
        url: req.body.url,
        method: "GET",
        responseType: "arraybuffer",
      });
      imageBuffer = Buffer.from(response.data);
    } else {
      return res.status(400).send("No image file or URL provided");
    }

    // Compress the image
    const compressedBuffer = await sharp(imageBuffer)
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
