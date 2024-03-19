const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/upload');
    },
    filename: function (req, file, cb) {
        try {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileExtension = path.extname(file.originalname);
            const newFilename = uniqueSuffix + fileExtension;
            cb(null, newFilename);
        } catch (error) {
            cb(error, null);
        }
    }
});

const fileFilter = function (req, file, cb) {
    try {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            // You can customize the error message here
            cb(new Error('Only image files are allowed'), false);
        }
    } catch (error) {
        cb(error, false);
    }
};

const limits = {
    fileSize: 1024 * 1024 * 2 // 2 MB
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});

// Multer error handler middleware
const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: 'failed',
                message: 'File is too large. Maximum allowed size is 2MB.',
            });
        }
        // Handle other Multer errors if needed
        return res.status(400).json({
            status: 'failed',
            message: 'Invalid file. Please upload a valid file.',
        });
    }
    // Pass the error to the next middleware if it's not a Multer error
    next(err);
};

module.exports = {
    upload,
    multerErrorHandler
};
