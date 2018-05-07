const URL_PATTERN = /^\s*(https?|file):\/\//i;
const ABSOLUTE_PATTERN = /^\s*(\/|[a-z]:[/\\])/i;

module.exports = function(flag) {
    switch (true) {
        case URL_PATTERN.test(flag):
            return flag;
        case ABSOLUTE_PATTERN.test(flag):
            return 'file://' + flag;
        default:
            return 'file://' + process.cwd() + '/' + flag;
    }
};
