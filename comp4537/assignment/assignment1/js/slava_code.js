readQuestionsFromDB = async () => {
    const response = await fetch(window.location.origin + "/db/");
    const questions = await response.json();
    console.log("readQuestionsFromDB result:", questions);
    addQuestionsToDOM(questions);
}

writeQuestionToDB = async (question) => {
    console.log("writeQuestionToDB request:", question);
    const response = await fetch(window.location.origin + "/db/", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(question) });
    const result = await response.json();
    console.log("writeQuestionToDB result:", result);
    alert(result.result);
}

updateQuestionInDB = async (question) => {
    console.log("updateQuestionInDB request:", question);
    const response = await fetch(window.location.origin + "/db/", { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(question) });
    const result = await response.json();
    console.log("updateQuestionInDB result:", result);
    alert(result.result);
}

deleteQuestionFromDB = async (questionid) => {
    console.log("deleteQuestionFromDB request:", questionid);
    const response = await fetch(window.location.origin + "/db/", { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questionID: questionid }) });
    const result = await response.json();
    console.log("deleteQuestionFromDB result:", result);
    await readQuestionsFromDB();
    alert(result.result);
}

updateQuestion = async (questionID) => {
    console.log(questionID);
    let question = document.querySelector(`textarea[name="${questionID}"]`).value;
    let radioInputs = document.querySelectorAll(`input[name="${questionID}"][type="radio"]`);
    let textInputs = document.querySelectorAll(`input[name="${questionID}"][type="text"]`);

    console.log(question);
    console.log(radioInputs);
    console.log(textInputs);

    if (!question) {
        alert("question can't be empty");
        return;
    }

    let answers = [];

    for (let i = 0; i < textInputs.length; i++) {
        if (!textInputs[i].value) {
            alert("answer can't be empty");
            return;
        }

        let answer = {
            answerID: textInputs[i].alt,
            answer: textInputs[i].value,
            correct: radioInputs[i].checked ? "1" : "0",
        }

        answers.push(answer);
    }

    await updateQuestionInDB({ question, answers, questionID });
}

addQuestionsToDOM = (q) => {
    let container = document.getElementById("container");
    container.innerHTML = "";

    for (let i = 0; i < q.questions.length; i++) {
        container.innerHTML += `
            <div id="${q.questions[i].questionid}">
                <p>Question ${i + 1}</p>
                <button onclick='deleteQuestionFromDB(${q.questions[i].questionid})'>Delete question ${i + 1}</button>
                <button onclick='updateQuestion(${q.questions[i].questionid})'>Update question ${i + 1}</button>
                <div><textarea name="${q.questions[i].questionid}">${q.questions[i].question}</textarea></div>
            </div>
        `;
    }

    for (let i = 0; i < q.answers.length; i++) {
        document.getElementById(q.answers[i].questionid).innerHTML += `
            <input type="radio" name="${q.answers[i].questionid}" value="${q.answers[i].answer}" ${q.answers[i].correct == "1" ? 'checked' : ''}>
            <input type="text"  name="${q.answers[i].questionid}" value="${q.answers[i].answer}" alt="${q.answers[i].answerid}">
            <br>
        `;
    }
}

addOption = async () => {
    let radio = document.createElement("input");
    radio.setAttribute("type", "radio");
    radio.setAttribute("name", "radioOption");

    let text = document.createElement("input");
    text.setAttribute("type", "text");
    text.setAttribute("name", "textOption");

    let br = document.createElement("br");

    document.getElementById("questionBox").appendChild(radio);
    document.getElementById("questionBox").appendChild(text);
    document.getElementById("questionBox").appendChild(br);
}


addQuestion = async () => {
    const question = document.getElementById("question").value;

    if (!question) {
        alert("enter question");
        return;
    }

    const answers = [];
    const textOptions = document.querySelectorAll('input[name="textOption"]');

    for (let i = 0; i < textOptions.length; i++) {
        let answer = textOptions[i].value;
        if (!answer) {
            alert("enter all answers");
            return;
        }
        answers.push({ answer })
    }

    const checkedRadio = document.querySelector('input[name="radioOption"]:checked');

    if (!checkedRadio) {
        alert("select correct answer");
        return;
    }

    const radioOptions = document.querySelectorAll('input[name="radioOption"]');

    for (let i = 0; i < radioOptions.length; i++) {
        answers[i].correct = radioOptions[i].checked ? "1" : "0";
    }


    await writeQuestionToDB({ question, answers });
    await readQuestionsFromDB();
}

document.getElementById("add_option").addEventListener("click", () => { addOption() });
document.getElementById("save_question").addEventListener("click", () => { addQuestion() });
readQuestionsFromDB();