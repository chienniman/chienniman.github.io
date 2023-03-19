const fs = require("fs");
const path = require("path");

describe("public_expect_folders", () => {
    test("contains_expected_assets_folders", () => {
        const publicFolder = path.join(__dirname, "..", "public");
        const expectedFolders = ["/", "css", "images", "img", "js"];

        expectedFolders.forEach((folderName) => {
            const folderPath = path.join(publicFolder, folderName);
            const folderExists =
                fs.existsSync(folderPath) &&
                fs.lstatSync(folderPath).isDirectory();
            expect(folderExists).toBe(true);
        });
    });
});
