const consoleOptions = require('./consoleOptions');

const logBase = function (text = '', option) {
    if (option) {
        console.log(option, text);
    } else {
        console.log(text)
    }
}

const logHeadline = function (text) {
    logBase();
    logBase();
    logBase(`***** ${text} *****${consoleOptions.options.reset}`, consoleOptions.options.underscore + consoleOptions.colors.backGround.white + consoleOptions.colors.frontGround.black);
};

const logSuccess = function (text) {
    logBase(text, consoleOptions.colors.frontGround.green);
};

const logError = function (text) {
    logBase(text, consoleOptions.colors.frontGround.red);
};

module.exports = {
    logHeadline,
    logSuccess,
    logError,
};
