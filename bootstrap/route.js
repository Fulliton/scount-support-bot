/**
 *
 * @param {RegExp} path
 * @param {typeof AbstractAction} action - Класс-наследник AbstractAction
 */
function route(path, action) {
    global.core.getBot().onText(path, (msg) =>{
        (new action(global.core.getBot(), msg)).handle();
    })
}

module.exports = route;