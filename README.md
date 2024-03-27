# Description

Utilitaire basique permettant d'extraire ses expériences professionnelles fournies à l'aide d'un fichier csv.

Le fichier est analysé et va ajouter toutes les expériences à CV au format json-resume (balise `projects`).

## Workflow

1. on a en entrée un CV au format excel par exemple et on souhaite récupérer ses expériences professionnelles (i.e. missions)
2. on a le format sur deux colonnes (cf paragraphe suivant) :
    1. colonne 1 : description des champs
    2. colonne 2 : valeurs des champs
3. on récupère ou génére son fichier json-resume et on le place dans la racine du présent projet
4. on lance la commande qui va extraire les données du csv et les ajouter au CV json-resume

Quand on a un fichier ods, on peut très bien générer le fichier CSV en :
1. ouvrant le fichier ods
2. copiant les trois colonnes de expérience 1 à expérience n dans un nouveau fichier csv
3. sauvant le fichier au format csv
4. réouvrant le fichier csv et supprimant la deuxième colonne
5. sauvant le csv

Standard json-resume : https://jsonresume.org/

## Format du fichier d'entrée


Récupéré de l'ancien fichier excel de CV Linagora, à savoir :

```
,Expérience N°24
Période,2023
Entreprise,"Agence Nationale pour l'Habitat"
Projet ,Maintenance architecture identités
Fonction,Architecte IAM
Missions et Réalisations,"Evolution/maintenance architecture, intégration DM LinID"
Environnements Technologiques,"centos, debian, ansible, LemonLDAP, openLDAP"
```

**Attention aux caractères spéciaux, notamment `-` pour séparer les dates et pas le tiret long quadratin.**

Des exemples sont fournis dans le répertoire `examples`.

## Génération des expériences

En entrée le fichier csv et le cv.json de référence.

Note : si le fichier de référence n'existe pas il sera créé avec uniquement la balise des expériences (`projects`).

En sortie, on a ainsi le fichier cv.json.new.

La sortie sur la console permet de débugger les problèmes récurrents (comme les données incomplètes).

```
node index.js xp examples/experiences.csv -i examples/cv.json
```

## Mapping

Voici le format attendu pour les expériences, les autres champs ne sont pas valorisé :

```
"name": "the company for which I worked",
"description": "",
"highlights": [],
"keywords": [
    "my techno",
    "my language"
],
"startDate": "2021-02",
"endDate": "2022-01",
"url": "",
"roles": [
    "developer"
],
"entity": "",
"type": "",
"summary": "Header of what I did\nwhat I did was great"
```

