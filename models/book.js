const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator')
const User = require('./user')
const moment = require('moment')

const bookSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        min: 2
    },
    description: {
        type: String,
        required: true,
        min: 2
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rate: {
        type: Number,
        default: 0
    },
    file: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
}, {timestamps: true});


// methods ======================
// we have two type of methods: 'methods', and 'statics'.
// 'methods' are private to instances of the object User, which allows the use of 'this' keyword.
// 'statics' are attached to the user object, so that you don't need an instance of the object created with the keyword 'new' to actually call the function.

bookSchema.methods.getAuthor = function (user_id) {
    return User.findById(user_id);
};


bookSchema.methods.getImage = function () {
    return '/uploads/images/'+this.image;
};

bookSchema.methods.getFile = function () {
    return '/uploads/files/'+this.file;
};

bookSchema.methods.getCreatedAt = function () {
    return moment(this.createdAt).format("DD-MM-YYYY h:mm:ss");
};

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;