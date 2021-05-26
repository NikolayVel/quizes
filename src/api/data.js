import * as api from './api.js' 

const host = 'https://parseapi.back4app.com'
api.settings.host = host;

export const login = api.login;
export const register = api.register;
export const logout = api.logout;
export const get = api.get

//Implement application specific requests

function createPointer(name, id){
    
    return {
        __type: 'Pointer', 
        className: name, 
        objectId: id}
}

function addOwner(object){
    const userId = sessionStorage.getItem('userId');
    const result = Object.assign({},object);
    result.owner = createPointer('_User', userId)
    return result;
   
}

// Quiz Collection

export async function getQuizes() {
    return (await api.get('/classes/Quiz')).results
}

export async function getQuizById(id) {
    return api.get('/classes/Quiz/'+id+'?include=owner')
}
export async function createQuiz(quiz) {
    const body = addOwner(quiz)
    
    return await api.post('/classes/Quiz', body);
}

export async function updateQuiz(id, quiz){
    return await api.put('/classes/Quiz/'+id, quiz);
}

export async function deleteQuiz(id){
    return await api.del('/classes/Quiz/'+id);
}

// Question Collection

export async function getQuestionsByQuizId(quizId, ownerId){
    
    const query = JSON.stringify({
        quiz: createPointer('Quiz', quizId),
        owner: createPointer('_User', ownerId)
    })
    const request = '/classes/Question?where='+ encodeURI(query)
    //console.log(request)
    const response =  await api.get(request);
    return response.results
    
}

export async function createQuestion(quizId, question){
    const body = addOwner(question);
    body.quiz = createPointer('Quiz',quizId);
    return await api.post('/classes/Question', body)
}

export async function updateQuestion(id, question){
    return api.put('/classes/Question/'+id, question)
}

export async function deleteQuestion(id) {
    return await api.del('/classes/Question/'+id);
}

export async function getAllQuestions(){
    return await api.get('/classes/Question')
}

// Solution Collection

export async function getSolutionsByUserId(userId){
    const query = JSON.stringify({owner: createPointer('_User', userId) })
    const response = await api.get('/classes/Solution?where='+ encodeURIComponent(query))
    return response.results;
}

export async function getSolutionsByQuizId(quizId){
    const query = JSON.stringify({owner: createPointer('Quiz', quizId) })
    const response = await api.get('/classes/Solution?where='+ encodeURIComponent(query))
    return response.results;
}

export async function submitSolution(quizId, solution) {
    const body = addOwner(solution);
    body.quiz = createPointer('Quiz', quizId);
    return await api.post('/classes/Solution', body);

}