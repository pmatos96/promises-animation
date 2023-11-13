
let oneSquare = document.querySelector('.one');
let twoSquare = document.querySelector('.two');
let threeSquare = document.querySelector('.three');
let resultElement = document.querySelector('.result');

const interval1 = 10000*Math.random()
const interval2 = 5000;
const interval3 = 8000;

let [ animation1, animation2, animation3 ] = [
    anime({
        targets: '.one',
        translateX: 300,
        duration: interval1,
        easing: 'linear'
    }),
    anime({
        targets: '.two',
        translateX: 300,
        duration: interval2,
        easing: 'linear'
    }),
    anime({
        targets: '.three',
        translateX: 300,
        duration: interval3,
        easing: 'linear'
    })
]

const randomTimeSuccessPromise = new Promise((resolve, reject) => {
    setTimeout(resolve, interval1)
})

const fixedTimeSuccessPromise = new Promise((resolve, reject) => {
    setTimeout(resolve, interval2)
})

const fixedTimeFailPromise = new Promise((resolve, reject) => {
    setTimeout(() =>  {
        anime.set(threeSquare, { backgroundColor: 'red' });
        animation3.pause();
        reject();
    }, (interval3 - (interval3*0.2)))
})

animation1.finished.then(() => {
    anime.set(oneSquare, { backgroundColor: 'green' })
})
animation2.finished.then(() => {
    anime.set(twoSquare, { backgroundColor: 'green' })
})

Promise.race([
    randomTimeSuccessPromise,
    fixedTimeSuccessPromise,
    fixedTimeFailPromise
]).then(response => {
    resultElement.textContent = "Fulfilled";
    resultElement.classList.add('fulfilled')
}).catch(error => {
    resultElement.textContent = "Rejected";
    resultElement.classList.add('rejected')
}).finally(response => {
    [ animation1, animation2, animation3 ].forEach(animation => animation.pause());
})