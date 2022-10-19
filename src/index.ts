import { createWriteStream, readdirSync, lstatSync } from "fs";
import { getType } from "mime";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import PDF from "pdfkit";

const argv = yargs(hideBin(process.argv))
  .option("output", {
    alias: "o",
    type: "string",
  })
  .parseSync();

function arrangeInputs(inputs: string[]): string[] {
  const images: string[] = [];

  for (const input of inputs) {
    const type = getType(input);
    if (type && type.startsWith("image")) {
      images.push(`${input}`);
    } else if (lstatSync(input).isDirectory()) {
      const folderFiles = readdirSync(input);
      images.push(...arrangeInputs(folderFiles.map((f) => input + "/" + f)));
    }
  }

  return images;
}

function main(inputs: string[], output: string = "output.pdf") {
  const images = arrangeInputs(inputs);

  const document = new PDF({ size: "A4", margin: 0 });

  document.pipe(createWriteStream(output));

  const pages = images.length;
  if (pages === 0) return;

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

main(
  argv._.map((f) => String(f)),
  argv.output
);
