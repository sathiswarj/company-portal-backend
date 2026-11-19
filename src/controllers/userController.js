const userService = require('../services/userService');

// GET /api/users
exports.getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers(req.query);
        res.json(users);
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

// POST /api/users  (admin only)
exports.onboardUser = async (req, res) => {
    try {
        const user = await userService.onboardUser(req.body);
        res.status(201).json({
            message: req.body.password
                ? 'User onboarded successfully'
                : 'User onboarded successfully with the default password',
            user,
        });
    } catch (err) {
        // Safety net for a race condition on the unique email index
        if (err.code === 11000) {
            return res.status(409).json({ message: 'A user with this email already exists' });
        }
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};