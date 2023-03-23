const fs = require("fs");
const path = require("path");

test("loaderio_expect", () => {
    const publicFolder = path.join(__dirname, "..", "public");
    const filePath = path.join(publicFolder, "google0f195ecac6e90bc3.html");
    const fileExists = fs.existsSync(filePath);
    expect(fileExists).toBe(true);
});
