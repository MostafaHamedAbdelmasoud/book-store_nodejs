const multer = require("multer");


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => { // setting destination of uploading files
        // console.log(file)
        if (file.fieldname === "fileField") { // if uploading file
            cb(null, './public/uploads/files');
        } else { // else uploading image
            cb(null, './public/uploads/images');
        }
    },
    filename: (req, file, cb) => { // naming file
        if (file.fieldname === "fileField") { // if uploading file
            cb(null, file.fieldname + '-' + Date.now() + '.pdf')
        } else { // else uploading image
            cb(null, file.fieldname + '-' + Date.now() + '.png')
        }
    }
});

const fileFilter = (req, file, cb) => {

    if (file.fieldname === "fileField") { // if uploading resume
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

module.exports = {fileStorage,fileFilter};