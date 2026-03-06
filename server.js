const express = require("express");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Serve frontend
app.use(express.static(__dirname));

app.get("/download", (req, res) => {
    const videoUrl = req.query.url;
    const quality = req.query.quality || "best";

    if (!videoUrl) {
        return res.status(400).send("No URL provided");
    }

    const ytDlpPath = path.join(__dirname, "yt-dlp.exe");
    const outputTemplate = path.join(__dirname, "downloaded.%(ext)s");

    let format;

    if (quality === "best") {
        format = "bv*+ba/b";
    } else {
        format = `bv*[height<=${quality}]+ba/b`;
    }

    const command = `"${ytDlpPath}" -f "${format}" --merge-output-format mp4 --ffmpeg-location "${__dirname}" -o "${outputTemplate}" "${videoUrl}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error("Download error:", stderr);
            return res.status(500).send("Download failed");
        }

        try {
            const files = fs.readdirSync(__dirname);
            const videoFile = files.find(
                file => file.startsWith("downloaded.") && file.endsWith(".mp4")
            );

            if (!videoFile) {
                return res.status(500).send("File not found");
            }

            const filePath = path.join(__dirname, videoFile);
            const stat = fs.statSync(filePath);

            res.setHeader("Content-Type", "video/mp4");
            res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
            res.setHeader("Content-Length", stat.size);

            const stream = fs.createReadStream(filePath);
            stream.pipe(res);

            stream.on("close", () => {
                fs.unlink(filePath, () => {});
            });

        } catch (err) {
            console.error("File handling error:", err);
            res.status(500).send("Server error");
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});