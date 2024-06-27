// script.js
let currentFloor = 0;
let callQueue = [];
let moving = false;
let doorsOpen = false;

function callElevator(floor) {
    if (!callQueue.includes(floor)) {
        callQueue.push(floor);
        if (!moving) {
            processQueue();
        }
    }
}

function processQueue() {
    if (callQueue.length > 0) {
        moving = true;
        let nextFloor = callQueue.shift();
        moveToFloor(nextFloor);
    } else {
        moving = false;
    }
}

function moveToFloor(floor) {
    const elevator = document.getElementById('elevator');
    if (doorsOpen) {
        closeDoors().then(() => {
            moveElevator(floor);
        });
    } else {
        moveElevator(floor);
    }
}

function moveElevator(floor) {
    const elevator = document.getElementById('elevator');
    elevator.style.top = `${75 - floor * 25}%`; // Calcula a posição do elevador

    setTimeout(() => {
        currentFloor = floor;
        openDoors().then(() => {
            moving = false;
            processQueue(); // Continuar processando a fila de chamadas após abrir as portas
        });
    }, 1000); // Simula o tempo de viagem do elevador
}

function openDoors() {
    return new Promise(resolve => {
        const elevator = document.getElementById('elevator');
        const doors = document.getElementById('doors');
        doors.style.width = '0';
        elevator.classList.add('stopped');
        doorsOpen = true;
        resolve();
    });
}

function closeDoors() {
    return new Promise(resolve => {
        const elevator = document.getElementById('elevator');
        const doors = document.getElementById('doors');
        doors.style.width = '100%';
        elevator.classList.remove('stopped');
        doorsOpen = false;
        setTimeout(resolve, 1000); // Simula o tempo de fechamento das portas
    });
}

function handleInternalButton(floor) {
    if (currentFloor !== floor) {
        if (doorsOpen) {
            closeDoors().then(() => {
                moveToFloor(floor);
            });
        } else {
            moveToFloor(floor);
        }
    }
}

function callElevatorFromFloor(floor) {
    if (doorsOpen) {
        closeDoors().then(() => {
            callElevator(floor);
        });
    } else {
        callElevator(floor);
    }
}

// Adiciona eventos aos botões internos do elevador
document.querySelectorAll('.panel button').forEach(button => {
    button.addEventListener('click', (e) => {
        const floor = parseInt(e.target.textContent);
        handleInternalButton(floor);
    });
});

// Adiciona eventos aos botões de chamada de cada andar
document.querySelectorAll('.floor button').forEach(button => {
    button.addEventListener('click', (e) => {
        const floor = parseInt(e.target.parentElement.id.split('-')[1]);
        callElevatorFromFloor(floor);
    });
});
