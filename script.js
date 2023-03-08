window.onload = function () {
    let imagenesEdificios = ["img/iconos/Edificios/almacen.png", "img/iconos/Edificios/granja.png", "img/iconos/Edificios/mercado.png", "img/iconos/Edificios/cabaña.png", "img/iconos/Edificios/establos.png", "img/iconos/Edificios/fabrica.png", "img/iconos/Edificios/ciudadela.png"];
    let imagenesMercado = ["img/iconos/Mercado/piel.png", "img/iconos/Mercado/madera.png", "img/iconos/Mercado/rocaPlutoniana.png", "img/iconos/Mercado/barquillo.png"];
    //ARRAY PARA CONTROLAR LAS PARTES DEL JUEGO QUE HAN SIDO DESBLOQUEADAS, PARA PODER GUARDAR Y CARGAR

    //almacen,edificios cabaña y recoger -> estaran habilitados siempre para poder guardar
    //granja,mercado,establos,fabrica
    let partesDesbloqueadas = [0, 0, -1, -1, -1, -1];
    //                        moneda                         piedra                            madera                 trabajadores                   trigo                     piel                 caballos                     pan
    let tipoRecursos = ["img/iconos/smeckles.png", "img/iconos/rocaPlutoniana.png", "img/iconos/madera.png", "img/iconos/meeseeks.png", "img/iconos/pickle.png", "img/iconos/piel.png", "img/iconos/morti.png", "img/iconos/barquillo.png"];
    let recursos = document.getElementById("recursos");
    let panelPrincipal = document.getElementById("panelPrincipal");
    //VARIABLE PARA ALMACENAR EL INTERVALO DE TIEMPO
    let intervaloTiempo;
    //Intervalo para crear Rickinillos
    let intervaloRickinillo;
    let panelMostrado = false;
    let notificacionesMostradas = false;
    let numeroDeNotificaciones = 0;
    //VARIABLES CON LAS QUE ESTABLECEMOS LA CANTIDAD DE RECURSOS QUE TENEMOS DE CADA TIPO
    let monedas = 50;
    let piedra = 100;
    let madera = 100;
    let trabajadores = 100;
    let rickinillo = 100;
    let cuero = 100;
    let caballos = 100;
    let barquillo = 100;

    //BOOLEANOS PARA CONTROLAR LAS CREACIONES QUE SE HAN LLEVADO A CABO
    let existeCentroRecursos = false;
    let primeraAdquisicionEdificios = true;
    let primeraCreacionAlmacen = true;
    let primeraCreacionMercado = true;
    let primerEstablo = true;
    let primeraFabrica = true;
    let primeraTaberna = true;

    //VARIABLES CON LOS PRECIOS DEL JUEGO 
    let precioAlmacen = 2;
    let precioCabaña = 6;

    let precioCueroMercado = 3;
    let precioPiedraMercado = 1;
    let percioMaderaMercado = 1;
    let preciobarquilloMercado = 15;

    let monedasGranja = 8;
    let piedrasGranja = 9;
    let maderaGranja = 5;

    let piedrasMercado = 8;
    let maderaMercado = 9;


    let monedasEstablos = 8;
    let maderaEstablos = 9;
    let trigoEstablos = 5;

    let cueroCaballo = 2;
    let trigoCaballo = 5;

    let monedasFabrica = 5;
    let piedrasFabrica = 8;
    let caballosFabrica = 3;
    let cantidadTrigoPan = 2;

    let monedasCiudadela = 10;
    let maderasCiudadela = 7;
    let piedrasCiudadela = 9;
    let caballosCiudadela = 3;
    let panCiudadela = 10;

    //funcion para generar botones en el panel principal
    const generarBotonEnPanelPrincipal = (id, texto) => {
        let nuevoBoton = document.createElement("button");
        nuevoBoton.setAttribute("id", `${id}`);
        nuevoBoton.innerText = texto;
        panelPrincipal.appendChild(nuevoBoton);
    }

    //Funcion para crear paneles que usaremos para almacenar botones
    const generarDivPanel = (id, titulo) => {
        let nuevoPanel = document.createElement("div");
        nuevoPanel.setAttribute("id", `${id}`);
        nuevoPanel.style.visibility = "hidden";

        let botonAtras = document.createElement("button")
        botonAtras.setAttribute("id", `atras${id}`);
        botonAtras.textContent = "Atras";
        //asignamos evento al boton atras
        botonAtras.addEventListener("click", function () {
            efectoPortal();
            nuevoPanel.style.animationName = "desaparicionPantalla";
            document.getElementById(`divPrincipal${id}`).style.animationName = "ocultarBoton";
            // modificarOpacidadHijos(`${id}`, 0);
            setTimeout(() => {
                nuevoPanel.style.display = "none"
            }, 200);

        });

        let imgTitulo = document.createElement("img");
        imgTitulo.setAttribute("class", "imgTitulo");
        imgTitulo.setAttribute("src", `img/${titulo}.png`);

        let divPrincipal = document.createElement("div");
        divPrincipal.setAttribute("id", `divPrincipal${id}`)

        nuevoPanel.appendChild(imgTitulo);
        nuevoPanel.appendChild(divPrincipal);
        nuevoPanel.appendChild(botonAtras);
        document.body.appendChild(nuevoPanel);
    }

    //funcion para generar botones en el panel edificios o en el panel mercado
    const generarBotonEnPanelSecundario = (id, texto, nombrePadre, funcionEvento) => {
        let padre = document.getElementById(`${nombrePadre}`);
        let nuevoBoton = document.createElement("button");
        nuevoBoton.setAttribute("id", `${id}`);
        nuevoBoton.innerText = texto;
        nuevoBoton.addEventListener("click", funcionEvento);
        //creamos un array con el valor de los botones que usaran appendChild

        let arrayValoresBotones = ["mercado", "cabaña", "granja", "atrapanelEdificio", "atraspanelMercado", "almacen", "barquillo", "cuero", "piedra", "madera"];
        if (!arrayValoresBotones.includes(id)) {
            let mercado = document.getElementById("divConImagenmercado");
            padre.insertBefore(nuevoBoton, mercado);
        } else {
            padre.appendChild(nuevoBoton);
        }

    }

    //funcion que usamos para poder mostrar notificaciones en el juego, para ellos decimos 
    //lo que va a contener y si es informativa o de error

    //añadir sonido
    const mostrarNotificacion = (contenido, tipo) => {
        let horasContador = document.querySelector("#horasContador").innerText;
        let minutosContador = document.querySelector("#minutosContador").innerText;
        let segundosContador = document.querySelector("#segundosContador").innerText;

        let centroNotificacion = document.querySelector("#notificacion");
        let primerElementoCentroNotificacion = centroNotificacion.querySelector(".notificacionIncorporada");

        let nuevaNotificacion = document.createElement("div");
        let contenidoNotificacion = document.createElement("p");
        contenidoNotificacion.innerText = `${contenido}`;
        contenidoNotificacion.setAttribute("class", "contenidoNotificacion");
        let tiempoNotificacion = document.createElement("p");
        tiempoNotificacion.innerText = `${horasContador}${minutosContador}${segundosContador}`;

        //amadimos imagen para que aparezca en la notificacion
        let imagenNotificacion = document.createElement("img");

        //añadimos al cenntro de notificaciones, de forma que el mas actual se añada al principio
        if (primerElementoCentroNotificacion == null) {
            centroNotificacion.appendChild(nuevaNotificacion);
        } else {
            centroNotificacion.insertBefore(nuevaNotificacion, primerElementoCentroNotificacion);
        }

        if (tipo == 1) {
            nuevaNotificacion.setAttribute("class", "nuevaNotificacion notificacionIncorporada");
            imagenNotificacion.setAttribute("src", "img/iconos/rickElsimple.png")
        } else {
            nuevaNotificacion.setAttribute("class", "nuevaNotificacionError notificacionIncorporada");
            imagenNotificacion.setAttribute("src", "img/iconos/summerError.png")
        }

        nuevaNotificacion.appendChild(imagenNotificacion);
        nuevaNotificacion.appendChild(contenidoNotificacion);
        nuevaNotificacion.appendChild(tiempoNotificacion);

        if (!notificacionesMostradas) {
            numeroDeNotificaciones++;
            document.getElementById("marcadorNotificaciones").innerText = `${numeroDeNotificaciones}`;
        }


    }


    //funcion para crear el centro de recursos del juego en el que contendremos la cantidad de recursos
    const crearCentroRecursos = () => {
        //aqui añadiremos imagen
        //recorrecmos con un array para generar los div de recursos de forma automatica
        let valorRecursos = [monedas, piedra, madera, trabajadores, rickinillo, cuero, caballos, barquillo];
        for (let i = 0; i < tipoRecursos.length; i++) {
            let nuevoDiv = document.createElement("div");
            nuevoDiv.setAttribute("class", "itemRecurso");
            let imagen = document.createElement("img");
            let nuevoPvalor = document.createElement("p");
            imagen.setAttribute("src", `${tipoRecursos[i]}`);
            nuevoPvalor.innerText = `${valorRecursos[i]} `;
            nuevoDiv.appendChild(imagen);
            nuevoDiv.appendChild(nuevoPvalor);
            recursos.appendChild(nuevoDiv);
        }
        recursos.style.animationName = "aparicionRecursos";
        efectoRecursos();
    }

    //funcion con la que actualizamos el centro de recursos
    const actualizarRecursos = () => {
        let valoresRecursosActuales = document.querySelectorAll("#recursos p:nth-last-of-type(1)");
        let valorRecursos = [monedas, piedra, madera, trabajadores, rickinillo, cuero, caballos, barquillo];
        for (let i = 0; i < valorRecursos.length; i++) {
            valoresRecursosActuales[i].innerText = valorRecursos[i];

        }
    }

    // Funcion que usamos para poner descripcion a los botones del panel de edifcios y mercado una vez se han creado
    const generarContenedorPaneles = (padre, id, texto, fuenteImagen) => {
        let panel = document.getElementById(`${padre}`);
        let botonContenido = document.getElementById(`${id}`);

        let contenedorEdificio = document.createElement("div");
        //asignamos una clase para a cada contenedor para poder dar estilo desde css
        contenedorEdificio.setAttribute("id", `contenedor${id}`);
        let parrafoValor = document.createElement("p");
        parrafoValor.innerText = texto;

        contenedorEdificio.appendChild(botonContenido);
        contenedorEdificio.appendChild(parrafoValor);

        let divConImagen = document.createElement("div");
        let imagenEdificio = document.createElement("img");
        imagenEdificio.setAttribute("src", `${fuenteImagen}`);
        imagenEdificio.style.filter = "blur(5px)";

        let imgCandado = document.createElement("img");
        imgCandado.setAttribute("id", `imagenCandado${id}`);
        imgCandado.setAttribute("src", `img/iconos/closedPadlock.png`);


        divConImagen.setAttribute("id", `divConImagen${id}`)
        divConImagen.setAttribute("class", "divConImagen")

        divConImagen.appendChild(imagenEdificio);
        divConImagen.appendChild(contenedorEdificio);
        divConImagen.appendChild(imgCandado);

        let mercado = document.getElementById("divConImagenmercado");

        if (mercado != null && padre != "divPrincipalpanelMercado") {
            panel.insertBefore(divConImagen, mercado)
        } else {
            panel.appendChild(divConImagen)
        }
    }
    //funciones principales del juego en la que se generan los botones y se les va asignando eventos conforme avanzamos en el juego
    const generarAlmacen = () => {
        generarBotonEnPanelSecundario("almacen", "Almacen", "divPrincipalpanelEdificio", () => {
            document.querySelector("#imagenCandadoalmacen").setAttribute("src", "img/iconos/Edificios/Recurso/inventory.png");
            document.getElementById("divConImagenalmacen").style.filter = "grayscale(0%)";
            document.querySelector("#divConImagenalmacen img").style.filter = "blur(0px)";
            document.querySelector("#contenedoralmacen p").innerText = `Habilitado`;
            document.querySelector("#contenedoralmacen button").disabled = true;
            // document.getElementById("divConImagenalmacen").style.display = "none";
            monedas -= precioAlmacen;
            mostrarNotificacion(`Has comprado un almacen, ahora podras ver los recursos que tienes acumulados.`, 1);
            mostrarNotificacion("Puedes habilitar tres nuevos edificios: \nFabrica de Meeseeks \nGranaja de Rickinillos \nMercado de recursos.", 1);
            mostrarNotificacion("Se ha habilitado el boton recoger, podras recoger madera y piedra plutoniana.", 1);
            mostrarNotificacion("Recuerda que cuanto mas Meeseeks tengas, menor tiempo tardaras en recolectar.", 1);
            mostrarNotificacion("Se me olvidaba, se ha habilitado un boton para guardar partida dentro del menú!!!", 1);
            efectoConstruir();
            habilitarGuardado();
            crearCentroRecursos();
            generarRecoger();
            //generamos cabaña Granja y mercado
            aparicionBotones("divConImagenalmacen");
            generarCabaña();
            generarGranja();
            generarMercado();
            //clicamos para que se vaya a la zona principal al generar las cosas
            document.getElementById("atraspanelEdificio").click();
            existeCentroRecursos = true;

        });
        generarContenedorPaneles("divPrincipalpanelEdificio", "almacen", `${precioAlmacen} schmeckles`, imagenesEdificios[0]);
        document.getElementById("divConImagenalmacen").style.filter = "grayscale(100%)";
    }

    const generarAlquimia = () => {
        generarBotonEnPanelPrincipal("alquimia", "Alquimia");
        document.getElementById("alquimia").addEventListener("click", function () {
            efectoMenu();
            //desabilitamos el boton para que no se pueda pulsar mientras se genera
            this.disabled = true;
            document.getElementById("alquimia").innerText = "Creando...";
            let tiempoCreacion = 0.25;
            if (monedas > 0) tiempoCreacion *= monedas;
            setTimeout(() => {
                monedas++;
                efectoMonedas();
                document.getElementById("alquimia").innerText = "Alquimia";
                this.disabled = false;
                //si el centro de recursos se ha habilitado entonces tendremos que actualizarlo

                if (existeCentroRecursos) actualizarRecursos();
                mostrarNotificacion(`Has creado un schmeckle`, 1);

                if (monedas >= 2 && primeraAdquisicionEdificios) {
                    primeraAdquisicionEdificios = false;
                    mostrarNotificacion(`Has desbloqueado el botón de edificios, ya puedes comenzar a construir`, 1);
                    efectoNotificacion(1);
                    generarEdificio(1);
                    // primeraAdquisicionEdificios = false;
                }
            }, tiempoCreacion * 1000);
        });
    }

    const generarRecoger = () => {
        generarBotonEnPanelPrincipal("recoger", "Recoger");
        document.getElementById("recoger").addEventListener("click", function () {
            let maderaAleatoria = Math.floor(Math.random() * (trabajadores + 2));
            let piedraAleatoria = Math.floor(Math.random() * (trabajadores + 2));

            madera += maderaAleatoria;
            piedra += piedraAleatoria;

            mostrarNotificacion(`Has recogido ${piedraAleatoria} de piedra y ${maderaAleatoria} de madera `, 1);
            recoger();
            actualizarRecursos();
            this.disabled = true;
            // document.getElementById("recoger").innerText = "Descanso";
            let tiempoRecoger = 45 - trabajadores;
            if (tiempoRecoger < 1) tiempoRecoger = 0.5;

            setTimeout(() => {
                this.disabled = false;
                document.getElementById("recoger").innerText = "Recoger";
            }, tiempoRecoger * 1000);

            let cuentaAtras = tiempoRecoger;
            if (cuentaAtras >= 1) {
                document.getElementById("recoger").innerText = `Descanso ${cuentaAtras}s`;
            }
            let intervaloTiempoDescanso = setInterval(() => {
                cuentaAtras -= 1;
                if (cuentaAtras <= 0) {
                    clearInterval(intervaloTiempoDescanso);
                    document.getElementById("recoger").innerText = "Recoger";
                } else {
                    document.getElementById("recoger").innerText = `Descanso ${cuentaAtras}s`;
                }
            }, 1000);
        });
    }

    //si llamamos a generar edificio con el numero 0 ira vacio
    const generarEdificio = (tipo) => {
        generarBotonEnPanelPrincipal("edificios", "Edificios");
        generarDivPanel("panelEdificio", "Edificios");
        document.getElementById("edificios").addEventListener("click", function () {
            document.getElementById("panelEdificio").style.animationName = "aparicionPantalla";
            document.getElementById("panelEdificio").style.visibility = "visible";
            document.getElementById("panelEdificio").style.display = "flex";
            // modificarOpacidadHijos("panelEdificio", 1);
            efectoMenu();
            aparicionBotones("panelEdificio");
        })
        //en funcion del tipo generamos con almacen o sin almace
        if (tipo != 0) {
            generarAlmacen();
        }
        document.getElementById("panelEdificio").style.display = "none";
    }

    const generarCabaña = () => {
        generarBotonEnPanelSecundario("cabaña", "Cabaña", "divPrincipalpanelEdificio", () => {
            if (monedas >= precioCabaña && piedra >= precioCabaña) {
                trabajadores += 5;
                monedas -= precioCabaña;
                piedra -= precioCabaña;
                precioCabaña += 5;
                mostrarNotificacion("Has comprado una nueva cabaña de Meeseeks, tienes 5 Meeseeks mas a tu disposición", 1);
                efectoMeeseks();
                efectoConstruir();
                actualizarRecursos();
                //actualizamos los valores de precio en cabaña
                document.querySelector("#contenedorcabaña p").innerText = `${precioCabaña} schmeckles \n ${precioCabaña} piedras`;
            } else {
                mostrarNotificacion("No tienes recursos para comprar una nueva cabaña de Meeseeks", 2);
                efectoNotificacion(0);
            }

        })
        generarContenedorPaneles("divPrincipalpanelEdificio", "cabaña", `${precioCabaña} schmeckles \n ${precioCabaña} piedras`, imagenesEdificios[3]);
        document.querySelector("#imagenCandadocabaña").setAttribute("src", "img/iconos/Edificios/Recurso/meeseeks.png");
        document.querySelector("#divConImagencabaña img").style.filter = "blur(0px)";
    }

    const generarGranja = () => {
        generarBotonEnPanelSecundario("granja", "Granja", "divPrincipalpanelEdificio", () => {
            if (monedas >= monedasGranja && piedra >= piedrasGranja && madera >= maderaGranja) {
                //cuidado porque no se cierra nunca
                document.querySelector("#contenedorgranja button").disabled = true;
                document.querySelector("#contenedorgranja p").innerText = `Habilitado`;
                // document.querySelector("#imagenCandadogranja").style.visibility = "hidden";
                document.querySelector("#imagenCandadogranja").setAttribute("src", "img/iconos/Edificios/Recurso/pickle.png");
                monedas -= monedasGranja;
                piedra -= piedrasGranja;
                madera -= maderaGranja;
                actualizarRecursos();
                efectoConstruir();
                intervaloRickinillo = setInterval(() => {
                    rickinillo++;
                    actualizarRecursos();
                    mostrarNotificacion("Rickinillo generado", 1);
                }, 20000);

                partesDesbloqueadas[2] = 0;
                mostrarNotificacion("Has comprado la granja de Rickinillos,cada 20 segundos criaras un Rickinillo", 1);
                mostrarNotificacion("Se han habilitado los establos de Mortys", 1);
                efectoRickinillo();
                document.getElementById("divConImagengranja").style.filter = "grayscale(0%)";
                document.querySelector("#divConImagengranja img").style.filter = "blur(0px)";
                // document.getElementById("divConImagengranja").style.display = "none";
                generarEstablos();
                aparicionBotones("divConImagengranja");
                aparicionBotones("divConImagenestablos");
                actualizarRecursos();
                //ocultamos el boton granja
            } else {
                mostrarNotificacion("No tienes recursos suficientes para comprar la granja de Rickinillos", 2);
                efectoNotificacion(0);
            }
        })
        generarContenedorPaneles("divPrincipalpanelEdificio", "granja", `${monedasGranja} schmeckles \n ${piedrasGranja} piedras \n ${maderaGranja} maderas`, imagenesEdificios[1]);
        document.getElementById("divConImagengranja").style.filter = "grayscale(100%)";
    }

    const estadoInicialRecursosMercado = () => {
        document.querySelector("#divConImagenpiedra img").style.filter = "blur(0px)";
        document.querySelector("#divConImagenmadera img").style.filter = "blur(0px)";
        document.querySelector("#divConImagencuero img").style.filter = "blur(0px)";
        document.querySelector("#divConImagenbarquillo img").style.filter = "blur(0px)";
    }

    const generarBotonesCompra = (recurso) => {
        let imagenEliminar = document.querySelector(`#imagenCandado${recurso}`);
        let padre = imagenEliminar.parentNode;
        padre.removeChild(imagenEliminar);

        let contenedorRecurso = document.querySelector(`#divConImagen${recurso}`);
        //contenedor de botones
        let contenedorBotonesCompra = document.createElement("div");
        contenedorBotonesCompra.setAttribute("class", "contenedorBotonesCompra");

        //botones del marcador de compra y marcador

        let valorActualMarcador = 0;

        let botonMas = document.createElement("button");
        botonMas.innerText = '+';
        botonMas.setAttribute("class", "botonCompra");

        let valor = document.createElement("p");
        valor.setAttribute("class", "marcadorCompra");

        let botonMenos = document.createElement("button");
        botonMenos.innerText = '-';
        botonMenos.setAttribute("class", "botonCompra");

        botonMas.addEventListener("click", () => {
            efectoMenu();
            valorActualMarcador++;
            valor.innerText = valorActualMarcador;
        });

        botonMenos.addEventListener("click", () => {
            efectoMenu();
            if (valorActualMarcador >= 1) {
                valorActualMarcador--;
                valor.innerText = valorActualMarcador;
            }
        });

        valor.innerText = valorActualMarcador;

        contenedorBotonesCompra.appendChild(botonMas);
        contenedorBotonesCompra.appendChild(valor);
        contenedorBotonesCompra.appendChild(botonMenos);

        contenedorRecurso.appendChild(contenedorBotonesCompra);
    }


    const generarMercado = () => {
        generarBotonEnPanelSecundario("mercado", "Mercado", "divPrincipalpanelEdificio", () => {
            efectoMenu();
            if (piedra >= piedrasMercado && madera >= maderaMercado && primeraCreacionMercado) {
                document.getElementById("divConImagenmercado").style.filter = "grayscale(0%)";
                document.querySelector("#divConImagenmercado img").style.filter = "blur(0px)";
                document.querySelector("#imagenCandadomercado").setAttribute("src", "img/iconos/Edificios/Recurso/todosMercado.png");
                primeraCreacionMercado = false;
                efectoConstruir();
                document.querySelector("#contenedormercado p").innerText = `Habilitado`;
                mostrarNotificacion("Has habilitado el mercado, ahora podras comprar ciertos recursos", 1);
                efectoNotificacion(1);
                partesDesbloqueadas[3] = 0;
                piedra -= piedrasMercado;
                madera -= maderaMercado;
                actualizarRecursos();
                generarDivPanel("panelMercado", "Mercado");
                document.getElementById("panelMercado").style.animationName = "aparicionPantalla";
                document.getElementById("panelMercado").style.visibility = "visible";
                document.getElementById("panelMercado").style.display = "flex";
                // document.getElementById("panelMercado").style.visibility = "visible";

                //PODEMOS SACAR EN OTRA FUNCION PARA GENERAR LOS BOTONES EN ELLA
                generarBotonEnPanelSecundario("cuero", "Cuero", "divPrincipalpanelMercado", () => {
                    let seleccionUsuario = parseInt(document.querySelector("#divConImagencuero .marcadorCompra").innerText);

                    if (seleccionUsuario > 0 && monedas >= precioCueroMercado * seleccionUsuario) {
                        monedas -= precioCueroMercado * seleccionUsuario;
                        cuero += seleccionUsuario;
                        mostrarNotificacion(`Has comprado ${seleccionUsuario} de Cuero`, 1);
                        efectoCajaRegistradora();
                        document.querySelector("#divConImagencuero .marcadorCompra").innerText = 0;
                        actualizarRecursos();
                    } else if (seleccionUsuario <= 0) {
                        mostrarNotificacion(`Selecciona una cantidad de Cuero mayor que 0`, 2);
                        efectoNotificacion(0);
                    } else {
                        mostrarNotificacion(`No tienes schmeckles suficientes para comprar Cuero`, 2);
                        document.querySelector("#divConImagencuero .marcadorCompra").innerText = 0;
                        efectoNotificacion(0);
                    }
                });

                //genero divs contendores de los botones para poner los precios y mostrar en pantalla
                generarContenedorPaneles("divPrincipalpanelMercado", "cuero", `${precioCueroMercado} schmeckles`, imagenesMercado[0]);
                generarBotonesCompra("cuero");

                generarBotonEnPanelSecundario("piedra", "Piedra", "divPrincipalpanelMercado", () => {
                    let seleccionUsuario = parseInt(document.querySelector("#divConImagenpiedra .marcadorCompra").innerText);

                    if (seleccionUsuario > 0 && monedas >= precioPiedraMercado * seleccionUsuario) {
                        monedas -= (precioCueroMercado * seleccionUsuario);
                        piedra += seleccionUsuario;
                        mostrarNotificacion(`Has comprado ${seleccionUsuario} de Piedra Plutoniana`, 1);
                        efectoCajaRegistradora();
                        document.querySelector("#divConImagenpiedra .marcadorCompra").innerText = 0;
                        actualizarRecursos();
                    } else if (seleccionUsuario <= 0) {
                        mostrarNotificacion(`Selecciona una cantidad de Piedra Plutoniana mayor que 0`, 2);
                        efectoNotificacion(0);
                    } else {
                        mostrarNotificacion(`No tienes schmeckles suficientes para comprar Piedra Plutoniana`, 2);
                        document.querySelector("#divConImagenpiedra .marcadorCompra").innerText = 0;
                        efectoNotificacion(0);
                    }
                });
                generarContenedorPaneles("divPrincipalpanelMercado", "piedra", `${precioPiedraMercado} schmeckles`, imagenesMercado[2]);
                generarBotonesCompra("piedra");

                generarBotonEnPanelSecundario("madera", "Madera", "divPrincipalpanelMercado", () => {

                    let seleccionUsuario = parseInt(document.querySelector("#divConImagenmadera .marcadorCompra").innerText);

                    if (seleccionUsuario > 0 && monedas >= percioMaderaMercado * seleccionUsuario) {
                        monedas -= percioMaderaMercado * seleccionUsuario;
                        madera += seleccionUsuario;
                        mostrarNotificacion(`Has comprado ${seleccionUsuario} de Madera`, 1);
                        efectoCajaRegistradora();
                        document.querySelector("#divConImagenmadera .marcadorCompra").innerText = 0;
                        actualizarRecursos();
                    } else if (seleccionUsuario <= 0) {
                        mostrarNotificacion(`Selecciona una cantidad de Madera mayor que 0`, 2);
                        efectoNotificacion(0);
                    } else {
                        mostrarNotificacion(`No tienes schmeckles suficientes para comprar Madera`, 2);
                        document.querySelector("#divConImagenmadera .marcadorCompra").innerText = 0;
                        efectoNotificacion(0);
                    }
                });
                generarContenedorPaneles("divPrincipalpanelMercado", "madera", `${percioMaderaMercado} schmeckles`, imagenesMercado[1]);
                generarBotonesCompra("madera");
                //habilito el boton de comprar pan en el mercado

                generarBotonEnPanelSecundario("barquillo", "Barquillo", "divPrincipalpanelMercado", () => {

                    if (primeraFabrica) {
                        efectoNotificacion(0);
                        mostrarNotificacion("No puedes comprar barquillo hasta que habilites la fabrica", 2);
                    }
                    else {
                        let seleccionUsuario = parseInt(document.querySelector("#divConImagenbarquillo .marcadorCompra").innerText);

                        if (seleccionUsuario > 0 && monedas >= preciobarquilloMercado * seleccionUsuario) {
                            monedas -= precioCueroMercado * seleccionUsuario;
                            preciobarquilloMercado += seleccionUsuario;
                            mostrarNotificacion(`Has comprado ${seleccionUsuario} de Barquillo`, 1);
                            efectoCajaRegistradora();
                            document.querySelector("#divConImagenbarquillo .marcadorCompra").innerText = 0;
                            actualizarRecursos();
                        } else if (seleccionUsuario <= 0) {
                            mostrarNotificacion(`Selecciona una cantidad de Barquillo mayor que 0`, 2);
                            efectoNotificacion(0);
                        } else {
                            mostrarNotificacion(`No tienes schmeckles suficientes para comprar Barquillo`, 2);
                            document.querySelector("#divConImagenbarquillo .marcadorCompra").innerText = 0;
                            efectoNotificacion(0);
                        }

                    }
                });
                generarContenedorPaneles("divPrincipalpanelMercado", "barquillo", `${preciobarquilloMercado} schmeckles`, imagenesMercado[3]);
                generarBotonesCompra("barquillo");
                document.getElementById("divConImagenbarquillo").style.display = "none";
                //comprobamos al crear el mercado si se ha creado la fabrica para mostrar el barquillo
                estadoInicialRecursosMercado();

                if (!primeraFabrica) {
                    document.getElementById("divConImagenbarquillo").style.display = "flex";
                }
                aparicionBotones("panelMercado");
            } else if (!primeraCreacionMercado) {
                document.getElementById("panelMercado").style.animationName = "aparicionPantalla";
                document.getElementById("panelMercado").style.visibility = "visible";
                aparicionBotones("panelMercado");
                document.getElementById("panelMercado").style.display = "flex";

                //comprobamos cada vez que nos metemos si se ha creado la fabrica para mostrar el barquillo
                if (!primeraFabrica) {
                    document.getElementById("divConImagenbarquillo").style.display = "flex";
                }
            } else {
                mostrarNotificacion(`No tienes recursos para habilitar el mercado`, 2);
                efectoNotificacion(0);
            }
        }

        );
        generarContenedorPaneles("divPrincipalpanelEdificio", "mercado", `${piedrasMercado} piedras \n ${maderaMercado} maderas`, imagenesEdificios[2]);
        document.getElementById("divConImagenmercado").style.filter = "grayscale(100%)";
    }

    const generarEstablos = () => {
        generarBotonEnPanelSecundario("establos", "Establos", "divPrincipalpanelEdificio", () => {

            if (primerEstablo && monedas >= monedasEstablos && madera >= maderaEstablos && rickinillo >= trigoEstablos) {
                document.getElementById("divConImagenestablos").style.filter = "grayscale(0%)";
                document.querySelector("#divConImagenestablos img").style.filter = "blur(0px)";
                // document.querySelector("#imagenCandadoestablos").style.visibility = "hidden";
                document.querySelector("#imagenCandadoestablos").setAttribute("src", "img/iconos/Edificios/Recurso/morti.png");

                primerEstablo = false;
                efectoConstruir();
                efectoMorty();
                monedas -= monedasEstablos;
                madera -= maderaEstablos;
                rickinillo -= trigoEstablos;
                actualizarRecursos();
                mostrarNotificacion("Has comprado los establos de Mortys, puedes criar Mortys salvajes por 2 de cuero y 5 Rickinillos", 1);
                partesDesbloqueadas[4] = 0;
                document.querySelector("#contenedorestablos p").innerText = `${cueroCaballo} cuero \n ${trigoCaballo} Rickinillos`;
                mostrarNotificacion("Se ha habilitado la fabrica de barquillos de Rick el sencillo", 1);
                generarFabrica();
                aparicionBotones("divConImagenestablos");
                aparicionBotones("divConImagenfabrica");
            } else if (!primerEstablo) {

                if (cuero >= cueroCaballo && rickinillo >= trigoCaballo) {
                    caballos++;
                    mostrarNotificacion("Acabas de criar un pequeño Morty, es precioso!!!", 1);
                    efectoMorty();
                    actualizarRecursos();
                } else {
                    mostrarNotificacion("No tienes recursos suficientes para criar un pequeño Morty", 2);
                    efectoNotificacion(0);
                }
            } else {
                mostrarNotificacion("No tienes recursos para habilitar los establos de Mortys", 2);
                efectoNotificacion(0);
            }
        });

        generarContenedorPaneles("divPrincipalpanelEdificio", "establos", `${monedasEstablos} schmeckles \n ${maderaEstablos} maderas \n ${trigoEstablos} rickinillos`, imagenesEdificios[4]);
        document.getElementById("divConImagenestablos").style.filter = "grayscale(100%)";
    }

    const generarFabrica = () => {
        generarBotonEnPanelSecundario("fabrica", "Fabrica", "divPrincipalpanelEdificio", () => {
            if (primeraFabrica && monedas >= monedasFabrica && piedra >= piedrasFabrica && caballos >= caballosFabrica) {
                document.getElementById("divConImagenfabrica").style.filter = "grayscale(0%)";
                document.querySelector("#divConImagenfabrica img").style.filter = "blur(0px)";
                // document.querySelector("#imagenCandadofabrica").style.visibility = "hidden";
                document.querySelector("#imagenCandadofabrica").setAttribute("src", "img/iconos/Edificios/Recurso/barquillo.png");

                primeraFabrica = false;
                efectoConstruir();
                monedas -= monedasFabrica;
                piedra -= piedrasFabrica;
                caballos -= caballosFabrica;
                actualizarRecursos();
                mostrarNotificacion("Has comprado la fabrica de barquillos de Rick el sencillo", 1);
                partesDesbloqueadas[5] = 0;
                mostrarNotificacion("Puedes transformar la esencia de 2 Rickinillos en barquillo, y ahora puedes comprar barquillo en el mercado", 1);
                document.querySelector("#contenedorfabrica p").innerText = `${cantidadTrigoPan} Rickinillos`;
                mostrarNotificacion("Estas a un paso de construir la ciudadela de Ricks y terminar la historia...", 1);
                generarCiudadela();
                aparicionBotones("divConImagenfabrica");
                aparicionBotones("divConImagenciudadela");
                mostrarNotificacion("Se ha habilitado la compra de barquillos en el mercado", 1);
                simpleRick();
            } else if (!primeraFabrica) {
                if (rickinillo >= cantidadTrigoPan) {
                    rickinillo -= cantidadTrigoPan;
                    barquillo++;
                    mostrarNotificacion("Has creado 1 barquillo", 1);
                    simpleRick();
                    actualizarRecursos();
                } else {
                    mostrarNotificacion("No tienes suficientes Rickinillos para hacer barquillo", 4, 2);
                    efectoNotificacion(0);
                }
            } else {
                mostrarNotificacion("No tienes suficientes recursos para crear la fabrica de barquillos", 4, 2);
                efectoNotificacion(0);
            }

        });
        generarContenedorPaneles("divPrincipalpanelEdificio", "fabrica", `${monedasFabrica} schmeckles \n ${piedrasFabrica} piedras \n ${caballosFabrica} Mortys`, imagenesEdificios[5]);
        document.getElementById("divConImagenfabrica").style.filter = "grayscale(100%)";
    }



    const generarCiudadela = () => {
        generarBotonEnPanelSecundario("ciudadela", "Ciudadela", "divPrincipalpanelEdificio", () => {
            if (primeraTaberna && monedas >= monedasCiudadela && madera >= maderasCiudadela && piedra >= piedrasCiudadela && caballos >= caballosCiudadela && barquillo >= panCiudadela) {
                document.getElementById("divConImagenciudadela").style.filter = "grayscale(0%)";
                document.querySelector("#divConImagenciudadela img").style.filter = "blur(0px)";
                // document.querySelector("#imagenCandadociudadela").style.visibility = "hidden";
                document.querySelector("#imagenCandadociudadela").setAttribute("src", "img/iconos/Edificios/Recurso/ciudadela.png");
                primeraTaberna = false;
                efectoConstruir();
                monedas -= monedasCiudadela;
                madera -= maderasCiudadela;
                piedra -= piedrasCiudadela;
                caballos -= caballosCiudadela;
                barquillo -= panCiudadela;
                actualizarRecursos();
                aparicionBotones("divConImagenciudadela");
                //salir del juego
                mostrarNotificacion("Enhorabuena ya has creado la ciudadela de Ricks, y has completado el juego.", 1);
                victoriaFinal();
                setTimeout(() => {
                    document.getElementById("panelEdificio").style.animation = "desaparicionBody 0.2s 1 normal forwards";
                    document.getElementById("panelMercado").style.animation = "desaparicionBody 0.2s 1 normal forwards";
                    document.getElementById("contenedor").style.animation = "desaparicionBody 1.5s 1 normal forwards";
                }, 2000);
                clearInterval(intervaloRickinillo);
                setTimeout(() => {
                    deshabilitarJuego();
                    ultimoDialogo();
                }, 3500);
            } else {
                mostrarNotificacion("No tienes recursos para habilitar la ciudadela de Ricks", 4, 2);
                efectoNotificacion(0);
            }
        });

        generarContenedorPaneles("divPrincipalpanelEdificio", "ciudadela", `${monedasCiudadela} schmeckles \n ${panCiudadela} barquillos \n ${piedrasCiudadela} piedras \n ${caballosCiudadela} Mortys`, imagenesEdificios[6]);
        document.getElementById("divConImagenciudadela").style.filter = "grayscale(100%)";
    }


    //Funcion para mostrar botones aplicandoles una animacion
    const aparicionBotones = (id) => {
        let panel = document.getElementById(`${id}`);
        let hijos = panel.childNodes;
        for (let i = 0; i < hijos.length; i++) {
            hijos[i].style.animationName = "mostrarBoton";

        }
    }

    //Funcion para deshabilitar elementos del HTML
    const deshabilitarJuego = () => {
        document.getElementById("contenedor").style.display = "none";
        document.getElementById("notificacion").style.display = "none";
        if (document.getElementById("panelEdificio") != null && document.getElementById("panelMercado") != null) {
            document.getElementById("panelEdificio").style.display = "none";
            document.getElementById("panelMercado").style.display = "none";
        }
    }
    //Funcion para habilitar elementos del HTML
    const habilitarJuego = () => {
        document.getElementById("contenedor").style.display = "flex";
        document.getElementById("notificacion").style.display = "flex";
        document.getElementById("contenedor").style.opacity = "0";
    }

    //funcion donde deshabilitamos partes del html para poder ver el primer tutorial de forma correcta
    function tutorial() {
        deshabilitarJuego();
        primerTutorial()
    }

    //funcion con la que se da comienzo al juego una vez termina el tutorial o se pulsa jugar de nuevo
    function comenzarJuego() {
        document.querySelectorAll("#cabecera img")[0].style.visibility = "visible";
        document.querySelectorAll("#cabecera img")[1].style.visibility = "visible";
        document.getElementById("contenedor").style.animation = "aparicionBody 1.5s 1 normal forwards";
        crearBotonCentroNotificaciones();
        generarAlquimia();
    }

    //funcion para generar el primer cuadro de dialogo al comienzo del juego
    const primerTutorial = () => {
        let contadorDialogo = 0;
        let dialogosRick = [`He creado este simple juego para que personas con un CI tan bajo como el tuyo puedan aprender como se creó la ciudadela de Ricks.`,
            `El juego es secillo, pulsaras botoncitos que crearan cosas, hasta un Morty lo entenderia.`,
            `Comenzaras el juego creando schmeckles, que por si no lo sabes es el dinero que se usa en la ciudadela de Ricks.`,
            `Cuando crees dos shemekles, se habilitara el boton edificios, el cual abre un panel donde podras ir construyendo edificios.`
            , `Como es logico construir los edificios te aportara distintos recursos y posibilidades.`,
            `Dentro de edificios he incorporado un mercado en el podras comprar recursos de forma rapida para que puedas... en fin hacer mas cosas.`,
            `En la esquina superior izquierda veras un boton con el que podras desplegar el panel de notificaciones, el cual sera visible al terminar el tutorial.`,
            `Dentro del panel de notificaciones, dejare una IA activada que registrara todo los que haces en cada momento y te dara informacion sobre el juego.`,
            `Cada vez que haya un sonido el juego te notificara algo, y podras ver el numero de notificaciones en el boton del panel.`,
            `En la esquina superior derecha veras un boton con el que podras desplegar un menú.`,
            `Dentro del menú tendras controles para poner musica y un botón de guardar partida, que se habilitara al crear el almacen.`,
            `Espero que no envejezcas intentando pasarte este bodrio, me voy a trabajar en cosas utiles, suerte y paz entre los mundos.`,];

        let cuadroTutorial = document.createElement("div");
        cuadroTutorial.setAttribute("class", "cuadroTutorial");
        let imagenRick = document.createElement("img")
        let dialogo = document.createElement("p");
        dialogo.setAttribute("id", "dialogo");

        dialogo.innerText = `Hola humano, soy Rick Sanchez, el cientifico mas inteligente todo el multiverso. `;

        cuadroTutorial.addEventListener("click", () => {
            dialogo.innerText = dialogosRick[contadorDialogo];
            contadorDialogo++;
            if (contadorDialogo > dialogosRick.length) {
                document.body.removeChild(cuadroTutorial);
                habilitarJuego();
                comenzarJuego();
                contadorDeTiempo();
            }
        });
        imagenRick.setAttribute("src", "img/iconos/iconoRick.png");

        cuadroTutorial.appendChild(imagenRick);
        cuadroTutorial.appendChild(dialogo);
        document.body.appendChild(cuadroTutorial);
        cuadroTutorial.style.animation = "aparicionTutorial 1.5s 1 normal forwards"

    }
    //funcion para resetear el panel principal donde estan los botones, alquimia edificio y recoger
    const resetearPanelPrincipal = (panel) => {
        let panelPrincipal = document.getElementById(`${panel}`);
        while (panelPrincipal.firstChild) {
            panelPrincipal.removeChild(panelPrincipal.firstChild);
        }
    }
    //funcion para resetear las variables globales del juego y los paneles sevundarios
    const resetearVariablesPanelesSecundarios = () => {
        partesDesbloqueadas = [0, 0, -1, -1, -1, -1];
        precioCabaña = 6;
        monedas = 0;
        piedra = 0;
        madera = 0;
        trabajadores = 0;
        rickinillo = 0;
        cuero = 0;
        caballos = 0;
        barquillo = 0;
        existeCentroRecursos = false;
        primeraAdquisicionEdificios = true;
        primeraCreacionAlmacen = true;
        primeraCreacionMercado = true;
        primerEstablo = true;
        primeraFabrica = true;
        primeraTaberna = true;
        //reseteamos el panel principal, paneles secundarios y los recursos
        resetearPanelPrincipal("panelPrincipal");
        document.getElementById("recursos").style.animationName = "";
        resetearPanelPrincipal("recursos");
        //elimiminamos el dialogo
        document.body.removeChild(document.getElementById("panelEdificio"));
        document.body.removeChild(document.getElementById("panelMercado"));
    }

    //funcion para generar el primer cuadro de dialogo al comienzo del juego
    const ultimoDialogo = () => {
        clearInterval(intervaloTiempo);
        let contadorDialogo = 0;
        let dialogosRick = [
            `Puedes volver a jugar o ir menú principal, tu eliges`];
        let cuadroUltimoDialogo = document.createElement("div");
        cuadroUltimoDialogo.setAttribute("class", "cuadroUltimoDialogo");

        let imagenRick = document.createElement("img")
        let dialogo = document.createElement("p");
        dialogo.innerText = `Parece que has completado el juego, creia que tardarias años, la verdad es que no esperaba mucho de un humano común.`;

        let botonMenu = document.createElement("button");
        botonMenu.setAttribute("class", "botonFinal");
        botonMenu.innerText = "Menú principal";

        botonMenu.addEventListener("click", () => {
            deshabilitarBotonCentroNotificaciones();
            deshabilitarGuardado();
            document.body.removeChild(document.querySelector(".contador"));
            document.body.removeChild(cuadroUltimoDialogo);
            resetearVariablesPanelesSecundarios();
            habilitarJuego();
            menuPrincipal();
            efectoMenu();
        });

        let botonJugar = document.createElement("button");
        botonJugar.setAttribute("class", "botonFinal");

        botonJugar.innerText = "Empezar juego";

        botonJugar.addEventListener("click", () => {
            deshabilitarBotonCentroNotificaciones();
            deshabilitarGuardado()
            document.body.removeChild(document.querySelector(".contador"));
            resetearVariablesPanelesSecundarios();
            document.body.removeChild(cuadroUltimoDialogo);
            habilitarJuego();
            comenzarJuego();
            contadorDeTiempo();
            efectoMenu();
        });

        dialogo.addEventListener("click", () => {
            dialogo.innerText = dialogosRick[contadorDialogo];
            contadorDialogo++;
            if (contadorDialogo > dialogosRick.length) {
                dialogo.innerText = "";
                dialogo.appendChild(botonMenu);
                dialogo.appendChild(botonJugar);

            }
        });
        imagenRick.setAttribute("src", "img/iconos/iconoRick.png");
        cuadroUltimoDialogo.appendChild(imagenRick);
        cuadroUltimoDialogo.appendChild(dialogo);
        document.body.appendChild(cuadroUltimoDialogo);
        cuadroUltimoDialogo.style.animation = "aparicionTutorial 1.5s 1 normal forwards"
    }

    //funcion generadora del panel del control lateral 
    //donde se encuentra los controles de la musica, contador y funcion de guardado
    const panelControl = () => {
        let cancionActual = 0;
        let volumenActual = 0.2;
        let playList = ['audio/17_Tales_from_the_Citadel.mp3', 'audio/01_Rick_Morty_Theme.mp3', 'audio/04_The_Flu_Hatin_Rap.mp3', 'audio/02_Jerrys_Rick.mp3', 'audio/05_Goodbye_Moonmen.mp3', 'audio/06_Do_You_Feel_It.mp3', 'audio/07_Unity_Says_Goodbye.mp3', 'audio/08_Get_Schwifty.mp3', 'audio/09_Raised_Up.mp3', 'audio/10_Stab_Him_in_the_Throat.mp3', 'audio/11_Help_Me_Im_Gonna_Die.mp3', 'audio/12_Let_Me_Out.mp3', 'audio/13_Memories.mp3', 'audio/14_Alien_Jazz_Rap.mp3', 'audio/15_For_the_Damaged_Coda.mp3', 'audio/16_Seal_My_Fate.mp3'];
        // let sonido = new Audio(playList[cancionActual]);
        let sonido = document.createElement("audio");
        sonido.setAttribute("src", `${playList[cancionActual]}`);

        sonido.addEventListener("ended", () => {
            if (cancionActual < playList.length) {
                cancionActual++;
                sonido.setAttribute("src", `${playList[cancionActual]}`);
                console.log(playList[cancionActual]);
                sonido.play();
            } else {
                cancionActual = 0;
                sonido.setAttribute("src", `${playList[cancionActual]}`);
                sonido.play();
            }
            sonido.volume = volumenActual;
        });


        // let muted = false;
        let contenedorBotonesPanel = document.createElement("div");
        contenedorBotonesPanel.setAttribute("class", "contenedorBotonesPanel");

        let botonDisparadorMenu = document.createElement("button");
        botonDisparadorMenu.setAttribute("id", "disparadorMenu");


        let botonPlay = document.createElement("button");
        let botonPause = document.createElement("button");
        // let botonVolumenMenos = document.createElement("button");
        // let botonVolumenMas = document.createElement("button");
        // let botonMuted = document.createElement("button");


        let imagenMenu = document.createElement("img");

        let imagenSonidoPlay = document.createElement("img");
        let imagenSonidoPause = document.createElement("img");
        // let imagenSonidoVolumenMenos = document.createElement("img");
        // let imagenSonidoVolumenMas = document.createElement("img");
        // let imagenMuted = document.createElement("img");

        imagenMenu.src = "img/iconos/menu.png";

        imagenSonidoPlay.src = "img/iconos/play.png";
        imagenSonidoPause.src = "img/iconos/pause.png";
        // imagenSonidoVolumenMas.src = "img/iconos/mayorVolumen.png";
        // imagenSonidoVolumenMenos.src = "img/iconos/menosVolumen.png";
        // imagenMuted.src = "img/iconos/mute.png";

        botonDisparadorMenu.appendChild(imagenMenu);

        botonPlay.appendChild(imagenSonidoPlay);
        botonPause.appendChild(imagenSonidoPause);
        // botonVolumenMas.appendChild(imagenSonidoVolumenMas);
        // botonVolumenMenos.appendChild(imagenSonidoVolumenMenos);
        // botonMuted.appendChild(imagenMuted);

        //seleccionamos todos los botones y elementos que no sean el primero
        botonDisparadorMenu.addEventListener("click", () => {
            efectoMenu();
            let elementosAnimacion = document.querySelectorAll(".contenedorBotonesPanel button:not(:first-of-type)");
            if (!panelMostrado) {
                for (let i = 0; i < elementosAnimacion.length; i++) {
                    elementosAnimacion[i].disabled = false;
                    elementosAnimacion[i].style.animationName = "aparicionPanel";
                }
                panelMostrado = true;
            } else {
                for (let i = 0; i < elementosAnimacion.length; i++) {

                    //esperamos a que se oculte el panel para desabilitarlo
                    elementosAnimacion[i].disabled = true;
                    elementosAnimacion[i].style.animationName = "desaparicionPanel";
                }
                panelMostrado = false;
            }
        });

        botonPlay.addEventListener("click", () => {
            efectoMenu();
            sonido.volume = volumenActual;
            sonido.play()
        });

        botonPause.addEventListener("click", () => {
            efectoMenu();
            sonido.pause();
        });

        // botonVolumenMas.addEventListener("click", () => {
        //     if (volumenActual < 0.9) {
        //         volumenActual += 0.1;
        //         sonido.volume = volumenActual;
        //     }

        // });

        // botonVolumenMenos.addEventListener("click", () => {
        //     if (volumenActual > 0.1) {
        //         volumenActual -= 0.1;
        //         sonido.volume = volumenActual;
        //     }
        // });

        // botonMuted.addEventListener("click", () => {
        //     if (muted) {
        //         sonido.volume = volumenActual;
        //         muted = false;
        //     } else {
        //         sonido.volume = 0;
        //         muted = true;
        //     }
        // });

        contenedorBotonesPanel.appendChild(botonDisparadorMenu);
        contenedorBotonesPanel.appendChild(botonPlay);
        contenedorBotonesPanel.appendChild(botonPause);
        // contenedorBotonesPanel.appendChild(botonMuted);
        // contenedorBotonesPanel.appendChild(botonVolumenMas);
        // contenedorBotonesPanel.appendChild(botonVolumenMenos);

        //hacemos que el boton guardar este deshabilitado por defecto
        document.body.appendChild(contenedorBotonesPanel);

    }

    const crearBotonCentroNotificaciones = () => {
        let imagenTituloNotificacion = document.createElement("img");
        imagenTituloNotificacion.setAttribute("src", "img/novedades.png");
        imagenTituloNotificacion.setAttribute("id", "imagenTituloNotificacion");
        document.getElementById("notificacion").appendChild(imagenTituloNotificacion);

        document.getElementById("notificacion").style.display = "none";
        let botonCentroNotificaciones = document.createElement("button");
        botonCentroNotificaciones.setAttribute("id", "disparadorCentroNotificaciones");

        let imagenBoton = document.createElement("img");
        imagenBoton.setAttribute("src", "img/iconos/notificacion.png");

        let numeroNotificaciones = document.createElement("p");
        numeroNotificaciones.setAttribute("id", "marcadorNotificaciones");
        numeroNotificaciones.innerText = `${numeroDeNotificaciones}`;
        botonCentroNotificaciones.appendChild(imagenBoton);
        botonCentroNotificaciones.appendChild(numeroNotificaciones);

        botonCentroNotificaciones.addEventListener("click", () => {
            efectoMenu();
            efectoPortal();
            numeroDeNotificaciones = 0;
            document.getElementById("marcadorNotificaciones").innerText = `${numeroDeNotificaciones}`;
            if (notificacionesMostradas) {
                notificacionesMostradas = false;
                document.getElementById("notificacion").style.animationName = "desaparicionNotificacionPantalla";
                setTimeout(() => {
                    document.getElementById("notificacion").style.display = "none";
                }, 100);
            } else {
                notificacionesMostradas = true;
                document.getElementById("notificacion").style.display = "flex";
                document.getElementById("notificacion").style.animationName = "aparicionNotificacionPantalla ";
            }

        });
        document.body.insertBefore(botonCentroNotificaciones, document.querySelector(".contenedorBotonesPanel"));
        if (panelMostrado) botonCentroNotificaciones.style.opacity = 1;
    }

    const deshabilitarBotonCentroNotificaciones = () => {
        let botonCentroNotificaciones = document.getElementById("disparadorCentroNotificaciones");
        document.getElementById("notificacion").innerHTML = "";
        numeroDeNotificaciones = 0;
        document.getElementById("marcadorNotificaciones").innerText = `${numeroDeNotificaciones}`;
        document.body.removeChild(botonCentroNotificaciones);
    }

    //con estas funciones asignamos el sonido de las teclas al pulsarse
    //y al crearse los elementos
    const efectoRecursos = () => {
        let sonido = new Audio("audio/efectos/efectoRecursos.mp3");
        sonido.play();
    }

    const efectoMenu = () => {
        let sonido = new Audio("audio/efectos/botonMenuDesplegable.mp3");
        sonido.volume = 0.5;
        sonido.play();
    }

    const efectoNotificacion = (tipo) => {
        let sonido;
        //efectp de notificacion negativa
        if (tipo <= 0) {
            sonido = new Audio("audio/efectos/idgf.mp3");
            sonido.volume = 0.6;
        } else {
            sonido = new Audio("audio/efectos/wubaLuba.mp3");
            sonido.volume = 0.4;
        }

        sonido.play();
    }

    const efectoCajaRegistradora = () => {
        let sonido = new Audio("audio/efectos/cajaRegistradora.mp3");
        sonido.volume = 0.3;
        sonido.play();
    }

    const efectoConstruir = () => {
        let sonido = new Audio("audio/efectos/construir.mp3");
        sonido.volume = 0.4;
        sonido.play();
    }

    const efectoMeeseks = () => {
        let sonido = new Audio("audio/efectos/meeseks.mp3");
        sonido.volume = 0.2;
        sonido.play();
    }

    const efectoMonedas = () => {
        let sonido = new Audio("audio/efectos/sonidoMoneda.mp3");
        sonido.volume = 0.5;
        sonido.play();
    }

    const efectoMorty = () => {
        let sonido = new Audio("audio/efectos/morty.mp3");
        sonido.volume = 0.6;
        sonido.play();
    }

    const efectoPortal = () => {
        let sonido = new Audio("audio/efectos/portal.mp3");
        sonido.volume = 0.5;
        sonido.play();
    }

    const efectoRickinillo = () => {
        let sonido = new Audio("audio/efectos/rickinillo.mp3");
        sonido.volume = 0.6;
        sonido.play();
    }

    const simpleRick = () => {
        let sonido = new Audio("audio/efectos/simpleRick.mp3");
        sonido.volume = 0.6;
        sonido.play();
    }

    const recoger = () => {
        let sonido = new Audio("audio/efectos/recoger.mp3");
        sonido.volume = 0.4;
        sonido.play();
    }

    const victoriaFinal = () => {
        let sonido = new Audio("audio/efectos/victoriaFinal.mp3");
        sonido.volume = 0.2;
        sonido.play();
    }


    //funcion para habilitar el guardado en un momento concreto
    const habilitarGuardado = () => {
        let contenedorBotonesPanel = document.querySelector(".contenedorBotonesPanel");
        let botonGuardar = document.createElement("button");
        botonGuardar.setAttribute("id", "botonGuardar");
        let imagenGuardar = document.createElement("img");
        imagenGuardar.src = "img/iconos/guardar.png";
        botonGuardar.appendChild(imagenGuardar);

        botonGuardar.addEventListener("click", () => {
            efectoMenu();
            efectoNotificacion(1);

            let divHoras = document.getElementById("horasContador").innerText;
            let divMinutos = document.getElementById("minutosContador").innerText;
            let divSegundos = document.getElementById("segundosContador").innerText;

            //guardamos en 3 arrays la informacion necesaria para cargar; variables numericas, booleanos y niveles desbloqueados.
            let recursos = [monedas, piedra, madera, trabajadores, rickinillo, cuero, caballos, barquillo, precioCabaña, divHoras, divMinutos, divSegundos];
            let booleanos = [existeCentroRecursos, primeraAdquisicionEdificios, primeraCreacionAlmacen, primeraCreacionMercado, primerEstablo, primeraFabrica, primeraTaberna];
            localStorage.setItem('1', recursos);
            localStorage.setItem('2', partesDesbloqueadas);
            localStorage.setItem('3', booleanos);
            mostrarNotificacion("La partida se ha guardado", 1);
            console.log(recursos)
            console.log(partesDesbloqueadas)
        });
        contenedorBotonesPanel.appendChild(botonGuardar);
        if (panelMostrado) botonGuardar.style.opacity = 1;
    }

    //funcion para deshabilitar el guardado
    const deshabilitarGuardado = () => {
        let contenedorBotonesPanel = document.querySelector(".contenedorBotonesPanel");
        let botonGuardado = document.querySelector("#botonGuardar");
        contenedorBotonesPanel.removeChild(botonGuardado);
    }
    //funcion para crear un contador de tiempo de la partida
    //esta funcion se llama al finalizar el primer dialogo
    const contadorDeTiempo = (segundos = 0, minutos = 0, horas = 0) => {
        let divPantallaContador = document.createElement("div");
        divPantallaContador.setAttribute("class", "contador");
        divPantallaContador.style.color = "white";

        let divSegundos = document.createElement("div");
        divSegundos.setAttribute("id", "segundosContador");
        let divMinutos = document.createElement("div");
        divMinutos.setAttribute("id", "minutosContador");
        let divHoras = document.createElement("div");
        divHoras.setAttribute("id", "horasContador");

        divPantallaContador.appendChild(divHoras);
        divPantallaContador.appendChild(divMinutos);
        divPantallaContador.appendChild(divSegundos);


        let tiempoSegundos = segundos;
        let tiempoMinutos = minutos;
        let tiempohoras = horas;

        intervaloTiempo = setInterval(() => {
            tiempoSegundos++;
            if (tiempoSegundos > 59) {
                tiempoSegundos = 0;
                tiempoMinutos++;
                if (tiempoMinutos > 59) {
                    tiempoMinutos = 0;
                    tiempohoras++;
                }
            }

            if (tiempoSegundos <= 9) {
                divSegundos.innerText = `:0${tiempoSegundos}`;
            } else {
                divSegundos.innerText = `:${tiempoSegundos}`;
            }

            if (tiempoMinutos <= 9) {
                divMinutos.innerText = `:0${tiempoMinutos}`;
            } else {
                divMinutos.innerText = `:${tiempoMinutos}`;
            }

            if (tiempohoras <= 9) {
                divHoras.innerText = `0${tiempohoras}`;
            } else {
                divHoras.innerText = `${tiempohoras}`;
            }

        }, 1000);
        // document.getElementById("contenedor").insertBefore(divPantallaContador, document.getElementById("cabecera"));
        document.body.insertBefore(divPantallaContador, document.getElementById("contenedor"));

        if (panelMostrado) divPantallaContador.style.opacity = 1;
    }

    //Funcion para generar el menu de inicio del juego
    const menuPrincipal = () => {
        deshabilitarJuego();

        let img = document.createElement("img");
        img.setAttribute("src", "img/letras.png");
        img.setAttribute("id", "imagenMenu");

        let contenedorBotones = document.createElement("div");
        contenedorBotones.setAttribute("id", "contenedorBotones");

        let botonNuevaPartida = document.createElement("button");
        botonNuevaPartida.innerText = "Nueva partida"

        botonNuevaPartida.addEventListener("click", () => {
            efectoMenu();
            document.getElementById("imagenMenu").style.animation = "desaparicionBody 0.5s 1 normal forwards";
            document.getElementById("contenedorBotones").style.animation = "desaparicionBody 0.5s 1 normal forwards";

            setTimeout(() => {
                document.body.removeChild(img);
                document.body.removeChild(contenedorBotones);
            }, 1000);

            setTimeout(() => {
                tutorial();
            }, 1000);
            botonNuevaPartida.disabled = true;
        });

        let botonCargarPartida = document.createElement("button");
        botonCargarPartida.innerText = "Cargar partida"

        botonCargarPartida.addEventListener("click", () => {
            efectoMenu();
            //controlamos si se puede cargar o no la partica
            let recursos = localStorage.getItem("1");
            let partesDesbloqueadas = localStorage.getItem("2");
            let booleanos = localStorage.getItem("3");
            if (recursos != null && partesDesbloqueadas != null && booleanos != null) {
                document.getElementById("imagenMenu").style.animation = "desaparicionBody 1s 1 normal forwards";
                document.getElementById("contenedorBotones").style.animation = "desaparicionBody 1s 1 normal forwards";

                setTimeout(() => {
                    document.body.removeChild(img);
                    document.body.removeChild(contenedorBotones);
                }, 1000);
                funcionCarga();
                console.log(partesDesbloqueadas);
            } else {
                efectoNotificacion(0);
            }

        });

        img.style.animation = "aparicionBody 1s 1 normal forwards";
        contenedorBotones.style.animation = "aparicionBody 1s 1 normal forwards";

        panelControl();
        document.body.appendChild(img);
        contenedorBotones.appendChild(botonNuevaPartida);
        contenedorBotones.appendChild(botonCargarPartida);
        document.body.appendChild(contenedorBotones);

    }

    //LLAMAMOS A LA FUNCION MENU PRINCIPAL, LA CUAL VA A SER LA QUE COMIENZE EL JUEGO
    menuPrincipal();

    //Funcion encargada de cargar partida, creando elementos y asignando eventos
    const funcionCarga = () => {

        let recursos = localStorage.getItem("1").split(",");
        let partesDesbloqueadasCargadas = localStorage.getItem("2").split(",");
        let booleanos = localStorage.getItem("3").split(",");
        //convertimos string en booleano
        for (let i = 0; i < booleanos.length; i++) {
            if (booleanos[i] == 'true') booleanos[i] = true; else booleanos[i] = false;

        }
        //booleanos
        existeCentroRecursos = booleanos[0];
        primeraAdquisicionEdificios = booleanos[1];
        primeraCreacionAlmacen = booleanos[2];
        primeraCreacionMercado = booleanos[3];
        primerEstablo = booleanos[4];
        primeraFabrica = booleanos[5];
        primeraTaberna = booleanos[6];

        //numericos
        monedas = parseInt(recursos[0]);
        piedra = parseInt(recursos[1]);
        madera = parseInt(recursos[2]);
        trabajadores = parseInt(recursos[3]);
        rickinillo = parseInt(recursos[4]);
        cuero = parseInt(recursos[5]);
        caballos = parseInt(recursos[6]);
        barquillo = parseInt(recursos[7]);
        precioCabaña = parseInt(recursos[8]);


        setTimeout(() => {
            document.querySelectorAll("#cabecera img")[0].style.visibility = "visible";
            document.querySelectorAll("#cabecera img")[1].style.visibility = "visible";
            document.getElementById("contenedor").style.animation = "aparicionBody 1.5s 1 normal forwards";
            habilitarJuego();
            crearBotonCentroNotificaciones();
            crearCentroRecursos();
            console.log(parseInt(recursos[11].substring(1, 3)));
            contadorDeTiempo(parseInt(recursos[11].substring(1, 3)), parseInt(recursos[10].substring(1, 3)), parseInt(recursos[9].substring(1, 3)));
            habilitarGuardado();
        }, 1000);

        const almacenCreado = () => {
            generarBotonEnPanelSecundario("almacen", "Almacen", "divPrincipalpanelEdificio", () => {
            });
            generarContenedorPaneles("divPrincipalpanelEdificio", "almacen", `Habilitado`, imagenesEdificios[0]);
            document.querySelector("#imagenCandadoalmacen").setAttribute("src", "img/iconos/Edificios/Recurso/inventory.png");
            document.getElementById("divConImagenalmacen").style.filter = "grayscale(0%)";
            document.querySelector("#divConImagenalmacen img").style.filter = "blur(0px)";
            document.querySelector("#contenedoralmacen button").disabled = true;
        }

        const granjaDesbloqueada = () => {
            generarBotonEnPanelSecundario("granja", "Granja", "divPrincipalpanelEdificio", () => {
            });
            generarContenedorPaneles("divPrincipalpanelEdificio", "granja", `Habilitado`, imagenesEdificios[1]);
            document.querySelector("#imagenCandadogranja").setAttribute("src", "img/iconos/Edificios/Recurso/pickle.png");
            document.querySelector("#divConImagengranja img").style.filter = "blur(0px)";
            document.getElementById("divConImagengranja").style.filter = "grayscale(0%)";
            document.querySelector("#contenedorgranja button").disabled = true;
            intervaloRickinillo = setInterval(() => {
                rickinillo++;
                actualizarRecursos();
                mostrarNotificacion("Rickinillo generado", 1);
            }, 20000);
        }

        const establosDesbloqueados = () => {
            generarBotonEnPanelSecundario("establos", "Establos", "divPrincipalpanelEdificio", () => {
                if (cuero >= cueroCaballo && rickinillo >= trigoCaballo) {
                    caballos++;
                    mostrarNotificacion("Acabas de criar un pequeño Morty, es precioso!!!", 1);
                    efectoMorty();
                    actualizarRecursos();
                } else {
                    mostrarNotificacion("No tienes recursos suficientes para criar un pequeño Morty", 2);
                    efectoNotificacion(0);
                }
            });
            generarContenedorPaneles("divPrincipalpanelEdificio", "establos", `${cueroCaballo} cuero \n ${trigoCaballo} Rickinillos`, imagenesEdificios[4]);
            document.getElementById("divConImagenestablos").style.filter = "grayscale(0%)";
            document.querySelector("#divConImagenestablos img").style.filter = "blur(0px)";
            document.querySelector("#imagenCandadoestablos").setAttribute("src", "img/iconos/Edificios/Recurso/morti.png");
        }

        const fabricaDesbloqueada = () => {

            generarBotonEnPanelSecundario("fabrica", "Fabrica", "divPrincipalpanelEdificio", () => {
                if (rickinillo >= cantidadTrigoPan) {
                    rickinillo -= cantidadTrigoPan;
                    barquillo++;
                    mostrarNotificacion("Has creado 1 barquillo", 1);
                    simpleRick();
                    actualizarRecursos();
                } else {
                    mostrarNotificacion("No tienes suficientes Rickinillos para hacer barquillo", 4, 2);
                    efectoNotificacion(0);
                }
            });
            generarContenedorPaneles("divPrincipalpanelEdificio", "fabrica", `${cantidadTrigoPan} Rickinillos`, imagenesEdificios[5]);
            document.getElementById("divConImagenfabrica").style.filter = "grayscale(0%)";
            document.querySelector("#divConImagenfabrica img").style.filter = "blur(0px)";
            document.querySelector("#imagenCandadofabrica").setAttribute("src", "img/iconos/Edificios/Recurso/barquillo.png");

        }

        const mercadoHabilitado = () => {
            generarDivPanel("panelMercado", "Mercado");

            generarBotonEnPanelSecundario("mercado", "Mercado", "divPrincipalpanelEdificio", () => {
                efectoMenu();
                document.getElementById("panelMercado").style.animationName = "aparicionPantalla";
                document.getElementById("panelMercado").style.visibility = "visible";
                aparicionBotones("panelMercado");
                document.getElementById("panelMercado").style.display = "flex";

                //comprobamos cada vez que nos metemos si se ha creado la fabrica para mostrar el barquillo
                if (!primeraFabrica) {
                    document.getElementById("divConImagenbarquillo").style.display = "flex";
                }
            }
            );
            generarContenedorPaneles("divPrincipalpanelEdificio", "mercado", `Habilitado`, imagenesEdificios[2]);
            document.querySelector("#imagenCandadomercado").setAttribute("src", "img/iconos/Edificios/Recurso/todosMercado.png");
            document.getElementById("divConImagenmercado").style.filter = "grayscale(0%)";
            document.querySelector("#divConImagenmercado img").style.filter = "blur(0px)";

            generarBotonEnPanelSecundario("cuero", "Cuero", "divPrincipalpanelMercado", () => {
                let seleccionUsuario = parseInt(document.querySelector("#divConImagencuero .marcadorCompra").innerText);

                if (seleccionUsuario > 0 && monedas >= precioCueroMercado * seleccionUsuario) {
                    monedas -= precioCueroMercado * seleccionUsuario;
                    cuero += seleccionUsuario;
                    mostrarNotificacion(`Has comprado ${seleccionUsuario} de Cuero`, 1);
                    efectoCajaRegistradora();
                    document.querySelector("#divConImagencuero .marcadorCompra").innerText = 0;
                    actualizarRecursos();
                } else if (seleccionUsuario <= 0) {
                    mostrarNotificacion(`Selecciona una cantidad de Cuero mayor que 0`, 2);
                    efectoNotificacion(0);
                } else {
                    mostrarNotificacion(`No tienes schmeckles suficientes para comprar Cuero`, 2);
                    document.querySelector("#divConImagencuero .marcadorCompra").innerText = 0;
                    efectoNotificacion(0);
                }
            });

            //genero divs contendores de los botones para poner los precios y mostrar en pantalla
            generarContenedorPaneles("divPrincipalpanelMercado", "cuero", `${precioCueroMercado} schmeckles`, imagenesMercado[0]);
            generarBotonesCompra("cuero");

            generarBotonEnPanelSecundario("piedra", "Piedra", "divPrincipalpanelMercado", () => {
                let seleccionUsuario = parseInt(document.querySelector("#divConImagenpiedra .marcadorCompra").innerText);

                if (seleccionUsuario > 0 && monedas >= precioPiedraMercado * seleccionUsuario) {
                    monedas -= (precioCueroMercado * seleccionUsuario);
                    piedra += seleccionUsuario;
                    mostrarNotificacion(`Has comprado ${seleccionUsuario} de Piedra Plutoniana`, 1);
                    efectoCajaRegistradora();
                    document.querySelector("#divConImagenpiedra .marcadorCompra").innerText = 0;
                    actualizarRecursos();
                } else if (seleccionUsuario <= 0) {
                    mostrarNotificacion(`Selecciona una cantidad de Piedra Plutoniana mayor que 0`, 2);
                    efectoNotificacion(0);
                } else {
                    mostrarNotificacion(`No tienes schmeckles suficientes para comprar Piedra Plutoniana`, 2);
                    document.querySelector("#divConImagenpiedra .marcadorCompra").innerText = 0;
                    efectoNotificacion(0);
                }
            });

            generarContenedorPaneles("divPrincipalpanelMercado", "piedra", `${precioPiedraMercado} schmeckles`, imagenesMercado[2]);
            generarBotonesCompra("piedra");

            generarBotonEnPanelSecundario("madera", "Madera", "divPrincipalpanelMercado", () => {

                let seleccionUsuario = parseInt(document.querySelector("#divConImagenmadera .marcadorCompra").innerText);

                if (seleccionUsuario > 0 && monedas >= percioMaderaMercado * seleccionUsuario) {
                    monedas -= percioMaderaMercado * seleccionUsuario;
                    madera += seleccionUsuario;
                    mostrarNotificacion(`Has comprado ${seleccionUsuario} de Madera`, 1);
                    efectoCajaRegistradora();
                    document.querySelector("#divConImagenmadera .marcadorCompra").innerText = 0;
                    actualizarRecursos();
                } else if (seleccionUsuario <= 0) {
                    mostrarNotificacion(`Selecciona una cantidad de Madera mayor que 0`, 2);
                    efectoNotificacion(0);
                } else {
                    mostrarNotificacion(`No tienes schmeckles suficientes para comprar Madera`, 2);
                    document.querySelector("#divConImagenmadera .marcadorCompra").innerText = 0;
                    efectoNotificacion(0);
                }
            });
            generarContenedorPaneles("divPrincipalpanelMercado", "madera", `${percioMaderaMercado} schmeckles`, imagenesMercado[1]);
            generarBotonesCompra("madera");
            //habilito el boton de comprar pan en el mercado

            generarBotonEnPanelSecundario("barquillo", "Barquillo", "divPrincipalpanelMercado", () => {

                if (primeraFabrica) {
                    efectoNotificacion(0);
                    mostrarNotificacion("No puedes comprar barquillo hasta que habilites la fabrica", 2);
                }
                else {
                    let seleccionUsuario = parseInt(document.querySelector("#divConImagenbarquillo .marcadorCompra").innerText);

                    if (seleccionUsuario > 0 && monedas >= preciobarquilloMercado * seleccionUsuario) {
                        monedas -= precioCueroMercado * seleccionUsuario;
                        preciobarquilloMercado += seleccionUsuario;
                        mostrarNotificacion(`Has comprado ${seleccionUsuario} de Barquillo`, 1);
                        efectoCajaRegistradora();
                        document.querySelector("#divConImagenbarquillo .marcadorCompra").innerText = 0;
                        actualizarRecursos();
                    } else if (seleccionUsuario <= 0) {
                        mostrarNotificacion(`Selecciona una cantidad de Barquillo mayor que 0`, 2);
                        efectoNotificacion(0);
                    } else {
                        mostrarNotificacion(`No tienes schmeckles suficientes para comprar Barquillo`, 2);
                        document.querySelector("#divConImagenbarquillo .marcadorCompra").innerText = 0;
                        efectoNotificacion(0);
                    }

                }
            });
            generarContenedorPaneles("divPrincipalpanelMercado", "barquillo", `${preciobarquilloMercado} schmeckles`, imagenesMercado[3]);
            generarBotonesCompra("barquillo");
            document.getElementById("divConImagenbarquillo").style.display = "none";
            //comprobamos al crear el mercado si se ha creado la fabrica para mostrar el barquillo
            estadoInicialRecursosMercado();
        }

        // aqui comenzamos la carga
        generarAlquimia();
        generarEdificio(0);
        almacenCreado();
        generarRecoger();
        generarCabaña();

        if (parseInt(partesDesbloqueadasCargadas[2]) > -1) {
            granjaDesbloqueada();
        } else {
            generarGranja();
        }

        if (parseInt(partesDesbloqueadasCargadas[3]) > -1) {
            mercadoHabilitado();
        } else {
            generarMercado();
        }

        if (parseInt(partesDesbloqueadasCargadas[4]) > -1) {
            establosDesbloqueados();
        }

        if (parseInt(partesDesbloqueadasCargadas[5]) > -1) {
            fabricaDesbloqueada();
            generarCiudadela();
        } else {
            generarFabrica();
        }

    }
}