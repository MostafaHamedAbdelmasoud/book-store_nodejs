var express = require('express');
var router = express.Router();
var auth = require('../Http/middleware/auth');
const Book = require('../models/book')
const path = require('path')
var flash = require('express-flash');
const multer = require('multer');
const {fileStorage, fileFilter} = require('../config/multer-config');

router.use((req, res, next) => {
    if (!req.user) {
        return res.send('unauthenticated');
    }
    next()
})

/* GET home page. */
router.get('/index', function (req, res, next) {
    let query = {}
    if (req.user.isAuthor()) {
        query = {"postedBy": req.user._id}
    }
    Book.find(query, function (err, books) {
        // res.render('/usersList', {users: users});
        res.render('books', {'books': books});
    });
});

/* GET home page. */
router.get('/create', auth.checkAuthenticated, function (req, res, next) {

    res.render('books/create');
});


var upload = multer({
        storage: fileStorage,
        limits:
            {
                fileSize: '2000000'
            },
        fileFilter: fileFilter
    }
).fields([{name: 'imageField', maxCount: 1}, {name: 'fileField', maxCount: 1}]);


router.post('/create', upload, async function (req, res, next) {
    try {
        const bookModel = new Book(req.body);
        bookModel.postedBy = req.user._id
        console.log(req.files.fileField[0])
        console.log(bookModel)
        bookModel.file = req.files.fileField[0].filename
        bookModel.image = req.files.imageField[0].filename

        await bookModel.save();
        res.redirect('/books/index');
    } catch (e) {
        res.status(400).send(e);
    }

}, (err, req, res, next) => {
    // res.redirect('/error', {"message": err});
    res.status(400).send('this is error' + err);
});

router.delete('/delete', async function (req, res, next) {
    try {

        await Book.findByIdAndDelete(req.body.id);
        res.redirect('/books/index');

    } catch (e) {
        res.status(400).send(e);
    }

});


/* GET home page. */
router.get('/edit', auth.checkAuthenticated, async function (req, res, next) {
    let bookModel = await Book.findById(req.query.id)

    res.render('books/edit', {book: bookModel});
});


/* GET home page. */
router.post('/update', upload, async function (req, res, next) {
    try {
        var requestBody = req.body
        if (req.files && req.files.imageField != undefined) {
            requestBody.image = req.files.imageField[0].filename;
        }
        if (req.files && req.files.fileField != undefined) {
            requestBody.file = req.files.fileField[0].filename;
        }
        console.log(requestBody)
        let query = {_id: req.query.id};
        let bookModel = await Book.findOneAndUpdate(query, requestBody, {new: true})
        // Book.update(query, requestBody);
        console.log(bookModel.name);
        res.redirect('/books/edit?id=' + bookModel._id);
    } catch (e) {
        console.log(e)
        res.status(400).send(e);
    }


}, (err, req, res, next) => {
    // res.redirect('/error', {"message": err});
    console.log(err)

    res.status(400).send('this is error' + err);
});


module.exports = router;
