const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const summarizeRouter = require('./routes/summarizeRoute');
const app = express();
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ejs-mongo-example', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Set up EJS
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/summarize', summarizeRouter);


const videoLinks = {
    "beginner": {
        "Web Development": {
            "English": "https://www.youtube.com/watch?v=DzsYKMuCxts",
            "Hindi": "https://www.youtube.com/first-year-web-dev-hindi"
        },
        "App Development": {
            "English": ".",
            "Hindi": "."
        },
        "Macine Learning": {
            "English": ".",
            "Hindi": "."
        },
        "JAVA": {
            "English": ".",
            "Hindi": "."
        },
        "C++": {
            "English": ".",
            "Hindi": "."
        },
        "DSA": {
            "English": ".",
            "Hindi": "."
        },
        
    },
    "intermediate": {
        //idhar bhi same upar k jaisa 
    },
    "advanced": {
        //idhar bhi same upar k jaisa 
    },
   
};

app.get('/', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send('User already exists. Please login.');
        }

        const newUser = new User({ name, email, password });
        await newUser.save();
        res.send('Signup successful! You can now login.');
    } catch (error) {
        res.status(500).send('Error during signup.');
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.send('Invalid email or password.');
        }

        res.render('home', { user });
    } catch (error) {
        res.status(500).send('Error during login.');
    }
});

app.get('/progress', (req, res) => {
    res.render('progress');
});

app.post('/progress', async (req, res) => {
    const { level, domainOfInterest, languageMode } = req.body;

    try {
        const videoLink = videoLinks[level][domainOfInterest][languageMode];
        const user = await User.findOneAndUpdate(
            { email: req.body.email },
            { level, domainOfInterest, languageMode },
            { new: true }
        );

        res.render('video', { videoLink });
    } catch (error) {
        res.status(500).send('Error processing your request.');
    }
});

app.get('/video', (req, res) => {
    res.render('video', { videoLink: null });
});

app.get('/summarize', (req, res) => {
    res.render('summarize');
});

// Start server
const PORT = 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
