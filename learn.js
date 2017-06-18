var keys = Object.keys || require('object-keys');
const random = require('random-item');

const preludes = [
    "Here's a new word, ",
    "Here is a new word for you, ",
    "Check if this one is known to you, "
];

let learn = function (admin, words) {
    this.db = admin.database();
    this.words = words;
};

learn.prototype.handleRequest = function () {
    let db = this.db;
    let words = this.words;

    return function(app) {
        let user = app.getUser();
        let userId = user.email ? user.email : user.userId;

        db.ref('/users/' + userId + '/learned_words').once('value', (snapshot) => {
            let learnedWords = snapshot.val();

            if (!learnedWords) {
                learnedWords = [];
            }

            let allWords = keys(words);

            let randomWord = random(allWords);
            while (learnedWords.includes(randomWord) && learnedWords.length < allWords.length) {
                randomWord = random(allWords);
            }

            learnedWords.push(randomWord);

            db.ref('/users/' + userId + '/learned_words').set(learnedWords);

            let randomPrelude = preludes[Math.floor(preludes.length * Math.random())];

            if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
                app.ask(
                    app.buildRichResponse()
                        .addSimpleResponse(randomPrelude + randomWord)
                        .addBasicCard(
                        app.buildBasicCard()
                            .setTitle(randomWord)
                            .setSubtitle(words[randomWord].pos)
                            .setBodyText(words[randomWord].meaning)
                        )
                        .addSuggestions([
                            "Learn another word",
                            "Test learned words"
                        ])
                );
            } else {
                app.ask("<speak>" + randomPrelude + randomWord + "</speak>");
            }
        });
    };
};

exports.learn = learn;