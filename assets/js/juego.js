const miModulo = (() => {
    'use strict'
    
    //Fundamentales
    var myModal = new bootstrap.Modal(document.getElementById("resultados"), {});

    let deck         = [];
    const tipos      = ['C', 'D', 'H', 'S'],
         especiales = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];

    // Referencias al HTML

    const body = document.querySelector('body');

    const btnPedir = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevo = document.querySelectorAll('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML = document.querySelectorAll('.punto');

    const tituloModal = document.querySelector('#resultados-titulo');
    const contModal = document.querySelector('#contenido-modal');


          //Esta función inicia el juego
    const inicializarJuego = ( numJugadores = 2 ) =>{
        deck = crearDeck();
        
        puntosJugadores = [];
        for( let i = 0; i < numJugadores; i++ ) {
            puntosJugadores.push(0);
        }
        
        puntosHTML.forEach( elem => elem.innerText = 0 );
        divCartasJugadores.forEach( elem => elem.innerHTML = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }

    // Esta función crea una nueva baraja
    const crearDeck = () =>{

        deck = [];

        for( let i = 2; i<=10; i++ ) {
            for (let tipo of tipos) {
                deck.push( i + tipo )
            }
        }
        for( let tipo of tipos ) {
            for( let esp of especiales ){
                deck.push( esp + tipo )
            }
        }

        return _.shuffle( deck );
    }

    // Esta función permite tomar una carta
    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'Ya no hay cartas en la baraja';
        }
        return deck.pop();
    }

    //Función para pedir el valor de la carta
    const valorCarta = ( carta ) => {
        const valor = carta.substring(0, carta.length - 1);
        return ( isNaN( valor ) ) ?
                ( valor === 'A' ) ? 11 : 10
                : valor * 1;
    }

    // Turno: 0 = Primer jugador; el último es la computadora
    const acumularPuntos = ( carta, turno ) =>{
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta( carta );
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = ( carta, turno ) => {

        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${ carta }.png`;
        imgCarta.classList.add( 'carta' )
        divCartasJugadores[turno].append( imgCarta );

    }

    const determinarGanador = () => {
        
        const [ puntosJugador, puntosComputadora ] = puntosJugadores;
        
        function modalContenido(condicion) {

            let ganador = "";
            let ganador2 = "";
            

            if (condicion === "j") {
                ganador = "ganador";
                ganador2 = "perdedor"; 
            } if (condicion === "c") {
                ganador = "perdedor";
                ganador2 = "ganador"; 
            }

            let modalContenido = `
            <div class="card ${ganador} justify-content-center">
                <div class="card-body text-center">
                <h4 class="card-title">Jugador</h5>
                <p class="card-text"><span class="fw-bold fs-1">${puntosJugador}</span><br>puntos</p>
                </div>
            </div>
            
            <div class="card ${ganador2} justify-content-center">
                <div class="card-body text-center">
                <h4 class="card-title">CPU</h5>
                <p class="card-text"><span class="fw-bold fs-1">${puntosComputadora}</span><br>puntos</p>
                </div>
            </div>`;
            return modalContenido;
        }
        
        setTimeout(() => {   
            if ( puntosComputadora === puntosJugador ) {
                /*Empate*/
                tituloModal.textContent = 'Empate';
                contModal.innerHTML = modalContenido();
                myModal.toggle();
            } else if ( puntosJugador > 21 ) {
                /*Derrota*/
                tituloModal.textContent = 'Perdiste...';
                contModal.innerHTML = modalContenido("c");
                myModal.toggle();
            } else if ( puntosComputadora > 21 || puntosJugador === 21){
                /*Victoria*/
                tituloModal.innerText = '¡Ganaste!';
                contModal.innerHTML = modalContenido("j");
                myModal.toggle();
            } else {
                /*Derrota*/
                tituloModal.innerText = 'Perdiste...';
                contModal.innerHTML = modalContenido("c");
                myModal.toggle();
            }
        }, 1000);

    }

    // Turno del CPU

    const turnoComputadora = () => {
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta()
            puntosComputadora = acumularPuntos( carta, puntosJugadores.length - 1 )
            crearCarta( carta, puntosJugadores.length - 1 )

        } while ( puntosComputadora < 17 )

        determinarGanador();
    }


    //Eventos
    btnPedir.addEventListener('click', () => {
        
        const carta = pedirCarta();
        let puntosJugador = acumularPuntos( carta, 0 );

        crearCarta( carta, 0 );

        if ( puntosJugador > 21 ) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        } else if ( puntosJugador === 21 ) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        }

    } );

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora( puntosJugadores[0] );
    });

    btnNuevo.forEach(btn => btn.addEventListener('click', () => {
        myModal.hide()
        inicializarJuego();
    }));


    return {
        nuevoJuego: inicializarJuego
    };

})();