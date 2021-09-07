const express = require("express");
const app = express();
app.set("view engine", 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const Document = require("./models/Document")
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://<user>:<Password>@sharebincluster.rtnqy.mongodb.net/<DbName>", {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

app.get("/", (req, res) => {
    const code = `Welcome to ShareBin! \n

    Use the commands in the top right corner \n
    to create a new file, save it and then share with others using the link.\n
    
    # ShareBin \n

    Sharing code is a good thing, and it should be _really_ easy to do it.\n
    A lot of times, I want to show you something I'm seeing - and that's where we\n
    use paste bins. \n

    ShareBin is the simple way to share bins, easy to use pastebin.\n

    ## Basic Usage \n

    Write what you want me to see, click "Save", and then copy the URL.  Send that\n
    URL to someone and they'll see what you have written.\n
    `
    res.render("code-display", { code, language: 'plaintext' });
});

app.get('/new', (req, res) => {
    res.render("new");
});

app.post('/save', async (req, res) => {
    const value = req.body.value;
    try {
        const document = await Document.create({ value })
        res.redirect(`/${document.id}`)
    } catch (error) {
        console.log(error)
        res.render("new", { value })
    }
})

app.post('/:id/save', async (req, res) => {
    const value = req.body.value;
    try {
        const document = await Document.create({ value })
        res.redirect(`/${document.id}`)
    } catch (error) {
        console.log(error)
        res.render("new", { value })
    }
})

app.get("/:id/duplicate", async (req, res) => {
    const id = req.params.id
    try {
        const document = await Document.findById(id)
        res.render('new', { value: document.value })
    } catch (error) {
        console.log(error)
        res.redirect(`/${id}`)
    }
})

app.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const document = await Document.findById(id)

        res.render('code-display', { code: document.value, id })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    console.log("Server Started Successfully!")
});