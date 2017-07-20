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

learn.prototype.handleRequest = function (app) {
    let user = app.getUser();
    let userId = user.email ? user.email : user.userId;

    this.db.ref('/users/' + userId + '/learned_words').once('value', (snapshot) => {
        let learnedWords = snapshot.val();

        if (!learnedWords) {
            learnedWords = [];
        }

        let allWords = keys(this.words);

        let randomWord = random(allWords);
        while (learnedWords.includes(randomWord) && learnedWords.length < allWords.length) {
            randomWord = random(allWords);
        }

        learnedWords.push(randomWord);

        this.db.ref('/users/' + userId + '/learned_words').set(learnedWords);

        let randomPrelude = preludes[Math.floor(preludes.length * Math.random())];

        app.ask(
            app.buildRichResponse()
                .addSimpleResponse(randomPrelude + randomWord)
                .addBasicCard(
                app.buildBasicCard()
                    .setTitle(randomWord)
                    .setSubtitle(this.words[randomWord].pos)
                    .setBodyText(this.words[randomWord].meaning)
                )
                .addSuggestions([
                    "Learn another word",
                    "Test learned words"
                ])
        );
    });
};

exports.learn = learn;