

const btnStart = document.getElementById('btnStart')
const home = document.getElementById('home')
const game = document.getElementById('game')

btnStart.addEventListener('click', (e) => {
    home.classList.add('home-zoom')
    game.classList.add('game-zoom')
    game.classList.remove('hidden')

    setTimeout(() => {
        home.classList.add('hidden')
    }, 200);

    setTimeout(() => {
        startGame()
    }, 1500);
})

const hiddenElements = document.querySelectorAll('hiddenElement')


const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if(entry.isIntersecting) {
            entry.target.classList.add('showElement')
        }
    })
})

hiddenElements.forEach((el) => {observer.observe(el)})
