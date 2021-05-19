import {page, render} from '../src/lib.js'
import {editorPage} from './views/editor/editor.js'

const main = document.getElementById('content')

page ('/',decorateContext, editorPage)
page.start();


function decorateContext(context, next) {
    
    context.render = (content) => render(content,main);
    next();
}
