![License MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Google%20Apps%20Script-green)
![Runtime](https://img.shields.io/badge/Google%20Apps%20Script-V8-green)
![Author](https://img.shields.io/badge/Auteur-Fabrice%20Faucheux-orange)

# GAS Slides Translator & Speaker Notes

## Description
Script d'automatisation Google Workspace pour la traduction intégrale de présentations Google Slides. Ce projet génère une copie traduite du fichier source en préservant la mise en forme.

## Fonctionnalités Clés
* **Sécurité** : Opère sur une copie distincte du fichier original.
* **Traduction Visuelle** : Traitement des zones de texte (Shapes), Tableaux et Groupes.
* **Traduction Invisible** : **NOUVEAU** - Prise en charge complète des **Notes du présentateur** (Speaker Notes).
* **Moteur V8** : Code moderne ES6+ optimisé.

## Installation Manuelle

1.  Créez un projet sur [script.google.com](https://script.google.com) ou depuis votre Slide (Extensions > Apps Script).
2.  Collez le code complet dans `Code.gs`.
3.  Renseignez `ID_PRESENTATION_SOURCE` (ID dans l'URL du Slide).
4.  Définissez `LANGUE_SOURCE` et `LANGUE_CIBLE`.
5.  Lancez `traduirePresentationSlides`.

