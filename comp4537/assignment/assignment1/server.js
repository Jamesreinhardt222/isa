const mysql = require("mysql");
const express = require("express");
const PORT = process.env.PORT || 8888;
const app = express();
const bodyParser = require("body-parser");


const connection = mysql.createConnection({
    host: '192.168.64.3',
    user: "user1",
    password: "123456",
    database: "webdev"
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.use("/js", express.static(__dirname + "/js"));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-length, X-Requested-With");
    next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/API/v1/", (req, res) => {
    let sql_query = `SELECT * FROM Questions JOIN Answers on (Questions.questionID = Answers.questionID) join answer_key_bridge on (Questions.questionID = answer_key_bridge.questionID)`;
    let string = ""
    connection.query(sql_query, (err, result, fields) => {
        let query_obj = { "results": [] }

        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            query_obj['results'].push(JSON.stringify(result[i]));
        }
        string = JSON.stringify(query_obj);
        res.send(string);
    })
})

app.get('/admin.html', (req, res) => {
    res.sendFile(__dirname + "/admin.html");
});

app.get('/student.html', (req, res) => {
    res.sendFile(__dirname + "/student.html");
});


app.post("/", (req, res) => {

    let sent_obj = Object.keys(req.body)[0];

    sent_obj = JSON.parse(sent_obj);
    let sql_query = `INSERT INTO Questions (question_text) VALUES ("${sent_obj["question_text"]}")`;
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        console.log("Sent object: " + sent_obj["options"]);
    })
    for (let i = 0; i < sent_obj["options"].length; i++) {
        sql_query = `INSERT INTO Answers (answer_text, questionID) VALUES ("${sent_obj["options"][i]}",  (SELECT questionID from Questions WHERE question_text = "${sent_obj["question_text"]}"));`;
        connection.query(sql_query, (err, result) => {
            if (err) throw err;
        })
    }

    sql_query = `INSERT INTO answer_key_bridge (questionID, correct_answerID) VALUES ((SELECT questionID from Questions WHERE question_text = "${sent_obj["question_text"]}"),  (SELECT answerID from Answers WHERE answer_text = "${sent_obj["answer"]}"));`;
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
    })
})

app.put("/", (req, res) => {
    let sent_obj = Object.keys(req.body)[0];

    sent_obj = JSON.parse(sent_obj);
    sql_query = `UPDATE Questions SET question_text = "${sent_obj["question_text"]}" where question_text = ${sent_obj["original_question_text"]}`

    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        console.log("Sent object: " + sent_obj["options"]);
    });
})

app.listen(PORT);

