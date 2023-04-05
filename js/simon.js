



/* global variables */
const simonPanel = document.getElementById('simonPanel'); // Elemento padre que contiene todos los botones del juego
const simonBtns = document.querySelectorAll('.simon-btn'); // Todos los botones del juego
const resetPanel = document.getElementById('resetPanel'); // Elemento padre que contiene el boton de reinicio del juego

const highScore = document.getElementById('highScore'); // Puntaje más alto
const resetBtn = document.getElementById('btnReset'); // Botón de reinicio

const statusPanel = document.getElementById('statusPanel');
const textStatus = document.getElementById('textStatus')
const simonScore = document.getElementById('score'); // Puntaje actual
const simonBtnsBg = document.querySelectorAll('.bg-btn-panel');

let score = 0; // Inicializa el puntaje en cero
simonScore.textContent = score; // Muestra el puntaje actual
let highScoreValue = 0;

let sequence = [] // Secuencia que sigue el juego
let userSequence = [] // Secuencia del usuario

let win = false
let lose = false // Variable que ayudará a saber si el usuario ha perdido o no
let steps = 0 // Pasos dados por el usuario

let showingSequence = false; // Variable que ayudará a saber si se está mostrando la secuencia del juego
let sequenceCounter = 0 // Contador que aumentará segun se vaya cumpliendo la secuencia 

/* ! classes */

function showGameOverMessage() {
  statusPanel.classList.add('status-panel--active');
  resetPanel.classList.add('reset-panel-active'); // Se muestra el botón de resetear el juego     

  disableButtons();
  sfx.error.play();

  textStatus.textContent = "You Lose!";
  textStatus.classList.add('text--lose');
}

function showYouWinMessage() {
  statusPanel.classList.add('status-panel--active');
  resetPanel.classList.add('reset-panel-active'); // Se muestra el botón de resetear el juego     

  disableButtons();
  sfx.levelPassed.play();

  textStatus.textContent = "You Win!";
  textStatus.classList.add('text--win');
}

function disableButtons() {
  simonBtns.forEach((el) => {
    el.classList.add('simon-btn--disable'); // Se deshabilitan todos los botones
    el.disabled = true
  })
}
function enableButtons() {
  simonBtns.forEach((el) => {
    el.disabled = false
    el.classList.remove('simon-btn--disable') // Habilita los botones del juego
  })
}




function setBtnFlash(btn) { // Función que agrega la clase 'flash' a los botones cuando son presionados
  let flash, flashBg

  // if(showingSequence) return

  switch(btn.dataset.id) {
      case "1": 
          flash = "green-active";
          flashBg = "bg-green"
          sfx.greenButton.play() // Reproduce el sonido del botón verde


          break;

      case "2":
          flash = "red-active";
          flashBg = "bg-red"
          sfx.redButton.play() // Reproduce el sonido del botón rojo
          break;
      
      case "3":
          flash = "yellow-active";
          flashBg = "bg-yellow"
          sfx.yellowButton.play() // Reproduce el sonido del botón amarillo

          break;
  
      default:
          flash = "blue-active";
          flashBg = "bg-blue"
          sfx.blueButton.play() // Reproduce el sonido del botón azul
  }

  btn.classList.add(flash) // Agrega la clase almacenada en 'flash' al botón presionado

  simonBtnsBg.forEach((el) => {
    if(btn.dataset.id == el.dataset.id) {
      // console.log(`${el.dataset.id} ---> ${btn.dataset.id}`)
      el.classList.add(flashBg)
    }
  })


  setTimeout(() => {
      btn.classList.remove(flash) // Elimina la clase de flash del botón de Simon después de un corto retraso

      simonBtnsBg.forEach((el) => {
        if(btn.dataset.id == el.dataset.id) {
          el.classList.remove(flashBg)
        }
      })
      // buttonPressed = false; // Establece el botón presionado en falso después de un corto retraso

  }, 800);
}


function generateSimonSequence() { //  Genera la secuencia que seguirá el juego
  let i = 0;

  let prevNum, prevPrevNum;

  do {
    let num = Math.floor(Math.random() * 4) + 1; // Genera un número aleatorio entre 1 y 4
    if (num !== prevNum || num !== prevPrevNum) { // Verifica si el número actual no se repite más de dos veces seguidas
      sequence.push(num);
      prevPrevNum = prevNum;
      prevNum = num;
      i++;
    }
  } while (i < 10); 

  userSequence[0] = sequence[0] // Por defecto, el primer paso del usuario es el primer numero de la secuencia generada
  // console.log(userSequence)
  return sequence
}



function showSimonSequence() { // Recorre la secuencia 'userSequence' para mostrarla
  // console.log(`Antes -> ${showingSequence}`)

  disableButtons()

  const sequenceLength = userSequence.length;
  let currentButton = 0;
  let animatingButton = 0;
    // showingSequence = false

    const intervalId = setInterval(() => {
      if (!animatingButton) { // Verificar si no se está animando un botón en este momento
        const buttonIndex = userSequence[currentButton];
        const button = simonBtns[buttonIndex - 1];
  
        setBtnFlash(button);
        animatingButton = true;
  
        setTimeout(() => {
          animatingButton = false;
          currentButton++;
  
          if (currentButton === sequenceLength) {
            clearInterval(intervalId);
            setTimeout(() => enableButtons(), 500); // Esperar un tiempo antes de habilitar los botones
          }
        }, 600);
      }
    }, 450);
}


// ! Falta: //
// ? Que no se puedan presionar botones mientras se ejecuta
// ? Que no se puedan presionar botones mientras se ejecuta



