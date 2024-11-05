const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const summarizeRouter = require("./routes/summarizeRoute");
const app = express();
const User = require("./models/User");
const Domain = require("./models/Domain");
const Chapter = require("./models/Chapter");
const Topic = require("./models/Topic");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/ejs-mongo-example", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set up EJS
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use("/summarize", summarizeRouter);

const videoLinks = {
  beginner: {
    "Web Development": {
      English: "https://youtu.be/MDZC8VDZnV8?si=6njlZM5ybMKwXgAt",
      Hindi: "https://youtube.com/playlist?list=PLfEr2kn3s-br9ZFmejfLhAgMbGgbpdof8&si=nsWSsZ766A4JiL0C",
    },
    "App Development": {
      English: ".",
      Hindi: ".",
    },
    "Macine Learning": {
      English: ".",
      Hindi: ".",
    },
    JAVA: {
      English: ".",
      Hindi: ".",
    },
    "C++": {
      English:
        "https://www.youtube.com/watch?v=oOmbSpOzvYg&list=PLdo5W4Nhv31YU5Wx1dopka58teWP9aCee",
      Hindi:
        "https://www.youtube.com/watch?v=j8nAHeVKL08&list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL",
    },
    DSA: {
      English:
        "https://www.youtube.com/watch?v=AT14lCXuMKI&list=PLdo5W4Nhv31bbKJzrsKfMpo_grxuLl8LU",
      Hindi:
        "https://www.youtube.com/watch?v=y3OOaXrFy-Q&list=PLQEaRBV9gAFu4ovJ41PywklqI7IyXwr01",
    },
  },
  intermediate: {
    //idhar bhi same upar k jaisa
     "Web Development": {
      English: "https://youtu.be/R6RX2Zx96fE?si=6o-BFpXjFKag_upl",
      Hindi: "https://youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w&si=yTMuPRbp2Yb-7bsN",
    },
    "App Development": {
      English: ".",
      Hindi: ".",
    },
    "C++": {
      English:
        "https://www.youtube.com/watch?v=oOmbSpOzvYg&list=PLdo5W4Nhv31YU5Wx1dopka58teWP9aCee",
      Hindi:
        "https://www.youtube.com/watch?v=WQoB2z67hvY&list=PLDzeHZWIZsToJ9zSl4-5BfOBzAR0fm--f",
    },
    DSA: {
      English:
        "https://www.youtube.com/watch?v=0bHoB32fuj0&list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
      Hindi:
        "https://www.youtube.com/watch?v=5_5oE5lgrhw&list=PLu0W_9lII9ahIappRPN0MCAgtOu3lQjQi",
    },
  },
  advanced: {
    //idhar bhi same upar k jaisa
     "Web Development": {
      English: "https://youtu.be/nu_pCVPKzTk?si=EOY8JQBIjRHdgusE",
      Hindi: "https://youtube.com/playlist?list=PLfqMhTWNBTe3H6c9OGXb5_6wcc1Mca52n&si=h9pAO-a-1EpZB1v8",
    },
    "App Development": {
      English: ".",
      Hindi: ".",
    },
    "C++": {
      English: "https://www.youtube.com/watch?v=OAlU9IhJo2Y",
      Hindi:
        "https://www.youtube.com/watch?v=s3EMTa_p-Bs&list=PLy-CGmBdq2VGmVIOEO23mZgIUAyZVfODs",
    },
    DSA: {
      English:
        "https://www.youtube.com/watch?v=rZ41y93P2Qo&list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ",
      Hindi:
        "https://www.youtube.com/watch?v=WQoB2z67hvY&list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA",
    },
  },
};

app.get("/", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send("User already exists. Please login.");
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.send("Signup successful! You can now login.");
  } catch (error) {
    res.status(500).send("Error during signup.");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.send("Invalid email or password.");
    }

    res.render("home", { user });
  } catch (error) {
    res.status(500).send("Error during login.");
  }
});

app.get("/progress", (req, res) => {
  res.render("progress");
});

app.post("/progress", async (req, res) => {
  const { level, domainOfInterest, languageMode } = req.body;

  try {
    const videoLink = videoLinks[level][domainOfInterest][languageMode];
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      { level, domainOfInterest, languageMode },
      { new: true }
    );

    res.render("video", { videoLink });
  } catch (error) {
    res.status(500).send("Error processing your request.");
  }
});

app.get("/video", (req, res) => {
  res.render("video", { videoLink: null });
});

app.get("/summarize", (req, res) => {
  res.render("summarize");
});

// Start server
const PORT = 3000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
