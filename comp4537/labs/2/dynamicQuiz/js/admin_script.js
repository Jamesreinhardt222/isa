//  Keeps track of what question we're on.
localStorage.clear()
let question_num = 1;


check_if_all_inputs_filled = function (number) {
    if (document.getElementById(`choice1_q${number}`).value == "" ||
        document.getElementById(`choice2_q${number}`).value == "" ||
        document.getElementById(`choice3_q${number}`).value == "" ||
        document.getElementById(`choice4_q${number}`).value == "" ||
        document.getElementById(`question_input_${number}`).value == ""
    ) {
        return false
    } else {
        choices = document.getElementsByClassName(`radio${number}`)
        console.log(choices)
        for (let i = 0; i < choices.length; i++) {
            if (choices[i].checked) {
                return true
            }
        }
        return false
    }
}

// // Update a specific question in local storage
updateQuestion = (number) => {



    localStorage.setItem("number_of_questions", `${number}`)
    question_input = document.getElementById(`question_input_${number}`)
    localStorage.setItem(`question_${number}`, question_input.value)
    localStorage.setItem(`input1_q${number}`, document.getElementById(`choice1_q${number}`).value)
    localStorage.setItem(`input2_q${number}`, document.getElementById(`choice2_q${number}`).value)
    localStorage.setItem(`input3_q${number}`, document.getElementById(`choice3_q${number}`).value)
    localStorage.setItem(`input4_q${number}`, document.getElementById(`choice4_q${number}`).value)



    choices = document.getElementsByClassName(`radio${number}`)
    for (let i = 0; i < choices.length; i++) {
        try {
            if (choices[i].checked) {

                connected_input = document.getElementById(`choice${i + 1}_q${number}`)
                localStorage.setItem(`answer${number}_text`, connected_input.value)
                localStorage.setItem(`answer${number}`, `${i + 1}`)
            }
        } catch (e) {
            console.log("No check box at this time")
        }
    }
}




// ADD CODE
addButton = document.getElementById("add")

let add_question = () => {

    // Gets the section with the buttons so we can add the newly created items before it.
    user_interface = document.getElementById("interface")


    // Create new elements for question
    let heading = document.createElement("h1")
    heading.classList.add(`dynamically-added-${question_num}`);
    heading.innerHTML = `Question ${question_num}`;

    let questionInput = document.createElement("input");
    questionInput.classList.add(`dynamically-added-${question_num}`);
    questionInput.classList.add(`question-prompt`);
    questionInput.setAttribute("id", `question_input_${question_num}`)
    questionInput.type = 'textarea';
    user_interface.before(heading);
    user_interface.before(questionInput);

    // Create prompts for the four question answers with for loop.
    let option_selector;
    let option_input;
    let break_element;
    for (let i = 0; i < 4; i++) {
        option_selector = document.createElement("input");
        option_selector.classList.add(`dynamically-added-${question_num}`)
        option_selector.classList.add(`radio${question_num}`);
        option_selector.setAttribute("name", `radio${question_num}`)

        option_input = document.createElement("input");
        option_input.classList.add(`dynamically-added-${question_num}`);
        option_input.setAttribute("id", `choice${i + 1}_q${question_num}`)

        option_selector.type = "radio";
        option_input.type = "text";
        option_selector.name = `q${question_num}`;

        break_element = document.createElement("br")
        break_element.classList.add(`dynamically-added-${question_num}`);

        user_interface.before(option_selector)
        user_interface.before(option_input)
        user_interface.before(break_element)

    }
    // Update local storage with the newly created fields.
    // updateQuestion(question_num)
    question_num = question_num + 1;
}
addButton.onclick = add_question



removeQuestion = (number) => {
    if (number == 0) {
        return
    }
    localStorage.setItem("number_of_questions", `${number - 1}`)

    question_input = document.getElementById(`question_input_${number}`)
    localStorage.removeItem(`question_${number}`)
    localStorage.removeItem(`input1_q${number}`)
    localStorage.removeItem(`input2_q${number}`)
    localStorage.removeItem(`input3_q${number}`)
    localStorage.removeItem(`input4_q${number}`)
    localStorage.removeItem(`answer${number}`)
    localStorage.removeItem(`answer${number}_text`)
}


// // DELETE CODE
delete_button = document.getElementById("delete")
delete_button.onclick = () => {

    if (question_num == 0) {
        return
    }
    removable_targets = document.getElementsByClassName(`dynamically-added-${question_num - 1}`);
    new_array = []
    for (let i = 0; i < removable_targets.length; i++) {
        new_array.push(removable_targets[i])
    }

    for (let i = 0; i < new_array.length; i++) {

        document.body.removeChild(new_array[i]);
    }
    removeQuestion(question_num - 1);
    question_num = question_num - 1;
}


// UPDATE STORAGE CODE
// Update local storage for each question that has been created up until now.
updateLocalStorage = () => {
    for (let i = 1; i < question_num; i++) {
        all_filled_out = true
        if (!check_if_all_inputs_filled(i)) {
            all_filled_out = false
            alert("Must fill out all fields")
            return
        }

    }
    for (let i = 1; i < question_num; i++) {
        if (all_filled_out) {
            updateQuestion(i);
        }
    }
}

let save_btn = document.getElementById("save")
save_btn.onclick = updateLocalStorage
