
animateByPromiseMethod('race', true);
animateByPromiseMethod('race', false);
animateByPromiseMethod('all', true);
animateByPromiseMethod('all', false);
animateByPromiseMethod('allSettled', true);
animateByPromiseMethod('allSettled', false);

function animateByPromiseMethod(promiseMethod, hasOneRejected){
    let oneSquare = document.querySelector(`.${promiseMethod}${hasOneRejected ? '.with-rejection' : '.no-rejection'} > .one`);
    let twoSquare = document.querySelector(`.${promiseMethod}${hasOneRejected ? '.with-rejection' : '.no-rejection'} > .two`);
    let threeSquare = document.querySelector(`.${promiseMethod}${hasOneRejected ? '.with-rejection' : '.no-rejection'} > .three`);
    let resultElement = document.querySelector(`.${promiseMethod}${hasOneRejected ? '.with-rejection' : '.no-rejection'} .result`);

    const interval1 = 10000*Math.random();
    const interval2 = 5000;
    const interval3 = 10000*Math.random();

    let [ animation1, animation2, animation3 ] = [
        anime({
            targets: `.${promiseMethod}${hasOneRejected ? '.with-rejection' : '.no-rejection'} > .one`,
            translateX: 300,
            duration: interval1,
            easing: 'linear'
        }),
        anime({
            targets: `.${promiseMethod}${hasOneRejected ? '.with-rejection' : '.no-rejection'} > .two`,
            translateX: 300,
            duration: interval2,
            easing: 'linear'
        }),
        anime({
            targets: `.${promiseMethod}${hasOneRejected ? '.with-rejection' : '.no-rejection'} > .three`,
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
            if(hasOneRejected){
                anime.set(threeSquare, { backgroundColor: 'red' });
                animation3.pause();
                reject();
            }
            else{
                resolve();
            }
        }, (interval3 - (interval3*(hasOneRejected ? 0.2 : 0))))
    })

    animation1.finished.then(() => {
        anime.set(oneSquare, { backgroundColor: 'green' })
    })
    animation2.finished.then(() => {
        anime.set(twoSquare, { backgroundColor: 'green' })
    })
    animation3.finished.then(() => {
        if(!hasOneRejected){
            anime.set(threeSquare, { backgroundColor: 'green' })
        }
    })

    Promise[promiseMethod]([
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
}