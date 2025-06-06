$(document).ready(function() {

    var afficheur = new Afficheur($("#InfoJeu"));
    var pions = $("#Corps_Jeu button");
    var prenomJoueurX = $("#prenomJoueurX").val().trim() || "Joueur X";
    var prenomJoueurO = $("#prenomJoueurO").val().trim() || "Joueur O";
    var joueurs = ["X", "O"];
    var tour = 0;
    var jeuEstFini = false;
    var victoiresX = 0;
    var victoiresO = 0;
    var partiesNulles = 0;
    const svgX = `<img src="assets/radix-icons--cross-2.svg" alt="X" class="svg-symbol" id="cross" draggable="false" data-symbol="X">`;
    const svgO = `<img src="assets/akar-icons--circle.svg" alt="O" class="svg-symbol" id="circle" draggable="false" data-symbol="O">`;

    function estValide(button) {
        return !$(button).attr("data-symbol");
    }

    function setSymbol(btn, symbole) {
        if (symbole === "X") {
            $(btn).html(svgX);
            $(btn).attr("data-symbol", "X");
        } else if (symbole === "O") {
            $(btn).html(svgO);
            $(btn).attr("data-symbol", "O");
        }
    }

    function rechercherVainqueur(pions, joueurs, tour) {
        const combinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonnes
            [0, 4, 8], [2, 4, 6] // diagonales
        ];

        for (const combination of combinations) {
            const [a, b, c] = combination;
            if (
                $(pions[a]).attr("data-symbol") == joueurs[tour] &&
                $(pions[b]).attr("data-symbol") == joueurs[tour] &&
                $(pions[c]).attr("data-symbol") == joueurs[tour]
            ) {
                $(pions[a]).css("backgroundColor", "#2b2b2b95");
                $(pions[b]).css("backgroundColor", "#2b2b2b95");
                $(pions[c]).css("backgroundColor", "#2b2b2b95");
                return true;
            }
        }
        return false;
    }

    function matchNul(pions) {
        for (var i = 0, len = pions.length; i < len; i++) {
            if ($(pions[i]).html().length == 0) return false;
        }
        return true;
    }

    $("#prenomJoueurX").on("blur", function() {
        prenomJoueurX = $(this).val().trim() || "Joueur X";
        afficheur.sendMessage("<br />" + getNomJoueur(tour, prenomJoueurX, prenomJoueurO) + " c'est votre tour.");
    });

    $("#prenomJoueurO").on("blur", function() {
        prenomJoueurO = $(this).val().trim() || "Joueur O";
        afficheur.sendMessage("<br />" + getNomJoueur(tour, prenomJoueurX, prenomJoueurO) + " c'est votre tour.");
    });

    $("#resetGame").off("click").on("click", function() {

        if (tour==0) {
         tour = 1;
        } else {
            tour = 0;
        }

        pions.html("");
        pions.css("backgroundColor", "");
        pions.removeAttr("data-symbol");
        jeuEstFini = false;
        afficheur.sendMessage("Le jeu peut recommencer ! <br />" + getNomJoueur(tour, prenomJoueurX, prenomJoueurO) + " c'est votre tour.");
        $(this).attr('style','visibility','hidden !important;');
    });

    function Afficheur(element) {
        var affichage = element;

        function setText(message) {
            affichage.html(message);
        }

        return { sendMessage: setText };
    }

    function getNomJoueur(tour, prenomJoueurX, prenomJoueurO) {
        return (tour === 0) ? prenomJoueurX : prenomJoueurO;
    }

    function main() {
        afficheur.sendMessage("Le jeu peut commencer ! <br />" + getNomJoueur(tour, prenomJoueurX, prenomJoueurO) + " c'est votre tour.");

        pions.on("click", function() {
            if (jeuEstFini) return;

            if (!estValide(this)) {
                afficheur.sendMessage("Case occupée ! <br />" + getNomJoueur(tour, prenomJoueurX, prenomJoueurO) + " c'est toujours à vous !");
            } else {
                setSymbol(this, joueurs[tour]);
                jeuEstFini = rechercherVainqueur(pions, joueurs, tour);

                if (jeuEstFini) {

                    if (joueurs[tour] === 'X') {
                        victoiresX++;
                    } else {
                        victoiresO++;
                    }
                    afficheur.sendMessage(getNomJoueur(tour, prenomJoueurX, prenomJoueurO) +' a gagné !');
                    $('#resetGame').attr('style','visibility:initial !important;');
                    updateStats();
                    return;
                }

                if (matchNul(pions)) {
                    afficheur.sendMessage('Match Nul ! <br/>');
                    $('#resetGame').attr('style','visibility:initial !important;');
                    partiesNulles++;
                    updateStats();
                    return;
                }

                tour = (tour + 1) % 2;
                afficheur.sendMessage( getNomJoueur(tour, prenomJoueurX, prenomJoueurO) + " c'est à vous !");
            }
        });
    }

    function updateStats() {
        $("#victoiresX").html("Victoires <br>" + victoiresX);
        $("#victoiresO").html("Victoires <br>" + victoiresO);
        $("#partiesNulles").html("Parties Nulles <br>" + partiesNulles);
    }

    main();
});