![License MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Google%20Apps%20Script-green)
![Runtime](https://img.shields.io/badge/Google%20Apps%20Script-V8-green)
![Author](https://img.shields.io/badge/Auteur-Fabrice%20Faucheux-orange)

# GAS Slides Translator (Menu Intégré)

## Description
Ce script ajoute un menu personnalisé "🌐 Traduction" directement dans l'interface de Google Slides. Il permet de générer une copie traduite (Diapositives + Notes conférencier) de la présentation active en un seul clic, sans accéder à l'éditeur de code.

## Fonctionnalités clés
* **Menu UI Natif** : Intégration transparente dans la barre d'outils.
* **Contextuel** : Agit sur la présentation ouverte, pas besoin d'ID.
* **Feedback Utilisateur** : Affiche des notifications "Toast" pendant le traitement et une fenêtre de confirmation avec le lien cliquable à la fin.
* **Complet** : Traduit Formes, Tableaux, Groupes et Notes.

## Installation manuelle

⚠️ **Important** : Ce script doit être "lié" (Container-bound) à la présentation.

1.  Ouvrez votre présentation Google Slides.
2.  Allez dans le menu **Extensions** > **Apps Script**.
3.  Supprimez tout code existant dans le fichier `Code.gs` et collez le script fourni.
4.  Sauvegardez (Icône disquette).
5.  **Rechargez** votre onglet Google Slides (F5).
6.  Après quelques secondes, le menu **"🌐 Traduction"** apparaîtra à droite du menu "Aide".
7.  Cliquez sur **Traduire la présentation en Anglais**. (L'autorisation sera demandée au premier lancement).
