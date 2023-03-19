const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

describe("post_render", () => {
    const postPath = path.join(
        __dirname,
        "..",
        "source",
        "_posts",
        "教你4小時輕鬆考取AZ-900.md"
    );
    const postContent = fs.readFileSync(postPath, "utf-8");
    const post = matter(postContent);

    test("renders_the_correct_title", () => {
        expect(post.data.title).toBe("4小時輕鬆考取AZ-900心得");
    });

    test("renders_the_correct_author", () => {
        expect(post.data.author).toBe("Boris Chien");
    });

    test("renders_the_correct_date", () => {
        expect(new Date(post.data.date)).toEqual(new Date("2023-02-16T22:01:31.000Z"));
    });
});
