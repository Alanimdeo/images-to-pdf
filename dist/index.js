"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const mime_1 = require("mime");
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const pdfkit_1 = __importDefault(require("pdfkit"));
const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .option("output", {
    alias: "o",
    type: "string",
})
    .parseSync();
function arrangeInputs(inputs) {
    const images = [];
    for (const input of inputs) {
        const type = (0, mime_1.getType)(input);
        if (type && type.startsWith("image")) {
            images.push(`${input}`);
        }
        else if ((0, fs_1.lstatSync)(input).isDirectory()) {
            const folderFiles = (0, fs_1.readdirSync)(input);
            images.push(...arrangeInputs(folderFiles.map((f) => input + "/" + f)));
        }
    }
    return images;
}
function main(inputs, output = "output.pdf") {
    const images = arrangeInputs(inputs);
    const document = new pdfkit_1.default({ size: "A4", margin: 0 });
    document.pipe((0, fs_1.createWriteStream)(output));
    const pages = images.length;
    if (pages === 0)
        return;
    // 1페이지가 자동 생성되므로 예외적으로 직접 추가
    console.log(`이미지 추가 중... (${"1".padStart(String(pages).length, "0")}/${pages} | ${images[0]})`);
    document.image(images.shift(), {
        fit: [document.page.width, document.page.height],
        align: "center",
        valign: "center",
    });
    images.forEach((image, index) => {
        console.log(`이미지 추가 중... (${String(index + 2).padStart(String(pages).length, "0")}/${pages} | ${image})`);
        document.addPage({ size: "A4", margin: 0 });
        document.image(image, {
            fit: [document.page.width, document.page.height],
            align: "center",
            valign: "center",
        });
    });
    document.end();
}
main(argv._.map((f) => String(f)), argv.output);
