const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userContrllers = require("../../middlewares/restAPI/userControllers")



router.post('/signup',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('email').notEmpty().withMessage('Email is required'),
  ],
  userContrllers.signup
);





router.post('/login',
  [
    body('email').notEmpty().withMessage('email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  userContrllers.login

);




router.post('/password/reset',
  [
    body("password").notEmpty().withMessage("password is required"),
    body("newPassword").notEmpty().withMessage("new password is required"),
  ],
  userContrllers.authMiddleware, userContrllers.resetPassword
);




router.post('/show/note',
  userContrllers.authMiddleware, userContrllers.showNote
);






router.post('/add/note',
  [
    body("title").notEmpty().withMessage("title is required"),
    body("content").notEmpty().withMessage("content is required"),
  ],
  userContrllers.authMiddleware, userContrllers.createNote
);




router.post('/edit/note',
  [
    body("title_id").notEmpty().withMessage("title_id is required"),
  ],
  userContrllers.authMiddleware, userContrllers.updateNote
);


router.post('/delete/note',
  [
    body("title_id").notEmpty().withMessage("title_id is required"),
  ],
  userContrllers.authMiddleware, userContrllers.deleteNote
);





module.exports = router;