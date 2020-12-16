const { object,number,string } = require('superstruct');
const validator = require('validator');

// Some custom types
// You could add any type you want!
const types = {
    empty: v => !v,
    '!empty': v => !!v,
    email: v => validator.isEmail(v + ''),
    numeric: v => validator.isNumeric(v + '')
};

module.exports = superstruct({ types });