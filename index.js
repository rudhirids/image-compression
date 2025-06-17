const express = require("express");
const sharp = require("sharp");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/compress-image", async (req, res) => {
  try {
    const imageUrl = req.query.url; // <-- use query for GET
    if (!imageUrl) {
      return res.status(400).send("Missing image URL");
    }

    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "arraybuffer",
    });

    const imageBuffer = Buffer.from(response.data);

    const compressedBuffer = await sharp(imageBuffer)
      .jpeg({ quality: 50 }) // adjust quality as needed
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
