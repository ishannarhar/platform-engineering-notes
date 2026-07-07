// ==========================
// This Map acts like our database.
//
// Key   -> Long URL
// Value -> Object containing ID and short URL
// ==========================
const urlDatabase = new Map();

// These are all the characters allowed inside
// our short URL.
const BASE62 =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// Every time someone creates a URL,
// this number increases.
let currentId = 1;

function encodeBase62(number)
{
    // If the number is zero,
    // return the first character.
    if (number === 0)
    {
        return "0";
    }

    let shortUrl = "";

    // Keep dividing until number becomes zero.
    while (number > 0)
    {
        // remainder tells us which Base62 character to use.
        let remainder = number % 62;

        // Add corresponding character.
        shortUrl = BASE62[remainder] + shortUrl;

        // Move to next digit.
        number = Math.floor(number / 62);
    }

    return shortUrl;
}

function shortenUrl(longUrl)
{
    // STEP 1
    // Check whether URL already exists.

    if (urlDatabase.has(longUrl))
    {
        console.log("URL already exists.");

        return urlDatabase.get(longUrl).shortUrl;
    }

    // STEP 2
    // Generate new ID.

    const id = currentId++;

    // STEP 3
    // Convert ID to Base62.

    const shortUrl = encodeBase62(id);

    // STEP 4
    // Store inside our "database".

    urlDatabase.set(longUrl,
    {
        id: id,
        shortUrl: shortUrl
    });

    return shortUrl;
}



function getLongUrl(shortUrl)
{
    // Loop through every entry.

    for (const [longUrl, data] of urlDatabase)
    {
        if (data.shortUrl === shortUrl)
        {
            return longUrl;
        }
    }

    return null;
}




//Testing Everything
const google =
    "https://www.google.com/search?q=javascript";

const amazon =
    "https://www.amazon.in/books/system-design";

// Create short URLs.

const short1 = shortenUrl(google);

const short2 = shortenUrl(amazon);

// Same URL again.

const short3 = shortenUrl(google);

console.log(short1);
console.log(short2);
console.log(short3);

// Redirect.

console.log(getLongUrl(short2));