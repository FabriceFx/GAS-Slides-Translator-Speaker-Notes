/**
 * @fileoverview Script de traduction automatique de Google Slides incluant les notes du présentateur.
 * @author Fabrice Faucheux
 * @version 2.1
 */

/**
 * Fonction principale qui orchestre la copie et la traduction complète (Slides + Notes).
 * @return {void}
 */
const traduirePresentationSlides = () => {
  // CONFIGURATION
  // ID de la présentation source (à extraire de l'URL)
  const ID_PRESENTATION_SOURCE = 'ID_DE_VOTRE_PRESENTATION';
  const LANGUE_SOURCE = 'fr';
  const LANGUE_CIBLE = 'en';

  try {
    console.time('Temps d\'exécution');
    Logger.log('🚀 Démarrage du processus de traduction complète...');

    // 1. Récupération et Copie du fichier via DriveApp
    const fichierSource = DriveApp.getFileById(ID_PRESENTATION_SOURCE);
    const nomFichierSource = fichierSource.getName();
    const nomFichierCible = `${nomFichierSource} (Traduit en ${LANGUE_CIBLE.toUpperCase()})`;

    Logger.log(`Copie du fichier : "${nomFichierSource}" vers "${nomFichierCible}"`);
    const fichierCopie = fichierSource.makeCopy(nomFichierCible);
    const idCopie = fichierCopie.getId();

    // 2. Ouverture de la copie via SlidesApp
    const presentationCopie = SlidesApp.openById(idCopie);
    const diapositives = presentationCopie.getSlides();

    Logger.log(`Début de la traduction de ${diapositives.length} diapositives et de leurs notes.`);

    // 3. Itération sur chaque diapositive
    diapositives.forEach((diapositive, index) => {
      Logger.log(`Traitement de la diapositive ${index + 1}/${diapositives.length}`);
      
      // --- A. Contenu visible de la diapositive ---
      
      // Traduction des formes simples (Shapes)
      const formes = diapositive.getShapes();
      formes.forEach(forme => traduireElementTexte(forme, LANGUE_SOURCE, LANGUE_CIBLE));

      // Traduction des tableaux (Tables)
      const tableaux = diapositive.getTables();
      tableaux.forEach(tableau => traduireTableau(tableau, LANGUE_SOURCE, LANGUE_CIBLE));

      // Traduction des groupes (Groups)
      const groupes = diapositive.getGroups();
      groupes.forEach(groupe => {
        const enfants = groupe.getChildren();
        enfants.forEach(enfant => {
          if (enfant.getPageElementType() === SlidesApp.PageElementType.SHAPE) {
            traduireElementTexte(enfant.asShape(), LANGUE_SOURCE, LANGUE_CIBLE);
          }
        });
      });

      // --- B. Notes du présentateur (Speaker Notes) ---
      
      const pageNotes = diapositive.getNotesPage();
      if (pageNotes) {
        // La page de notes contient elle aussi des "Shapes" (dont la zone de texte principale des notes)
        const formesNotes = pageNotes.getShapes();
        formesNotes.forEach(formeNote => {
            // On réutilise notre fonction helper car la structure est identique
            traduireElementTexte(formeNote, LANGUE_SOURCE, LANGUE_CIBLE);
        });
      }
    });

    presentationCopie.saveAndClose();
    console.timeEnd('Temps d\'exécution');
    Logger.log(`✅ Traduction terminée avec succès.`);
    Logger.log(`Lien vers la nouvelle présentation : ${presentationCopie.getUrl()}`);

  } catch (erreur) {
    console.error(`❌ Une erreur critique est survenue : ${erreur.message}`);
    console.error(erreur.stack);
  }
};

/**
 * Traduit le contenu textuel d'une forme (Shape) si elle contient du texte.
 * @param {GoogleAppsScript.Slides.Shape} forme - La forme à traiter.
 * @param {string} source - Code langue source (ex: 'fr').
 * @param {string} cible - Code langue cible (ex: 'en').
 */
const traduireElementTexte = (forme, source, cible) => {
  // Certaines formes n'ont pas de zone de texte (ex: lignes, connecteurs simples)
  // La méthode getText() renvoie null si pas de texte possible, ou un TextRange vide.
  try {
    const zoneDeTexte = forme.getText();
    traduireRangeDeTexte(zoneDeTexte, source, cible);
  } catch (e) {
    // Ignore les formes qui ne supportent pas le texte
  }
};

/**
 * Itère sur les cellules d'un tableau pour les traduire.
 * @param {GoogleAppsScript.Slides.Table} tableau - Le tableau à traiter.
 * @param {string} source - Code langue source.
 * @param {string} cible - Code langue cible.
 */
const traduireTableau = (tableau, source, cible) => {
  const nbLignes = tableau.getNumRows();
  const nbColonnes = tableau.getNumColumns();

  for (let i = 0; i < nbLignes; i++) {
    for (let j = 0; j < nbColonnes; j++) {
      const cellule = tableau.getCell(i, j);
      const zoneDeTexteCellule = cellule.getText();
      traduireRangeDeTexte(zoneDeTexteCellule, source, cible);
    }
  }
};

/**
 * Fonction utilitaire centrale effectuant la traduction via l'API LanguageApp.
 * @param {GoogleAppsScript.Slides.TextRange} textRange - L'objet TextRange à modifier.
 * @param {string} source - Code langue source.
 * @param {string} cible - Code langue cible.
 */
const traduireRangeDeTexte = (textRange, source, cible) => {
  if (!textRange) return;

  const texteOriginal = textRange.asString();
  
  // Optimisation : On ne traduit que si le texte contient des caractères visibles
  if (texteOriginal && texteOriginal.trim().length > 0) {
    try {
      const texteTraduit = LanguageApp.translate(texteOriginal, source, cible);
      textRange.setText(texteTraduit);
    } catch (e) {
      console.warn(`Avertissement : Échec traduction segment "${texteOriginal.substring(0, 20)}..."`);
    }
  }
};
