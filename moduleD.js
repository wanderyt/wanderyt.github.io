module.exports.hello = function() {
    console.log('hello');
}

// module.exports = {
//     hello: function() {
//         console.log('hello');
//     }
// }

// exports.hi = function() {
//     console.log('hi');
// };

exports = {
    hi: function() {
        console.log('hi');
    }
}

const david = 'David';

exports.default = david;

// export default david;