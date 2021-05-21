import * as api from './api/data.js'
window.api = api

import {logout as apiLogOut} from './api/data.js';
import {page, render} from '../src/lib.js';
import {editorPage} from './views/editor/editor.js';
import { browsePage } from './views/browse.js';
import {registerPage,loginPage } from './views/auth.js';

const main = document.getElementById('content')
setUserNav();

document.getElementById('logoutBtn').addEventListener('click', onLogout);

page ('/create',decorateContext, editorPage)
page ('/edit/:id',decorateContext, editorPage)
page ('/browse',decorateContext, browsePage)
page ('/login',decorateContext, loginPage)
page ('/register',decorateContext, registerPage)

page.start();
// page.redirect('/create')


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