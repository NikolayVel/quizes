import { deleteQuestion } from '../../api/data.js';
import {html, render} from '../../lib.js'
import { createQuestion } from './question.js';


const questionList = (questions, addQuestion) => html`

<header class="pad-large">
    <h2>Questions</h2>
</header>

  ${questions}

<article class="editor-question">
    <div class="editor-input">
        <button @click=${addQuestion} class="input submit action">
            <i class="fas fa-plus-circle"></i>
            Add question
        </button>
    </div>
</article>

`;


export function createList(quizId, questions, updateCount){
    
    const currentQuestions = questions.map((q, i) => createQuestion(quizId, q,i+1, removeQuestion.bind(null, i), updateCount))

    const element = document.createElement('DIV');
    element.className = 'pad-large alt-page'
    
    update();

    return element;

    function addQuestion() {
        questions.push({
            text:'',
            answers: [],
            correctIndex: 0
        });
        
        currentQuestions.push(createQuestion(quizId, {
            text:'',
            answers: [],
            correctIndex: 0
        }, currentQuestions.length+1, removeQuestion.bind(null, currentQuestions.length),updateCount));

        update();
    }

    function update() {
        render(questionList(currentQuestions, addQuestion), element)
    }

    async function removeQuestion(index, id) {
       
        console.log(index)

        console.log(id)
        const confirmed = confirm('Are you sue you want to delete this question?');
   
        if (confirmed) {
          if (id){

              await deleteQuestion(id)
              updateCount(-1);
            }

            questions.splice(index,1);
            currentQuestions.splice(index,1);
            update();
            
        } 
        
        
    }
}