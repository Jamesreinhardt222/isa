const http = require("http");
const url = require("url");
const fs = require("fs");
const urlParser = require("url");
const express = require("express");
const mysql = require("mysql");
const PORT = process.env.PORT || 8888;
const app = express();

const connection = mysql.createConnection({
    host: '192.168.64.3',
    user: "user1",
    password: "123456",
    database: "webdev"
});
// const db = require("./js/dbcode");
const GET = "GET";
const PUT = "PUT";
const POST = "POST";

const path = require("path");
const endPointRoot = "/API/";

http.createServer((req, res) => {
    let string = ""
    res.writeHead(200, {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "GET, PUT, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Methods": "Content-Type, Authorization, Content-length, X-Requested-With"
    });

    let filePath = '.' + req.url;
    if (filePath == './') {
        filePath = './index.html';
    }
    let extname = String(path.extname(filePath)).toLowerCase();
    let mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
    };

    let contentType = mimeTypes[extname] || 'application/octet-stream';

    if (req.method = GET && req.url == endPointRoot + "v1") {
        let sql_query = `SELECT * FROM Questions`;
        let string = ""
        connection.query(sql_query, (err, result, fields) => {
            let query_obj = { "results": [] }

            if (err) throw err;
            for (let i = 0; i < result.length; i++) {
                query_obj['results'].push(JSON.stringify(result[i]));
            }
            string = JSON.stringify(query_obj);
            resolve(string)
        })

        res.end(string)


        // console.log("STRING OUT OF SCOPE + :" + string)
    };

    if (req.method === POST) {
        req.on('data', function (data) {
            sent_obj = JSON.parse(data)
            let sql_query = `INSERT INTO Questions (question_text) VALUES ("${sent_obj["question_text" =}")`;
            connection.query(sql_query, (err, result) => {
                if (err) throw err;
                console.log("Sent object: " + sent_obj["options"]);
            })
            for (let i = 0; i < sent_obj.options.length; i++) {
                sql_query = `INSERT INTO Answers (answer_text, questionID) VALUES ("${sent_obj["options"][i]}",  (SELECT questionID from Questions WHERE question_text = "${sent_obj["question_text"]}"));`;
                connection.query(sql_query, (err, result) => {
                    if (err) throw err;
                })
            }

            for (let i = 0; i < sent_obj.answer.length; i++) {
                sql_query = `INSERT INTO answer_key_bridge (questionID, correct_answerID) VALUES ((SELECT questionID from Questions WHERE question_text = "${sent_obj["question_text"]}"),  (SELECT answerID from Answers WHERE answer_text = "${sent_obj["answers"][i]}"));`;
                connection.query(sql_query, (err, result) => {
                    if (err) throw err;
                })
            }
            console.log("Called POST Method")
        });
        req.on("end", function () {
            res.end("Post Sent");
        })
    }
    if (req.method = GET && url.pathname != endPointRoot + "/v1") {
        fs.readFile(filePath, function (error, content) {
            if (error) {
                if (error.code == 'ENOENT') {
                    fs.readFile('./404.html', function (error, content) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    });
                } else {
                    res.writeHead(500);
                    res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }

}).listen(8888)

