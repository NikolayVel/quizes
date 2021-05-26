import * as api from './api/data.js'
window.api = api

import {logout as apiLogOut} from './api/data.js';
import {page, render} from '../src/lib.js';
import {editorPage} from './views/editor/editor.js';
import { browsePage } from './views/browse.js';
import { quizPage } from './views/quiz/quiz.js';
import {registerPage,loginPage } from './views/auth.js';
import {cube} from './views/common/loader.js';
import { resultPage } from './views/quiz/result.js';


const cache = {};

const main = document.getElementById('content')
setUserNav();

document.getElementById('logoutBtn').addEventListener('click', onLogout);

page ('/create',decorateContext, editorPage)
page ('/edit/:id',decorateContext, editorPage)
page ('/browse',decorateContext, browsePage)
page ('/login',decorateContext, loginPage)
page ('/register',decorateContext, registerPage)
page ('/quiz/:id',decorateContext, getQuiz, quizPage)
page ('/result/:id',decorateContext, getQuiz, resultPage)

page.start();
// page.redirect('/create')

async function getQuiz(context, next) {
    context.clearCache = clearCache;
    const quizId = context.params.id;
    
    if (cache[quizId] == undefined) {
        context.render(cube());
        cache[quizId] = await api.getQuizById(quizId);
        const ownerId = cache[quizId].owner.objectId;
        cache[quizId].questions = await api.getQuestionsByQuizId(quizId, ownerId);
        cache[quizId].answers = cache[quizId].questions.map(q => undefined);

    }
    
    context.quiz = cache[quizId]
    next();
}

function clearCache(quizId) {
    
    if (cache[quizId]) {

        delete cache[quizId]
    }
}

function decorateContext(context, next) {
    
    context.render = (content) => render(content,main);
    context.setUserNav = setUserNav;
    next();
}

function setUserNav() {
    const userId = sessionStorage.getItem('userId')
    if (userId != null) {
        document.getElementById('user-nav').style.display = 'block';
        document.getElementById('guest-nav').style.display = 'none';

    } else {
        document.getElementById('user-nav').style.display = 'none';
        document.getElementById('guest-nav').style.display = 'block';
    }
}

async function onLogout(){
    await apiLogOut();
    setUserNav();
    page.redirect('/')
}