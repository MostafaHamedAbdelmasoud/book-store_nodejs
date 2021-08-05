var express = require('express');
var router = express.Router();
var auth = require('../Http/middleware/auth');
const Book = require('../models/book')
const path = require('path')
const multer = require('multer');

router.use((req, res, next) => {
    if (!req.user) {
        return res.send('unauthenticated');
    }
    next()
})

/* GET home page. */
router.get('/index', function (req, res, next) {
    Book.find({}, function (err, books) {
        // res.render('/usersList', {users: users});
        res.render('books', {'books': books});
    });
});


/* GET home page. */
router.get('/create', auth.checkAuthenticated, function (req, res, next) {

    res.render('books/create');
});

// let storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/files')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
//     }
// });
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => { // setting destination of uploading files
        if (file.fieldname === "file") { // if uploading file
            cb(null, './public/files');
        } else { // else uploading image
            cb(null, './public/images');
        }
    },
    filename: (req, file, cb) => { // naming file
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "file") { // if uploading resume
        if (file.mimetype === 'application/pdf') { // check file type to be pdf, doc, or docx
            cb(undefined, true);
        } else {
            // console.log(file)
            cb(new Error('please upload an pdf'))
        }
    } else { // else uploading image
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) { // check file type to be png, jpeg, or jpg
            cb(undefined, true);
        } else {
            cb(new Error('please upload an image'))
        }
    }
};

// const upload = multer({
//     dest: 'files',
//      storage:storage,
//     limits:{fileSize: 1000000},
//     fileFilter(req, file, cb) {
//         return file.originalname.endsWith('pdf') ?
//             cb(undefined, true) : cb(new Error('please upload a pdf'))
//     }
// })

var upload = multer({
        storage: fileStorage,
        limits:
            {
                fileSize: '2000'
            },
        fileFilter: fileFilter
    }
).fields(
    [
        {
            name: 'file',
            maxCount: 1
        },
        {
            name: 'image',
            maxCount: 1
        }
    ]
);
//
//
// var cpUpload = upload.fields([
//     {
//         name: 'file',
//         dest: 'files',
//         // storage:storage,
//         limits: '90000',
//         fileFilter(req, file, cb) {
//             console.log(file.originalname.endsWith('pdf'))
//             return file.originalname.endsWith('pdf') ?
//                 cb(undefined, true) : cb(new Error('please upload a pdf'))
//         }
//     },
//     {
//         name: 'image',
//         dest: 'images',
//         // storage:storage,
//         fileFilter(req, file, cb) {
//             const validFileTypes = /jpg|jpeg|png/ // Create regex to match jpg and png
//
//             // Do the regex match to check if file extension match
//             const extname = validFileTypes.test(path.extname(file.originalname).toLowerCase())
//
//                 return extname ?
//                 cb(undefined, true) : cb(new Error('please upload a valid image'))
//         }
//     }
// ])


/* GET home page. */
// router.post('/create', upload.single('file'), function (req, res, next) {
router.post('/create', upload, function (req, res, next) {

    const bookModel = new Book(req.body);
    bookModel.postedBy = req.user._id
    bookModel.save();
    res.redirect('/books/index');
}, (err, req, res, next) => {
    res.render('error', {"message": err});
});


module.exports = router;
