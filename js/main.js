

let imageToofu = document.getElementById('toofu');
let angleToofu = 0;

document.querySelector('button').addEventListener('click', function() {
    angleToofu += 30;
    imageToofu.style.transform = `rotate(${angleToofu}deg)`;
});