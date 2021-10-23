# SAR SW API

Ce projet est un projet Node/Express (version 12)

Il faut récupérer le contenu du fichier `.env.example` qui se trouve à la racine du projet, le copier, le renommer en `.env` et rennseigner les variables d'environnements qui s'y trouve.

`.env`

```
PORT=3000
DB_HOST= 10.26.93.24
DB_PASSWORD= ...
DB_USER= user_asr_dev
DB_NAME= test_asrv2
```

Pour démarrer le projet, il faut que Docker soit préalablement installé.

```bash
npm i
```

Le projet doit être buildé avant d'être lancé

```bash
npm run build && npm start
```

## Dev dans vscode

Pour le bon developpement du projet vous devez installer les extentions suivantes :

### Obligatoires

- EditorConfig
- Eslint
- PostgreSQL
- Prettier
- TSLint

Poue se connecter directement à la base de données de DEV via l'extenssion PostGreSQL de vscode if faut clicker sur le plus en haut à droite de l'explorer de BDD et renseigner les bonnes valeurs qui sont celles du fichier `.env`

## A mettre à jour

Ensuite exécuter cette commande :

```bash
docker-compose up --build
```

Ceci lancera automatiques l'alimentation des données en base (les seeds ) et lancera les tests

Finalement, ouvrir le navigateur: [http://localhost:3000/](http://localhost:3000/)
