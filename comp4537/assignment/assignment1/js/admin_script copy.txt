const endPointRoot = "http://localhost:8888";


let set_up_inputs = function () {
    let main_container = document.getElementById("question_inputs")
    let previous = main_container.getElementsByTagName('input')
    let breaks = main_container.getElementsByTagName('br')

    while (breaks[0]) {
        breaks[0].remove();
    }

    while (previous[0]) {
        previous[0].remove();
    }

    let dropdown = document.getElementById("number_of_questions");
    let num = dropdown.options[dropdown.selectedIndex].value;
    for (let i = 0; i < num; i++) {
        check = document.createElement("input");
        check.id = `r${i}`;
        check.setAttribute("type", "radio");
        check.setAttribute("name", "add");

        text = document.createElement("input");
        text.id = `a${i}`;
        text.setAttribute("type", "text");
        text.setAttribute("name", "text");

        breaker = document.createElement("br")
        document.getElementById("question_inputs").appendChild(check)
        document.getElementById("question_inputs").appendChild(text)
        document.getElementById("question_inputs").appendChild(breaker)

    }
}

function QuizMaker() {
    this.q = []


    this.addQuestionsToDOM = () => {
        let container = document.getElementById("container");
        container.innerHTML = "";

        for (let i = 0; i < this.q.length; i++) {
            container.innerHTML += `
                <div id="${i}">
                <p>Question ${i + 1}</p>
                <p>${this.q[i]["question_text"]}</p>
                `
            for (let j = 0; j < this.q[i]["number_of_questions"]; j++) {
                container.innerHTML += `
                <input type="radio" name="${i}" value="${this.q[i]['a' + j]}" 
                ${this.q[i]["answer"] == this.q[i]['options'][j] ? 'checked' : ''}>${this.q[i]['options'][j]}<br>`
            }
            container.innerHTML += `<button onclick='quiz_maker.deleteQuestion(${i})'>Delete question ${i + 1}</button></div>`
        }
    }


    this.save_to_db = function (value) {
        const xhttp = new XMLHttpRequest();

        xhttp.open("POST", endPointRoot, true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send(JSON.stringify(value));

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
            }
        }
    }

    this.save_to_db2 = async (question) => {
        const response = await fetch(endPointRoot, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(question) });
        const result = await response.json();
        console.log("writeQuestionToDB result:", result);
        alert(result.result);
    }

    this.updateQuestionInDB = (question) => {
        const xhttp = new XMLHttpRequest();

        xhttp.open("PUT", endPointRoot, true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send(JSON.stringify(value));

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
            }
        }
    }


    this.create_question_object = (results) => {
        let question = {}
        for (let i = 0; i < results.length; i++) {
            results[i] = JSON.parse(results[i]);
            if (!(question[results[i]["questionID"]])) {
                question[results[i]["questionID"]] = { "options": [], "answer": "" };
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

    this.get_data = () => {
        this.readQuestionsFromDB();
    }

    this.addQuestion = () => {
        let checked_boxes;
        let answer = []
        let options_list = []
        let inputs = document.querySelectorAll('input[name="text"]')

        if (!document.querySelector('input[name="add"]:checked')) {
            alert("Please complete the form");
            return;
        } else {
            checked_boxes = document.querySelectorAll('input[name="add"]:checked');
            filled_inputs = document.querySelectorAll('input[name="text"]');

        }
        for (let i = 0; i < checked_boxes.length; i++) {
            answer = document.getElementById("a" + checked_boxes[i].id[1]).value
        }
        for (let i = 0; i < filled_inputs.length; i++) {
            answer = document.getElementById("a" + i).value
            options_list.push(answer);
        }
        let question = {
            ["question_text"]: document.getElementById("question").value,
            ["answer"]: answer,
            ["options"]: options_list,
            ["number_of_questions"]: inputs.length,
        };

        for (let i = 0; i < inputs.length; i++) {
            question[`a${i}`] = document.getElementById(`a${i}`).value;
        }

        for (let key in question) {
            if (!question[key]) {
                alert("Please complete the form");
                return;
            }
        }
        this.save_to_db(question)

        this.q.push(question);
        this.addQuestionsToDOM();
    }


    this.deleteQuestion = (i) => {
        this.q.splice(i, 1);
        let question = document.getElementById(i);
        document.getElementById("container").removeChild(question);
        this.addQuestionsToDOM();
    }

}

quiz_maker = new QuizMaker()
add_btn = document.getElementById("add_q")
add_btn.onclick = quiz_maker.addQuestion
save_btn = document.getElementById("save");
// save_btn.onclick = quiz_maker.saveTest

// quiz_maker.readFromLocalStorage();
quiz_maker.get_data();

set_up_inputs()


