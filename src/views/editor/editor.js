import {topics, html, render} from '../../lib.js'
import { createList } from './list.js';
import {createQuiz, updateQuiz, getQuizById, getQuestionsByQuizId} from '../../api/data.js'

const pageTemplate = (quiz, quizEditor, updateCount) => html `
<section id="editor">

<header class="pad-large">
    <h1>${quiz ? 'Edit Quiz' : 'New Quiz'}</h1>
</header>

<div class="pad-large alt-page">
    ${quizEditor}
    
</div>



 ${quiz ? createList(quiz.objectId, quiz.questions, updateCount) : ''}

</section>
`

const quizEditorTemplate = (quiz, onSave, working) => html`
<form @submit = ${onSave}>
        <label class="editor-label layout">
            <span class="label-col">Title:</span>
            <input class="input i-med" type="text" name="title" .value=${quiz ? quiz.title : ''} ?disabled=${working}></label>
        <label class="editor-label layout">
            <span class="label-col">Topic:</span>
            <select class="input i-med" name="topic" .value=${quiz ? quiz.topic : '0'} ?disabled=${working}>
                <option value="0"><span class='quiz-meta'>----- Select Category -----</span></option>
                <option value="all">All Categories</option>
                ${Object.entries(topics).map(([k,v]) => html`<option value=${k} ?selected=${quiz.topic == k}>${v}</option>`)}
                <!-- <option value="it">Languages</option>
                <option value="hardware">Hardware</option>
                <option value="software">Tools and Software</option> -->
            </select>
        </label>
        <label class="editor-label layout">
            <span class="label-col">Description:</span>
            <textarea class="input i-med" name=description .value=${quiz ? quiz.description : ''} ?disabled=${working}></textarea>
        </label>
        <input class="input submit action" type="submit" value="Save">
    </form>
    ${working ? html`<div class="loading-overlay working"></div>` : ''}`;



// const questions = [
//     {
//         text: 'Is this the first question?',
//         answers: ['Yes', 'No','Maybe'],
//         correctIndex: 0
//     },
//     {
//         text: 'Is this the third question?',
//         answers: [ 'Maybe','No','Yes'],
//         correctIndex: 1
//     }

// ];

function createQuizEditor(quiz, onSave) {
    const editor = document.createElement('div');
    editor.className = 'pad-large alt-page';
    update()

    return {
        editor,
        updateEditor: update
    };

    function update(working) {
        render(quizEditorTemplate(quiz, onSave, working), editor);
    }
}

export async function editorPage(context){
    const quizId = context.params.id
    let quiz = null;
    let questions = [];
    if (quizId) {
        [quiz, questions] = await Promise.all([
             getQuizById(quizId),
             getQuestionsByQuizId(quizId, sessionStorage.getItem('userId'))
        ]);
       
        quiz.questions = questions;
        
        
    } else {

    }
    
    const {editor, updateEditor} = createQuizEditor(quiz, onSave);

    context.render(pageTemplate(quiz, editor, updateCount))

    async function updateCount(change= 0) {
        const count = questions.length + change;
        await updateQuiz(quizId, {questionCount: count});
    }

    async function onSave(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const title = formData.get('title');
        const topic = formData.get('topic');
        const description = formData.get('description');

        const data = {title, topic, description, questionCount: questions.length};

        try {
           
            updateEditor(true)
            if (quizId) {
                await updateQuiz(quizId, data);
            } else {
                const result = await createQuiz(data);
                context.page.redirect('/edit/'+result.objectId)
            }
        } catch(err) {
            console.error(err)
        } finally {
            updateEditor(false)
        }
        
    }

    
    
}
