const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true }, // Make email unique
    password: String,
    engineeringYear: { type: Number, enum: [1, 2, 3, 4] }, // 1, 2, 3, or 4
    domainOfInterest: { type: String, enum: ['Web Development', 'App Development', 'Machine Learning', 'Data Science', 'AI', 'Others'] },
    languageMode: { type: String, enum: ['English', 'Hindi'] }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
