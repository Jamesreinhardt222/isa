
let question_num = 1;
addButton = document.getElementById("add")
addButton.onclick = () => {

    user_interface = document.getElementById("interface")

    let heading = document.createElement("h1")
    heading.classList.add(`dynamically-added-${question_num}`);
    heading.innerHTML = `Question ${question_num}`;

    let questionInput = document.createElement("input");
    questionInput.classList.add(`dynamically-added-${question_num}`);
    questionInput.classList.add(`question-prompt`);
    questionInput.type='textarea';
    user_interface.before(heading);
    user_interface.before(questionInput);

    let option_selector;
    let option_input;
    let break_element;
    for (let i = 0; i < 4; i++) {
        option_selector = document.createElement("input");
        option_selector.classList.add(`dynamically-added-${question_num}`);
        option_input = document.createElement("input");
        option_input.classList.add(`dynamically-added-${question_num}`);
        option_selector.type = "radio";
        option_input.type = "text";
        option_selector.name = `q${question_num}`;
        break_element = document.createElement("br")
        break_element.classList.add(`dynamically-added-${question_num}`);

        user_interface.before(option_selector)
        user_interface.before(option_input)
        user_interface.before(break_element)

    }
    question_num++;
}

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
        
        document.body.removeChild(new_array[i])
    }
    question_num--
}


// <h2>Question 1</h2>
// <input class="question-prompt" type="textarea">

// <input type="radio" name="q1" value="a"><input type="text"><br>
// <input type="radio" name="q1" value="b"><input type="text"><br>
// <input type="radio" name="q1" value="c"><input type="text"><br>
// <input type="radio" name="q1" value="a"><input type="text">
