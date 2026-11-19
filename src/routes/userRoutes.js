const router = require('express').Router();
const auth = require('../middleware/auth')
const authorize = require('../middleware/authorize');
const { getUsers, onboardUser } = require('../controllers/userController');

router.use(auth);

router.get('/', getUsers);
router.post('/', authorize('admin'), onboardUser);

module.exports = router;