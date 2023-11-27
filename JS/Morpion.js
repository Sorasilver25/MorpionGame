$(document).ready(function() {

    var afficheur = new Afficheur($("#InfoJeu"));
    var pions = $("#Corps_Jeu button");
    var prenomJoueurX = $("#prenomJoueurX").val().trim() || "Joueur X";
    var prenomJoueurO = $("#prenomJoueurO").val().trim() || "Joueur O";
    var joueurs = ["X", "O"];
    var tour = 0;
    var jeuEstFini = false;

  function estValide(button) {
    return $(button).html().length === 0;
  }
  
  function setSymbol(btn, symbole) {
    $(btn).html(symbole);
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
            $(pions[a]).html() == joueurs[tour] &&
            $(pions[b]).html() == joueurs[tour] &&
            $(pions[c]).html() == joueurs[tour]
        ) {
            $(pions[a]).css("backgroundColor", "#9ACD32");
            $(pions[b]).css("backgroundColor", "#9ACD32");
            $(pions[c]).css("backgroundColor", "#9ACD32");
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
    prenomJoueurX = $(this).val() || "Joueur X";
    afficheur.sendMessage("<br />" + getNomJoueur(tour, prenomJoueurX, prenomJoueurO) + " c'est votre tour.");
  });

  $("#prenomJoueurO").on("blur", function() {
    prenomJoueurO = $(this).val() || "Joueur O";
    afficheur.sendMessage("<br />" + getNomJoueur(tour, prenomJoueurX, prenomJoueurO) + " c'est votre tour.");
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
          afficheur.sendMessage(getNomJoueur(tour, prenomJoueurX, prenomJoueurO) +' a gagné ! <br /> <a href="Programme_Principal.html">Rejouer</a>');
          return;
        }

        if (matchNul(pions)) {
          afficheur.sendMessage(
            'Match Nul ! <br/> <a href="Programme_Principal.html">Rejouer</a>'
          );
          return;
        }

        tour = (tour + 1) % 2; // Alterner entre les joueurs X et O
        afficheur.sendMessage( getNomJoueur(tour, prenomJoueurX, prenomJoueurO) + " c'est à vous !");
      }
    });
  }

main();
});