function hide() {
    const modal = document.querySelector('#controls-modal');
    modal.classList.remove('visible');
}

function show() {
    const modal = document.querySelector('#controls-modal');
    modal.classList.add('visible');
}

document.querySelector('#controls').addEventListener('click', show);
document.querySelector('#controls-modal').addEventListener('click', hide);
document.querySelector('#modal').addEventListener('click', evt => evt.stopPropagation());
document.querySelector('#close-btn').addEventListener('click', hide);
