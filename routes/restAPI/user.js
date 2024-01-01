const express = require('express');
const router = express.Router();
const { body } = require('express-validator');



router.post('/signup',
[
  body('name').notEmpty().withMessage('Name is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('email').notEmpty().withMessage('Email is required'),
],
 
);



router.get('/email/verification',

);




router.post('/login',
  [
    body('email').notEmpty().withMessage('email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
 
 
);




router.post('/password/reset',
  [
    body("password").notEmpty().withMessage("password is required"),
    body("newPassword").notEmpty().withMessage("new password is required"),
  ],
 
);




router.post('/add/note',
  [
    body("title").notEmpty().withMessage("title is required"),
    body("content").notEmpty().withMessage("content is required"),
  ],
  
);




router.post('/edit/note',
  [
    body("title_id").notEmpty().withMessage("title_id is required"),
  ],
 
);


router.post('/delete/note',
  [
    body("title_id").notEmpty().withMessage("title_id is required"),
  ],
);




module.exports = router;