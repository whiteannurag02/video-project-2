const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname));

app.get("/download", (req, res) => {

    const url = req.query.url;

    if (!url) {
        return res.send("No URL provided");
    }

    const file = "video.mp4";

    const command = `yt-dlp -f bestvideo+bestaudio --merge-output-format mp4 -o "${file}" ${url}`;

    exec(command, (error) => {

        if (error) {
            console.log(error);
            return res.send("Download failed");
        }

        res.download(file, "video.mp4", () => {
            fs.unlinkSync(file);
        });

    });

});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});