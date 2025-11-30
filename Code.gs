/**
 * @fileoverview Script de traduction automatique intégré à l'interface Google Slides.
 * @author Fabrice Faucheux
 */

/**
 * Crée le menu personnalisé à l'ouverture de la présentation.
 * Se déclenche automatiquement lors du chargement de Google Slides.
 */
const onOpen = () => {
  const ui = SlidesApp.getUi();
  ui.createMenu('🌐 Traduction')
    .addItem('Traduire la présentation en Anglais', 'lancerTraductionActive')
    .addToUi();
};

/**
 * Fonction déclenchée par le menu.
 * Récupère la présentation active, la copie et lance la traduction.
 */
const lancerTraductionActive = () => {
  const ui = SlidesApp.getUi();
  
  // CONFIGURATION
  const LANGUE_SOURCE = 'fr';
  const LANGUE_CIBLE = 'en';

  try {
    // Message discret de démarrage
    const presentationActive = SlidesApp.getActivePresentation();
    presentationActive.toast('Copie et analyse en cours...', 'Traduction Démarrée', 10);
    
    // 1. Récupération des données contextuelles
    const idSource = presentationActive.getId();
    const nomSource = presentationActive.getName();
    const nomCible = `${nomSource} (Traduit en ${LANGUE_CIBLE.toUpperCase()})`;

    // 2. Copie du fichier via DriveApp
    const fichierSource = DriveApp.getFileById(idSource);
    const fichierCopie = fichierSource.makeCopy(nomCible);
    const idCopie = fichierCopie.getId();

    Logger.log(`Fichier copié. ID: ${idCopie}`);

    // 3. Ouverture de la copie pour traitement
    const presentationCopie = SlidesApp.openById(idCopie);
    const diapositives = presentationCopie.getSlides();

    // Notification utilisateur
    presentationActive.toast(`Traitement de ${diapositives.length} diapositives...`, 'En cours', -1);

    // 4. Itération sur chaque diapositive (Slides + Notes)
    diapositives.forEach((diapositive, index) => {
      // Traduction du contenu visible
      traduireContenuDiapositive(diapositive, LANGUE_SOURCE, LANGUE_CIBLE);
      
      // Traduction des notes conférencier
      const pageNotes = diapositive.getNotesPage();
      if (pageNotes) {
        traduireContenuDiapositive(pageNotes, LANGUE_SOURCE, LANGUE_CIBLE);
      }
    });

    presentationCopie.saveAndClose();

    // 5. Affichage du résultat à l'utilisateur
    const urlResultat = fichierCopie.getUrl();
    const htmlOutput = HtmlService
      .createHtmlOutput(`<p>La traduction est terminée avec succès !</p>
                         <p><a href="${urlResultat}" target="_blank" style="font-family: sans-serif; font-size: 16px; color: #1a73e8;">Ouvrir la présentation traduite</a></p>`)
      .setWidth(400)
      .setHeight(150);
      
    ui.showModalDialog(htmlOutput, '✅ Traduction Terminée');

  } catch (erreur) {
    console.error(erreur);
    ui.alert('Erreur', `Une erreur est survenue : ${erreur.message}`, ui.ButtonSet.OK);
  }
};

/**
 * Helper qui regroupe la traduction des Formes, Tableaux et Groupes pour un conteneur donné (Slide ou NotesPage).
 * @param {GoogleAppsScript.Slides.Slide | GoogleAppsScript.Slides.NotesPage} conteneur 
 * @param {string} source 
 * @param {string} cible 
 */
const traduireContenuDiapositive = (conteneur, source, cible) => {
  // A. Formes simples
  const formes = conteneur.getShapes();
  formes.forEach(forme => traduireElementTexte(forme, source, cible));

  // B. Tableaux (uniquement si le conteneur supporte getTables - NotesPage ne le supporte pas toujours de la même façon, vérification utile)
  if (conteneur.getTables) {
    const tableaux = conteneur.getTables();
    tableaux.forEach(tableau => traduireTableau(tableau, source, cible));
  }

  // C. Groupes
  const groupes = conteneur.getGroups();
  groupes.forEach(groupe => {
    const enfants = groupe.getChildren();
    enfants.forEach(enfant => {
      if (enfant.getPageElementType() === SlidesApp.PageElementType.SHAPE) {
        traduireElementTexte(enfant.asShape(), source, cible);
      }
    });
  });
};

/**
 * Traduit le contenu textuel d'une forme.
 * @param {GoogleAppsScript.Slides.Shape} forme 
 * @param {string} source 
 * @param {string} cible 
 */
const traduireElementTexte = (forme, source, cible) => {
  try {
    const zoneDeTexte = forme.getText();
    traduireRangeDeTexte(zoneDeTexte, source, cible);
  } catch (e) {
    // La forme ne contient pas de texte éditable
  }
};

/**
 * Itère sur les cellules d'un tableau.
 * @param {GoogleAppsScript.Slides.Table} tableau 
 * @param {string} source 
 * @param {string} cible 
 */
const traduireTableau = (tableau, source, cible) => {
  const nbLignes = tableau.getNumRows();
  const nbColonnes = tableau.getNumColumns();

  for (let i = 0; i < nbLignes; i++) {
    for (let j = 0; j < nbColonnes; j++) {
      const cellule = tableau.getCell(i, j);
      traduireRangeDeTexte(cellule.getText(), source, cible);
    }
  }
};

/**
 * Effectue l'appel API de traduction.
 * @param {GoogleAppsScript.Slides.TextRange} textRange 
 * @param {string} source 
 * @param {string} cible 
 */
const traduireRangeDeTexte = (textRange, source, cible) => {
  if (!textRange) return;
  const texteOriginal = textRange.asString();
  
  if (texteOriginal && texteOriginal.trim().length > 0) {
    try {
      const texteTraduit = LanguageApp.translate(texteOriginal, source, cible);
      textRange.setText(texteTraduit);
    } catch (e) {
      console.warn(`Erreur traduction segment : ${e.toString()}`);
    }
  }
};