function handleUserInput(e) { // Función llamada cada vez que se presiona un botón del juego

    if(e.target.tagName == 'BUTTON') { // Verifica el elemento clickeado es un botón 


      if(e.target.dataset.id != sequence[steps]) { // Si el elemento dataset id del botón clickeado no coincide con el siguiente elemento de la secuencia generada

            // console.log('%cYou Lose!', 'color: red;');
            lose = true 
            showGameOverMessage()

      } else {

        setBtnFlash(e.target) // Reproduce el sonido y muestra el flash en el boton presionadome

        // Si el elemento dataset id del botón clickeado coincide con el siguiente elemento de la secuencia generada
        
          if(steps == userSequence.length-1) { // Si se ha completado la secuencia actual
              
              // console.log("__")
              // console.log(userSequence)
              // console.log(`sequence.length: ${sequence.length} -> userSequence: ${userSequence.length}`)
              if(userSequence.length == sequence.length) {
                win = true;
                showYouWinMessage()
                return
              }
            
              userSequence.push(sequence[steps+1]) // Se añade el siguiente elemento de la secuencia al array userSequence
              steps = 0;

              sequenceCounter++

  

              if(e.target.dataset.id == sequence[sequenceCounter-1]) { // Si el último elemento añadido coincide con el siguiente elemento de la secuencia

                if(userSequence.length-1 != 1) { // Se incrementa el puntaje si la secuencia no es de longitud 1
                  score += 1 
                }

                // console.log(`${e.target.dataset.id} --> ${sequence[sequenceCounter-1]}`)
              }

              if(userSequence.length-1 != 1) { // Si la secuencia no es de longitud 1, se actualiza el puntaje en la pantalla
                simonScore.textContent = score
              }

              setTimeout(() => {
                showSimonSequence()  // Se llama la función showSimonSequence() para mostrar la siguiente secuencia
              }, 1000);

              // console.log(`sequenceCounter: ${sequenceCounter}`)

  

          } else {
              steps++
              // console.log('es ', steps)
          }

      }
    }
  
}



function startGame() { // Función que inicia el juego 
    sequence = generateSimonSequence(); // Genera una nueva secuencia para el juego
    showSimonSequence(); // Muestra la secuencia generada en los botones del juego

    // console.log(`sequence: `, sequence)
    // console.log(`userSequence: `, userSequence)
    // console.log("---")
    simonPanel.addEventListener('click', (e) => { // Escucha si el panel de Simon para detectar cuando el usuario haga clic en un botón
      
      if(lose || showingSequence || win) { // Si el usuario ya perdió, los botones se bloquearán
        e.preventDefault
        // console.log(lose)
        // console.log(showingSequence)

      } else {
        handleUserInput(e) // Si el usuario no ha perdido, entonces maneja la entrada del usuario
      }
    })
}



let sfx = { // Define un objeto llamado sfx que contiene los sonidos de los botones del juego
  greenButton: new Howl({

    src: [ // Define la fuente del sonido para el botón verde
      'https://th3alexdev.github.io/simonsaysapp/assets/sounds/simonSound1.wav'
    ],
    pool: 5 // Define la cantidad de instancias que pueden ser reproducidas simultáneamente
  }),
  redButton: new Howl({
    src: [
      'https://th3alexdev.github.io/simonsaysapp/assets/sounds/simonSound2.wav'
    ],
    pool: 5
  }),
  yellowButton: new Howl({
    src: [
      'https://th3alexdev.github.io/simonsaysapp/assets/sounds/simonSound3.wav'
    ],
    pool: 5
  }),
  blueButton: new Howl({
    src: [
      'https://th3alexdev.github.io/simonsaysapp/assets/sounds/simonSound4.wav'
    ],
    pool: 5
  }),
  error: new Howl({
    src: [
      'https://th3alexdev.github.io/simonsaysapp/assets/sounds/error.wav'
    ],
    pool: 5
  }),
  levelPassed: new Howl({
    src: [
      'https://th3alexdev.github.io/simonsaysapp/assets/sounds/level-passed.wav'
    ],
    pool: 5
  }),
}

function resetGame() { // Función que restablece el juego a su estado inicial cuando el usuario pierde

  textStatus.textContent = "";
  textStatus.classList.remove('text--lose');
  textStatus.classList.remove('text--win');

  enableButtons()
  statusPanel.classList.remove('lose-panel--active')

  if (score > highScoreValue) { // Actualiza el puntaje máximo si es necesario
    highScoreValue = score;
    highScore.textContent = highScoreValue;
  }
  
  sequenceCounter = 0  // Reinicia el contador de la secuencia
  score = 0;  // Reinicia el puntaje actual
  resetPanel.classList.remove('reset-panel-active')   // Oculta el panel de reinicio

  /* Genera de nuevo la secuencia del juego y restablece la secuencia del usuario */
  sequence = []
  userSequence = []
  sequence = generateSimonSequence();

  // Actualiza la puntuación de Simon en la interfaz
  simonScore.textContent = score

  setTimeout(() => {
    showSimonSequence(); // Muestra la nueva secuencia 
  }, 1000);
  
  // console.clear()
  // console.log(`sequence: `, sequence)
  // console.log(`userSequence: `, userSequence)
  // console.log("---")

  lose = false; // Reinicia el estado al haber perdido
  steps = 0;
}


resetBtn.addEventListener('click', (e) => { // Agrega un evento de clic para el botón de reinicio
  resetGame() 
})