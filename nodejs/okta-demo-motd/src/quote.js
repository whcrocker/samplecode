const utils = require("./helpers/utils");

const quote = async callback => {
    let quoteData = await utils.getQuoteData();

    if (quoteData.statusCode == 200) {
        callback(undefined, {
            id: quoteData.data.id,
            quote: quoteData.data.en,
            author: quoteData.data.author
        });
    } else {
        callback(
            {
                error: `Quote service returned status code ${quoteData.statusCode}`
            },
            undefined
        );
    }
};

module.exports = quote;
