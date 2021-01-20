
//  Keeps track of what question we're on.
let question_num = 1;

// ADD CODE
addButton = document.getElementById("add")
addButton.onclick = () => {

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
        option_selector.classList.add(`dynamically-added-${question_num}`);

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
    updateQuestion(question_num)
    question_num++;
}


// DELETE CODE
delete_button = document.getElementById("delete")
delete_button.onclick = () => {

    user_interface = document.getElementById("interface")

    console.log("clicked")
    removable_targets = document.getElementsByClassName(`dynamically-added-${question_num - 1}`);
    console.log(removable_targets)
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
        updateQuestion(i);
    }
}

// Update a specific question in local storage
updateQuestion = (number) => {
    localStorage.setItem("number_of_questions", `${number}`)
    question_input = document.getElementById(`question_input_${number}`)
    localStorage.setItem(`question_${number}`, question_input.value)
    localStorage.setItem(`input1_q${number}`, document.getElementById(`choice1_q${number}`).value)
    localStorage.setItem(`input2_q${number}`, document.getElementById(`choice2_q${number}`).value)
    localStorage.setItem(`input3_q${number}`, document.getElementById(`choice3_q${number}`).value)
    localStorage.setItem(`input4_q${number}`, document.getElementById(`choice4_q${number}`).value)
}

removeQuestion = (number) => {
    if (number == 0) {
        return
    }
    localStorage.setItem("number_of_questions", `${number - 1}`)

    question_input = document.getElementById(`question_input_${number}`)
    localStorage.removeItem(`question ${number}`)
    localStorage.removeItem(`input1_q${number}`)
    localStorage.removeItem(`input2_q${number}`)
    localStorage.removeItem(`input3_q${number}`)
    localStorage.removeItem(`input4_q${number}`)
}

let save_btn = document.getElementById("save")
save_btn.onclick = updateLocalStorage
