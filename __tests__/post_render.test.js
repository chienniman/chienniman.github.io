const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

describe("post_render", () => {
    const postsDir = path.join(__dirname, "..", "source", "_posts");
    fs.readdirSync(postsDir).forEach((file) => {
        const postPath = path.join(postsDir, file);
        const postContent = fs.readFileSync(postPath, "utf-8");
        const post = matter(postContent);

        test(`renders_the_correct_title for ${file}`, () => {
            const fileNameWithoutExtension = file.split('.')[0];
            expect(post.data.title).toBe(fileNameWithoutExtension);
        });

        test(`renders_the_correct_author for ${file}`, () => {
            expect(post.data.author).toBe("Boris Chien");
        });
    });

    test("renders_the_correct_date", () => {
        expect(new Date(post.data.date)).toEqual(
            new Date("2023-02-16T22:01:31.000Z")
        );
    });
});
