const express = require("express");
const sharp = require("sharp");
const multer = require("multer");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/compress-image", upload.single("image"), async (req, res) => {
  try {
    let imageBuffer;

    if (req.file) {
      console.log("Image uploaded via form.");
      imageBuffer = req.file.buffer;
    } else if (req.body.url) {
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

    const imageSharp = sharp(imageBuffer);

    const metadata = await imageSharp.metadata();

    // Only resize if image is wider than 1600px
    if (metadata.width > 1600) {
      imageSharp.resize({ width: 1600 });
    }

    const compressedBuffer = await imageSharp
      .webp({
        quality: 100,
        effort: 6,
      })
      .withMetadata(false)
      .toBuffer();

    res.set("Content-Type", "image/webp");
    res.send(compressedBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Optimized image compression server running on port ${PORT}`);
});
