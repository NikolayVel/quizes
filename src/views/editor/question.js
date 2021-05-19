import {html, render} from '../../lib.js'
import { createAnswerList } from './answer.js';

const editorTemplate = (question, index, onSave, onCancel) => html`
<div class="layout">
            <div class="question-control">
                <button @click=${onSave} class="input submit action"><i class="fas fa-check-double"></i>
                    Save</button>
                <button @click=${onCancel} class="input submit action"><i class="fas fa-times"></i> Cancel</button>
            </div>
            <h3>Question ${index}</h3>
        </div>
        <form>
            <textarea class="input editor-input editor-text" name="text"
                placeholder="Enter question" .value=${question.text}></textarea>
            
                ${createAnswerList(question.answers, index, question.correctIndex)}
            
        </form>
`

//<div class="loading-overlay working"></div>
const viewTemplate = (question,index, onEdit, onDelete) => html`
      <div class="layout">
            <div class="question-control">
                <button @click=${onEdit} class="input submit action"><i class="fas fa-edit"></i> Edit</button>
                <button @click=${onDelete} class="input submit action"><i class="fas fa-trash-alt"></i> Delete</button>
            </div>
            <h3>Question ${index}</h3>
        </div>
        <div>
            <p class="editor-input">${question.text}</p>
            
           ${question.answers.map((a, i) => radioView(a, i==question.correctIndex))}
</div>
`

const radioView = (answer, checked) => html`
${console.log(checked)}
 <div class="editor-input">
<label class="radio">
    <input class="input" type="radio" disabled ?checked=${checked} />
    <i class="fas fa-check-circle"></i>
</label>
<span>${answer}</span>
</div>`;

export function createQuestion(question,index) {
    const element = document.createElement('article');
    element.className = 'editor-question';

   showView();

    return element;

    function onEdit(){
        showEditor()
    }

    function onDelete() {
        const confirmed = confirm('Are you sue you want to delete this question?');
        if (confirmed) {
            element.remove();
        }

    }

    function onSave() {
        const formData = new FormData(element.querySelector('form'));
        console.log([... formData.entries()])
        const data = [... formData.entries()].reduce((a, [k,v]) => Object.assign(a, {[k]:v}), {});
        console.log(data);
    }

    function onCancel() {
        showView()
    }

    function showView() {
        render(viewTemplate(question,index,onEdit,onDelete), element)
    }
    function showEditor(){
        render(editorTemplate(question, index, onSave, onCancel), element)
    }
}