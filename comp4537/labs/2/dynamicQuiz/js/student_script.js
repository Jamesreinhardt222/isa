

let number_of_questions = localStorage.getItem("number_of_questions");


let question;
let input1;
let input2;

let input3;
let input4;

create_question = () => {
    for (let i = 0; i < number_of_questions; i++) {
        question = localStorage.getItem(`question_${i + 1}`);


        question_text = document.createElement("p");
        question_text.innerHTML = question;
        document.body.appendChild(question_text);


        document.body.appendChild(question_text);

        let break_element;
        let option_selector;
        let answer;

        for (j = 0; j < 4; j++) {
            break_element = document.createElement("br");

            option_selector = document.createElement("input");
            option_selector.type = "radio";
            option_selector.name = `q${i}_selector`;


            input_text = localStorage.getItem(`input${j + 1}_q${i + 1}`);
            answer = document.createElement("span")
            answer.innerHTML = input_text

            document.body.appendChild(option_selector);
            document.body.appendChild(answer)
            document.body.appendChild(break_element);

        }

    }
    let submit = document.createElement("Button")
    submit.onclick = check_answer
    submit.innerHTML = "submit"
    document.appendChild(submit)
}

create_question()

submit_btn = document.createElement("Button")
submit_btn.name = "submit"
document.appendChild(submit_btn)

submit_btn.onclick = () => {
    for (let i = 0; i < number_of_questions; i++)
        selected_answers = document.getElementsByName(`q${i}_selector`)
    for (let j = 0; j < 4; j++) {
        if (selected_answers[j].checked) {
            // check answer

        }
    }
}
