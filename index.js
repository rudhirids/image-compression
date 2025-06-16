const express = require("express");
const sharp = require("sharp");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const PORT = 3000;
app.use(bodyParser.json());
app.get("/compress-image", async (req, res) => {
  try {
    const imageUrl = req.body.url;
    if (!imageUrl) {
      return res.status(400).send("Missing image URL");
    }

    // Fetch the image from the URL
    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "arraybuffer",
    });

    const imageBuffer = Buffer.from(response.data);

    const outputPath = path.join("./", `compressed_image.jpeg`);
    // Use sharp to compress image without losing quality
    // For lossless compression, convert PNG/JPEG to WebP lossless or optimize JPEG/PNG
    const compressedBuffer = await sharp(imageBuffer)
      .jpeg({ nearLossless: true, quality: 10, effort: 6 }) // lossless WebP compression
      .toFile(outputPath);

    // Set appropriate headers and send compressed image
    res.set("Content-Type", "image/jpeg");
    res.send(compressedBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, "localhost", () => {
  console.log(`Image compression server running on port ${PORT}`);
});
