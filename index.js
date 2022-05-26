// Import libraries
const fs = require("fs");
const pngToIco = require("png-to-ico");
const { createCanvas, loadImage } = require("canvas");
const clc = require("cli-color");

// Program constants
const inputFolder = "./input/";
const outputFolder = "./output/";
const size = 256;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext("2d");

// Creates io folders if they dont exist
if(!fs.existsSync(inputFolder))
    fs.mkdirSync(inputFolder);
if(!fs.existsSync(outputFolder))
    fs.mkdirSync(outputFolder);

// Reads and converts every valid file in input folder
const files = fs.readdirSync(inputFolder);
console.log(`\nAttempting to convert ${files.length} file(s) . . .`);
files.forEach((file) => {
    loadImage(inputFolder + file).then((image) => {
        // Prepare canvas and scale image to fit declared size
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const scale = size / (image.width + image.height);
        let width = image.width * scale;
        let height = image.height * scale;
        ctx.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);

        // Convert scaled image to ico
        const tempPath = outputFolder + file.replace(/\.[^.]+$/, ".png");
        const outputPath = outputFolder + file.replace(/\.[^.]+$/, ".ico");
        fs.writeFileSync(tempPath, canvas.toBuffer());
        pngToIco(tempPath).then((buffer) => {
            fs.writeFileSync(outputPath, buffer);
            fs.unlink(tempPath, () => {});
            console.log(clc.green(`\t[${width.toFixed(2).padStart(6, "0")} x ${height.toFixed(2).padStart(6, "0")}] ${file}`));
        });
    }).catch((error) => {
        console.log(clc.red(`\t[     error     ] ${file}`));
    });
});
console.log();
