import { html, render } from '../../lib.js'
import { createAnswerList } from './answer.js';

import { createQuestion as apiCreate, updateQuestion } from '../../api/data.js'
import {createOverlay} from '../common/loader.js';

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
    <textarea class="input editor-input editor-text" name="text" placeholder="Enter question"
        .value=${question.text}></textarea>

    ${createAnswerList(question.answers, index, question.correctIndex)}

</form>
`

//<div class="loading-overlay working"></div>
const viewTemplate = (question, index, onEdit, onDelete) => html`
    <div class="layout">
        <div class="question-control">
            <button @click=${onEdit} class="input submit action"><i class="fas fa-edit"></i> Edit</button>
            <button @click=${onDelete} class="input submit action"><i class="fas fa-trash-alt"></i> Delete</button>
        </div>
        <h3>Question ${index}</h3>
    </div>
    <div>
        <p class="editor-input">${question.text}</p>
    
        ${question.answers.map((a, i) => radioView(a, i == question.correctIndex))}
    </div>
`

const radioView = (answer, checked) => html`
<div class="editor-input">
    <label class="radio">
        <input class="input" type="radio" disabled ?checked=${checked} />
        <i class="fas fa-check-circle"></i>
    </label>
    <span>${answer}</span>
</div>`;

export function createQuestion(quizId, question, index, removeQuestion, updateCount) {
    const element = document.createElement('article');
    element.className = 'editor-question';

    showView();

    return element;

    function onEdit() {
        showEditor()
    }

    // function onDelete() {
    //     const confirmed = confirm('Are you sue you want to delete this question?');
    //     if (confirmed) {
    //         element.remove();

    //     }

    // }

    async function onSave() {
        const formData = new FormData(element.querySelector('form'));

        const data = [...formData.entries()] //.reduce((a, [k,v]) => Object.assign(a, {[k]:v}), {});

        const answers = data
            .filter(([k, v]) => k.includes('answer-'))
            .reduce((a, [k, v]) => {
                const index = Number(k.split('-')[1]);
                a[index] = v;
                return a;
            }, [])

        const body = {
            text: formData.get('text'),
            answers,
            correctIndex: Number(data.find(([k, v]) => k.includes('question-'))[1])

        }


        const loader = createOverlay();
        try{
            element.appendChild(loader);

            if (question.objectId) {
                //update
                await updateQuestion(question.objectId, body);
            } else {
                //create
                const result = await apiCreate(quizId, body);
                question.objectId = result.objectId
                updateCount();
            }

            Object.assign(question, body);
            question = copyQuestion(question);
            showView();
        } catch (err){
            console.error(err)
        } finally {
            loader.remove();
        }

      
    }

    function onCancel() {
        showView()
    }

    function showView() {

        const onDelete = async (e, index) => {
            const loader = createOverlay();
            element.appendChild(loader);
            console.log(index)
            await removeQuestion(index, question.objectId);
        }
        render(viewTemplate(question, index, onEdit, onDelete), element)
    }
    function showEditor() {
        render(editorTemplate(question, index, onSave, onCancel), element)
    }

    function copyQuestion(question) {
        const currentQuestion = Object.assign({}, question);
        currentQuestion.answers = currentQuestion.answers.slice();
        return currentQuestion;
    }
}