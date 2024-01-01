const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/users');
const Notes = require('../../models/notes');

// Function to handle errors
const handleErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ message });
};

// Function to hash passwords
const hashPassword = async (password) => {
  return bcrypt.hash(password, 12);
};

// Middleware to attach user_id (mongodb) with req
exports.authMiddleware = async (req, res, next) => {
  try {
    const authorizationHeaderToken = req.cookies.token || req.headers.authorization;

    if (!authorizationHeaderToken) {
      return handleErrorResponse(res, 401, 'Unauthorized');
    }

    const token = authorizationHeaderToken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email }).select('-password');

    if (!user) {
      return handleErrorResponse(res, 401, 'Unauthorized');
    }

    req.email = decoded.email;
    next();

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return handleErrorResponse(res, 401, 'Token expired');
    }

    handleErrorResponse(res, 500, 'Something went wrong with token');
  }
};

// Controller for user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return handleErrorResponse(res, 401, 'User email does not exist');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return handleErrorResponse(res, 401, 'Incorrect password');
    }

    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    res.status(200).send({
      msg: 'User logged in',
      user: {
        user_id: user._id,
        email: email,
        name: user.name,
        token: token,
        expires_in: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

  } catch (error) {
    handleErrorResponse(res, 500, 'Something went wrong');
  }
};

// Controller for user signup
exports.signup = async (req, res) => {
  try {
    const { name, email, phone_number, password } = req.body;
    const preUser = await User.findOne({ $or: [{ email }, { phone_number }] });

    if (preUser) {
      return res.send({ message: 'Email already exists' });
    } else {
      if (password) {
        const hashedPassword = await hashPassword(password);
        const userDetail = { email, password: hashedPassword, name, phone_number };
        const newUser = new User(userDetail);
        const savedUser = await newUser.save();
        res.send({ message: 'Account has been created, go to the login' });
      }
    }
  } catch (err) {
    handleErrorResponse(res, 500, 'Something went wrong');
  }
};

// Controller for resetting user password
exports.resetPassword = async (req, res) => {
  try {
    const { newPassword, password } = req.body;
    const email = req.email;

    const user = await User.findOne({ email });

    if (!user) {
      return handleErrorResponse(res, 401, 'User email does not exist');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return handleErrorResponse(res, 401, 'Incorrect password');
    }

    const hashedNewPassword = await hashPassword(newPassword);
    const updated = await User.updateOne({ email }, { password: hashedNewPassword });

    res.status(200).send({ message: 'Password has been changed. Go to the Login page and login through email & password' });

  } catch (error) {
    handleErrorResponse(res, 500, 'Something went wrong');
  }
};

// Controller for resetting user name
exports.resetName = async (req, res) => {
  try {
    const { newName } = req.body;
    const email = req.email;
    const updated = await User.updateOne({ email }, { name: newName });

    if (updated) {
      res.status(200).send({ message: 'Name has been changed' });
    } else {
      res.status(400).send('Unknown Error: Update not successful');
    }

  } catch (error) {
    handleErrorResponse(res, 500, 'Something went wrong');
  }
};

// Controller to show a note
exports.showNote = async (req, res) => {
  try {
    const { note_id } = req.body;
    const data = await Notes.findOne({ _id: note_id });
    res.status(200).send({
      message: "Note has been retrieved",
      note: data
    });
  } catch (error) {
    handleErrorResponse(res, 500, 'Something went wrong');
  }
};

// Controller to create a note
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const newNote = new Notes({ title, content });
    const data = await newNote.save();
    await User.updateOne({ email: req.email }, { $push: { notes: data._id } });

    res.status(200).send({
      message: "Note has been saved",
      note: data
    });
  } catch (error) {
    handleErrorResponse(res, 500, 'Something went wrong');
  }
};

// Controller to update a note
exports.updateNote = async (req, res) => {
  try {
    const { note_id, title, content } = req.body;
    const data = await Notes.updateOne({ _id: note_id }, { title, content });

    res.status(200).send({
      message: "Note has been updated",
      note: data
    });
  } catch (error) {
    handleErrorResponse(res, 500, 'Something went wrong');
  }
};

// Controller to delete a note
exports.deleteNote = async (req, res) => {
  try {
    const { note_id } = req.body;
    await Notes.deleteOne({ _id: note_id });
    await User.updateOne({ email: req.email }, { $pull: { notes: note_id } });

    res.status(200).send({
      message: "Note has been deleted",
      note_id: note_id
    });
  } catch (error) {
    handleErrorResponse(res, 500, 'Something went wrong');
  }
};