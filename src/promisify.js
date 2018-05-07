
module.exports = function promisify(func) {
    return (...args) => new Promise((resolve, reject) => {
        func(...args, (err, val) => err ? reject(err) : resolve(val));
    });
}
