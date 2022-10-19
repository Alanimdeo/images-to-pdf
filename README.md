# Images to PDF Converter

## Usage

If -o(--output) is not specified, the name of the output file will be "output.pdf".

npm:

```bash
npm run convert -- [-o output.pdf] <inputs>
```

yarn:

```bash
yarn convert [-o output.pdf] <inputs>
```

## Example

You can add images by adding filenames or directories to the command line arguments.

```bash
$ yarn convert -o document.pdf image1.png image2.png # Specify images

$ yarn convert images # Add all images recursively in the directory

$ yarn convert images image1.png # Can add directories and images together
```
