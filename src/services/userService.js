const User = require('../models/User');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getAllUsers = async ({ search, role } = {}) => {
    const filter = {};
    if (role) filter.role = role;
    if (search) {
        const regex = new RegExp(escapeRegex(search), 'i');
        filter.$or = [{ name: regex }, { email: regex }];
    }
    return User.find(filter).select('name email role createdAt').sort({ name: 1 });
};

const onboardUser = async ({ name, email, password, role }) => {
    if (!name || !name.trim() || !email || !email.trim()) {
        const err = new Error('Name and email are required');
        err.statusCode = 400;
        throw err;
    }

    if (role && !['admin', 'user'].includes(role)) {
        const err = new Error('Role must be admin or user');
        err.statusCode = 400;
        throw err;
    }

    if (password && password.length < 6) {
        const err = new Error('Password must be at least 6 characters');
        err.statusCode = 400;
        throw err;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
        const err = new Error('A user with this email already exists');
        err.statusCode = 409;
        throw err;
    }

    // The model's pre('save') hook hashes the password.
    // If password is undefined, the model default (123456) is used.
    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: password || undefined,
        role: role || 'user',
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    };
};

module.exports = { getAllUsers, onboardUser };