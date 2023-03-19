const fs = require("fs");
const path = require("path");

describe("public_expect_folders", () => {
    test("google_search_expect_files", () => {
        const publicFolder = path.join(__dirname, "..", "public");
        const expectedFiles = [
            "google0f195ecac6e90bc3.html",
            "index.html",
            "robots.txt",
            "search.xml",
            "sitemap.xml",
        ];

        expectedFiles.forEach((filename) => {
            const filePath = path.join(publicFolder, filename);
            const fileExists = fs.existsSync(filePath);
            expect(fileExists).toBe(true);
        });
    });
});