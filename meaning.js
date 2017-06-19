let meaning = function (admin, words) {
    this.db = admin.database();
    this.words = words;
};

meaning.prototype.handleRequest = function () {
    let words = this.words;

    return function (app) {
        let word = app.getArgument("word");
        let response;
        
        if (words[word]) {
            response = app.buildRichResponse()
                .addSimpleResponse("Here's the meaning of " + word)
                .addBasicCard(
                    app.buildBasicCard()
                        .setTitle(word)
                        .setSubtitle(words[word].pos)
                        .setBodyText(words[word].meaning)
                )
                .addSimpleResponse("What's next?");
        } else {
            response = app.buildRichResponse()
                .addSimpleResponse("Sorry! The word " + word + " is not present in our database");
        }
        
        response.addSuggestions([
            "Learn a new word",
            "Test learned words"
        ]);
        
        app.ask(response);
    }
};

exports.meaning = meaning;