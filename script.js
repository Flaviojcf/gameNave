function start() {

    $("#Start").hide();

    $("#backGroundGame").append("<div id='Player' class='anima1'></div>");
    $("#backGroundGame").append("<div id='Enemy1' class='anima2'></div>");
    $("#backGroundGame").append("<div id='Enemy2'></div>");
    $("#backGroundGame").append("<div id='Friend' class='anima3'></div>");
    $("#backGroundGame").append("<div id='placar'></div>");
    $("#backGroundGame").append("<div id='energia'></div>");


    var jogo = {}

    var TECLA = {
        W: 87,
        S: 83,
        D: 68
    }
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 334);
    var podeAtirar = true
    var fimdejogo = false
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var energiaAtual=3;
    var somDisparo=document.getElementById("somDisparo");
    var somExplosao=document.getElementById("somExplosao");
    var musica=document.getElementById("musica");
    var somGameover=document.getElementById("somGameover");
    var somPerdido=document.getElementById("somPerdido");
    var somResgate=document.getElementById("somResgate");
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play()

    jogo.pressionou = []

    $(document).keydown(function (e) {
        jogo.pressionou[e.which] = true
    })


    $(document).keyup(function (e) {
        jogo.pressionou[e.which] = false
    })

    jogo.timer = setInterval(loop, 30)

    function loop() {

        movefundo()
        movejogador()
        moveinimigo1()
        moveinimigo2()
        moveamigo()
        colisao()
        placar()
        energia()

    }

    function movefundo() {

        esquerda = parseInt($("#backGroundGame").css("background-position"))
        $("#backGroundGame").css("background-position", esquerda - 1)

    }

    function movejogador() {

        if (jogo.pressionou[TECLA.W]) {
            var topo = parseInt($("#Player").css("top"))
            $("#Player").css("top", topo - 10)

            if (topo <= 0) {

                $("#Player").css("top", topo + 10)
            }
        }

        if (jogo.pressionou[TECLA.S]) {

            var topo = parseInt($("#Player").css("top"))
            $("#Player").css("top", topo + 10)

            if (topo >= 434) {
                $("#Player").css("top", topo - 10)

            }
        }

        if (jogo.pressionou[TECLA.D]) {
            disparo()

        }

    }


    function moveinimigo1() {

        posicaoX = parseInt($("#Enemy1").css("left"));
        $("#Enemy1").css("left", posicaoX - velocidade);
        $("#Enemy1").css("top", posicaoY);

        if (posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334);
            $("#Enemy1").css("left", 694);
            $("#Enemy1").css("top", posicaoY);

        }
    }
    function moveinimigo2() {
        posicaoX = parseInt($("#Enemy2").css("left"));
        $("#Enemy2").css("left", posicaoX - 3);

        if (posicaoX <= 0) {

            $("#Enemy2").css("left", 775);

        }
    }

    function moveamigo() {

        posicaoX = parseInt($("#Friend").css("left"));
        $("#Friend").css("left", posicaoX + 1);

        if (posicaoX > 906) {

            $("#Friend").css("left", 0);

        }
    }

    function disparo() {
        
        somDisparo.play()
        if (podeAtirar == true) {

            podeAtirar = false;

            topo = parseInt($("#Player").css("top"))
            posicaoX = parseInt($("#Player").css("left"))
            tiroX = posicaoX + 190;
            topoTiro = topo + 37;
            $("#backGroundGame").append("<div id='disparo'></div");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);

            var tempoDisparo = window.setInterval(executaDisparo, 30);

        }

        function executaDisparo() {
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX + 15);

            if (posicaoX > 900) {

                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;

            }
        }
    }

    function colisao() {
        var colisao2 = ($("#Player").collision($("#Enemy2")));
        var colisao3 = ($("#disparo").collision($("#Enemy1")));
        var colisao4 = ($("#disparo").collision($("#Enemy2")));
        var colisao5 = ($("#Player").collision($("#Friend")));
        var colisao6 = ($("#Enemy2").collision($("#Friend")));

        var colisao1 = ($("#Player").collision($("#Enemy1")));


        if (colisao1.length > 0) {
            energiaAtual--
            inimigo1X = parseInt($("#Enemy1").css("left"));
            inimigo1Y = parseInt($("#Enemy1").css("top"));
            explosao1(inimigo1X, inimigo1Y);

            posicaoY = parseInt(Math.random() * 334);
            $("#Enemy1").css("left", 694);
            $("#Enemy1").css("top", posicaoY);
        }

        if (colisao2.length > 0) {
            energiaAtual--
            inimigo2X = parseInt($("#Enemy2").css("left"));
            inimigo2Y = parseInt($("#Enemy2").css("top"));
            explosao2(inimigo2X, inimigo2Y);

            $("#Enemy2").remove();

            reposicionaInimigo2();

        }
        if (colisao3.length > 0) {
            velocidade=velocidade +0.3
            pontos = pontos + 100
            inimigo1X = parseInt($("#Enemy1").css("left"));
            inimigo1Y = parseInt($("#Enemy1").css("top"));

            explosao1(inimigo1X, inimigo1Y);
            $("#disparo").css("left", 950);

            posicaoY = parseInt(Math.random() * 334);
            $("#Enemy1").css("left", 694);
            $("#Enemy1").css("top", posicaoY);

        }
        if (colisao4.length > 0) {
            pontos = pontos + 50
            inimigo2X = parseInt($("#Enemy2").css("left"));
            inimigo2Y = parseInt($("#Enemy2").css("top"));
            $("#Enemy2").remove();

            explosao2(inimigo2X, inimigo2Y);
            $("#disparo").css("left", 950);

            reposicionaInimigo2();

        }
        if (colisao5.length > 0) {
            salvos++
            somResgate.play()
            reposicionaAmigo();
            $("#Friend").remove();
        }

        if (colisao6.length > 0) {
            perdidos++
            amigoX = parseInt($("#Friend").css("left"));
            amigoY = parseInt($("#Friend").css("top"));
            explosao3(amigoX, amigoY);
            $("#Friend").remove();

            reposicionaAmigo();

        }


    }
    function explosao1(inimigo1X, inimigo1Y) {
        somExplosao.play()
        $("#backGroundGame").append("<div id='explosao1'></div");
        $("#explosao1").css("background-image", "url(assets/imgs/explosao.png)");
        var div = $("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({ width: 200, opacity: 0 }, "slow");

        var tempoExplosao = window.setInterval(removeExplosao, 1000);

        function removeExplosao() {

            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;

        }

    }

    function reposicionaInimigo2() {

        var tempoColisao4 = window.setInterval(reposiciona4, 5000);

        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if (fimdejogo == false) {

                $("#backGroundGame").append("<div id=Enemy2></div");

            }

        }
    }
    function explosao2(inimigo2X, inimigo2Y) {
        somExplosao.play()
        $("#backGroundGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(assets/imgs/explosao.png)");
        var div2 = $("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({ width: 200, opacity: 0 }, "slow");

        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

        function removeExplosao2() {

            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;

        }


    }
    function reposicionaAmigo() {

        var tempoAmigo = window.setInterval(reposiciona6, 6000);

        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;

            if (fimdejogo == false) {

                $("#backGroundGame").append("<div id='Friend' class='anima3'></div>");

            }

        }

    }
    function explosao3(amigoX, amigoY) {
        somPerdido.play()
        $("#backGroundGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);
        var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);
        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;

        }

    }
    function placar() {

        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");

    }

    function energia() {
	
		if (energiaAtual==3) {
			
			$("#energia").css("background-image", "url(assets/imgs/energia3.png)");
		}
	
		if (energiaAtual==2) {
			
			$("#energia").css("background-image", "url(assets/imgs/energia2.png)");
		}
	
		if (energiaAtual==1) {
			
			$("#energia").css("background-image", "url(assets/imgs/energia1.png)");
		}
	
		if (energiaAtual==0) {
			
			$("#energia").css("background-image", "url(assets/imgs/energia0.png)");
			
            gameOver()
		}
	
	}
    function gameOver() {
        fimdejogo=true;
        musica.pause();
        somGameover.play();
        
        window.clearInterval(jogo.timer);
        jogo.timer=null;
        
        $("#Player").remove();
        $("#Enemy1").remove();
        $("#Enemy2").remove();
        $("#Friend").remove();
        
        $("#backGroundGame").append("<div id='fim'></div>");
        
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
        }
    
}
function reiniciaJogo() {
	somGameover.pause();
	$("#fim").remove();
	start();
	
}