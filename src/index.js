// Import libraries
const fs = require("fs");
const pngToIco = require("png-to-ico");
const { createCanvas, loadImage } = require("canvas");
const clc = require("cli-color");

// Program settings
const inputFolder = "../input/";
const tempFolder = "./temp/";
const outputFolder = "../output/";
const size = 256;

// Variables
const canvas = createCanvas(size, size);
const ctx = canvas.getContext("2d");

// Reads and converts every valid file in input folder
(async () => {
    const files = fs.readdirSync(inputFolder);
    console.log(`\nAttempting to convert ${files.length} file(s) . . .\n`);
    for(let file of files) {
        try {
            // Load image and reset canvas
            const image = await loadImage(inputFolder + file);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Scale image to fit input size
            const scale = size / (image.width + image.height);
            let width = image.width * scale;
            let height = image.height * scale;
            console.log(clc.green(`\t[${width.toFixed(2).padStart(6, "0")} x ${height.toFixed(2).padStart(6, "0")}] ${file}`));

            // Convert scaled image to ico
            const tempPath = tempFolder + file.replace(/\.[^.]+$/, ".png");
            const outputPath = outputFolder + file.replace(/\.[^.]+$/, ".ico");
            ctx.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
            fs.writeFileSync(tempPath, canvas.toBuffer());
            fs.writeFileSync(outputPath, await pngToIco(tempPath));
            fs.unlink(tempPath, () => {});
        } catch(err) {
            console.log(clc.red(`\t[     error     ] ${file}`));
        }
    }
    console.log();
})();
