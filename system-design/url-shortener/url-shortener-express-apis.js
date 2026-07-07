/*********************************************************************
 * URL SHORTENER
 *
 * This program implements the URL Shortener discussed in
 * Alex Xu's "System Design Interview".
 *
 * Instead of using MySQL, Redis etc.,
 * we use JavaScript Maps so that we can focus on
 * understanding the algorithm.
 *********************************************************************/

const express = require("express");

// Create an Express application.
const app = express();

// Express normally cannot understand JSON.
// This middleware tells Express:
//
// "Whenever a client sends JSON,
// convert it into a JavaScript object."
//
// Example:
//
// Client sends:
//
// {
//      "longUrl":"https://google.com"
// }
//
// Express converts it into:
//
// req.body.longUrl
//
app.use(express.json());

/*********************************************************************
 * DATABASE
 *
 * We maintain TWO Maps.
 *
 * Why two?
 *
 * Alex Xu's flowchart has two operations:
 *
 * 1) Check whether long URL already exists.
 * 2) Redirect using short URL.
 *
 * If we kept only one Map,
 * one of these operations becomes slow.
 *
 * Therefore we maintain:
 *
 * Long URL  ---> Short URL
 *
 * and
 *
 * Short URL ---> Long URL
 *
 *********************************************************************/

const longToShort = new Map();

const shortToLong = new Map();

/*********************************************************************
 * BASE62 CHARACTERS
 *
 * Base62 uses:
 *
 * 0-9
 * A-Z
 * a-z
 *
 * Total = 62 characters.
 *********************************************************************/

const BASE62 =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/*********************************************************************
 * ID GENERATOR
 *
 * Imagine this is MySQL AUTO_INCREMENT.
 *
 * First URL gets ID = 1
 * Second URL gets ID = 2
 * Third URL gets ID = 3
 *
 * In a real production system,
 * Alex Xu recommends a distributed ID generator.
 *********************************************************************/

let currentId = 1;

/*********************************************************************
 * CONVERT DECIMAL NUMBER INTO BASE62
 *
 * Example:
 *
 * 125
 *
 * ↓
 *
 * 21
 *
 * The algorithm repeatedly divides by 62.
 *********************************************************************/

function encodeBase62(number)
{
    if (number === 0)
    {
        return "0";
    }

    let result = "";

    while (number > 0)
    {
        // Find remainder.
        //
        // Remainder tells us which Base62
        // character should be used.
        let remainder = number % 62;

        result = BASE62[remainder] + result;

        // Move to next digit.
        number = Math.floor(number / 62);
    }

    return result;
}

/*********************************************************************
 * POST API
 *
 * POST /api/v1/data/shorten
 *
 * Request:
 *
 * {
 *      "longUrl":"https://www.google.com"
 * }
 *
 * Response:
 *
 * {
 *      "shortUrl":"1"
 * }
 *
 *********************************************************************/

app.post("/api/v1/data/shorten", (req, res) =>
{
    // Read JSON from request body.
    const longUrl = req.body.longUrl;

    /***************************************************************
     * STEP 1
     *
     * Check whether this URL already exists.
     *
     * This matches Alex Xu's flowchart:
     *
     * "longURL in DB?"
     *
     ***************************************************************/

    if (longToShort.has(longUrl))
    {
        return res.json({
            shortUrl: longToShort.get(longUrl)
        });
    }

    /***************************************************************
     * STEP 2
     *
     * Generate a new ID.
     ***************************************************************/

    const id = currentId++;

    /***************************************************************
     * STEP 3
     *
     * Convert ID into Base62.
     ***************************************************************/

    const shortUrl = encodeBase62(id);

    /***************************************************************
     * STEP 4
     *
     * Save into our "database".
     *
     * Long URL -> Short URL
     *
     * Short URL -> Long URL
     ***************************************************************/

    longToShort.set(longUrl, shortUrl);

    shortToLong.set(shortUrl, longUrl);

    /***************************************************************
     * STEP 5
     *
     * Return the generated short URL.
     ***************************************************************/

    res.json({
        shortUrl: shortUrl
    });

});

/*********************************************************************
 * GET API
 *
 * GET /api/v1/:shortUrl
 *
 * Example:
 *
 * GET /api/v1/2A
 *
 * Browser wants:
 *
 * https://www.google.com
 *
 *********************************************************************/

app.get("/api/v1/:shortUrl", (req, res) =>
{
    // Read parameter from URL.
    //
    // Example:
    //
    // GET /api/v1/abc123
    //
    // req.params.shortUrl
    //
    // becomes
    //
    // abc123
    //
    const shortUrl = req.params.shortUrl;

    /***************************************************************
     * Check whether this short URL exists.
     ***************************************************************/

    if (!shortToLong.has(shortUrl))
    {
        return res.status(404).json({
            error: "Short URL not found"
        });
    }

    /***************************************************************
     * Find original URL.
     ***************************************************************/

    const longUrl = shortToLong.get(shortUrl);

    /***************************************************************
     * Redirect browser.
     *
     * Express automatically sends:
     *
     * HTTP 302 Redirect
     *
     * Browser then opens the original URL.
     ***************************************************************/

    res.redirect(longUrl);

});

/*********************************************************************
 * START SERVER
 *********************************************************************/

const PORT = 3000;

app.listen(PORT, () =>
{
    console.log(`Server running on port ${PORT}`);
});