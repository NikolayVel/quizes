import {html, render} from '../../lib.js'



const radioEdit = (questionIndex, index, answer, checked) => html`
<div class="editor-input">

<label class="radio">
    <input class="input" type="radio" name=${`question-${questionIndex}`} value=${index} ?checked=${checked} />
    <i class="fas fa-check-circle"></i>
</label>

<input class="input" type="text" name=${`answer-${index}`} .value=${answer} />
<button data-index=${index} class="input submit action"><i class="fas fa-trash-alt"></i></button>
</div>`;

export function createAnswerList(answers, questionIndex, correctIndex) {
    const current = answers.slice()

    const element = document.createElement('div');
    element.addEventListener('click', onDelete);

    update();
    return element;

    function update(){
        render(html`
        ${current.map((a, i) => radioEdit(questionIndex, i, a, correctIndex==i))}
        <div class="editor-input">
                <button @click=${addAnswer} class="input submit action">
                    <i class="fas fa-plus-circle"></i>
                    Add answer
                </button>
            </div>`,
            element
        );
    }

    function addAnswer(e) {
        e.preventDefault();
        current.push('');
        update();
    }

    function onDelete(e){
        e.preventDefault();
        let index;
        if (e.target.tagName == 'BUTTON') {
            index = e.target.dataset.index
        }
        else if (e.target.parentNode.tagname = 'BUTTON'){
            index = e.target.parentNode.dataset.index
        }
        if (index != undefined) {
            current.splice(index,1);
            update();
        }
    }

}