const axios = require("axios");
const https = require('https');

describe("https_status", () => {
    test("Homepage loads successfully", async () => {
        const response = await axios.get(
            "https://chienniman-devlogs.onrender.com/"
        );
        expect(response.status).toBe(200);
    });
    test("site_is_https", async () => {
        const options = {
            hostname: "chienniman-devlogs.onrender.com",
            port: 443,
            path: "/",
            method: "GET",
        };
        const req = https.request(options, (res) => {
            expect(res.statusCode).toBe(200);
            expect(res.socket.getProtocol()).toBe("TLSv1.3");
            expect(res.connection.authorized).toBe(true);
        });
        req.end();
    });
});
