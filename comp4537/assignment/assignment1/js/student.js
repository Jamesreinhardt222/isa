const endPointRoot = "http://localhost:8888";

function Quiz() {
    this.q = []

    this.create_question_object = (results) => {
        let question = {}
        for (let i = 0; i < results.length; i++) {
            results[i] = JSON.parse(results[i]);
            if (!(question[results[i]["questionID"]])) {
                question[results[i]["questionID"]] = { "options": [], "answer": [] };
            }
            let current_question = question[results[i]["questionID"]];

            current_question["question_text"] = results[i]["question_text"];
            current_question["options"].push(results[i]["answer_text"]);


            if (results[i]["answerID"] == results[i]["correct_answerID"]) {
                current_question["answer"] = results[i]["answer_text"];
            }
            current_question["number_of_questions"] = current_question['options'].length;
        }
        for (const entry in question) {
            this.q.push(question[entry]);
        }
        console.log("Q = " + this.q)
        this.addQuestionsToDOM();
    }

    this.readQuestionsFromDB = async () => {
        const response = await fetch(endPointRoot + "/API/v1");
        const questions = await response.json();
        this.create_question_object(questions.results)
    }

    this.readFromLocalStorage = () => {
        let questions = JSON.parse(localStorage.getItem("questions"));
        console.log("questions:", questions);

        if (questions && questions.length > 0) {
            this.q = questions;
            this.addQuestionsToDOM();
        } else {
            document.getElementById("submit").disabled = true;
            document.getElementById("score").innerHTML = "No questions available";
        }
    }

    this.addQuestionsToDOM = () => {
        let container = document.getElementById("container");
        container.innerHTML = "";
        for (let i = 0; i < this.q.length; i++) {
            container.innerHTML += `<div id="${i}"><p>Question ${i + 1}</p><p>${this.q[i]["question_text"]}</p>`
            for (let j = 0; j < this.q[i]["number_of_questions"]; j++) {

                container.innerHTML += `
                <input type="radio" name="${i}" value="${this.q[i]['options'][j]}" ><label>${this.q[i]['options'][j]}</label><br>`
            }
        }
    }

    this.checkTest = () => {
        let correct = 0;
        let selected = document.querySelectorAll('input:checked');
        console.log(this.q);

        if (selected.length != this.q.length) {
            alert("Answer all questions");
            return;
        }
        let inputs = [];
        let values = []
        for (let i = 0; i < selected.length; i++) {
            inputs = document.querySelectorAll(`input[name="${selected[i].name}"][value="${selected[i].value}"] + label`)
            for (let index = 0; index < inputs.length; index++) {
                inputs[index].style.backgroundColor = "lightPink";
            }

            choice = document.querySelector(`input[name="${selected[i].name}"][value="${selected[i].value}"]`)
            if (this.q[selected[i].name]["answer"] == choice.value) {
                values = document.querySelectorAll(`input[name="${selected[i].name}"][value="${selected[i].value}"] + label`)
                for (let index = 0; index < inputs.length; index++) {
                    values[index].style.backgroundColor = "lightGreen";
                    correct++;
                }
            }

        }

        document.getElementById("submit").disabled = true;
        document.getElementById("score").innerHTML = `Score: ${((correct / this.q.length) * 100).toFixed(2)}%`;
    }
}

quiz = new Quiz()
submit_btn = document.getElementById("submit")
submit_btn.onclick = quiz.checkTest
// quiz.readFromLocalStorage()
quiz.readQuestionsFromDB()