//Version templatefile node : 1.5.1

//déclaration de la shared library build_libs
@Library('build_libs') _


def options = [
  // Paramètre optionnel : Id du credential nexus pour la publication
  // CREDENTIAL_NEXUS_ID: '{{credential-nexus-id}}',
  // Paramètre optionnel : Url du nexus utilisé pour la publication
  // NEXUS_URL: '{{nexus-url}}',
  // Paramètre optionnel : Id du repository nexus maven de type GROUPE du projet
  // GROUP_REPOSITORY_NEXUS_ID: '{{group-repository-nexus-id}}',
  // Paramètre optionnel : groupId utilisé pour l'upload maven sur nexus
  // GROUP_ID: '{{maven-groupId}}',
  // Paramètre optionnel : Id de la config globale npm à utiliser
  // NPM_CONFIG_ID: '{{maven-groupId}}',
  // Propriétés spécifiques au job
  // Paramètre optionnel : Nom de la connexion à Gitlab
  // GITLAB_NAME: '{{gitlab}}',
  // Paramètre optionnel : Clé sonar pour les analyses
  // PROJECT_SONAR_KEY: '{{project_sonar_key}}',
  // Paramètre obligatoire : Nombre de build a conserver dans l'historique
  NUM_TO_KEEP   : 10,
  // Paramètre obligatoire : La branche par défaut à partir de laquelle, le déploiement nexus et l'analyse sonar doivent être fait
  BRANCH_DEVELOP: 'develop',
  // Paramètre obligatoire : Version de node utilisée pour le build
  NODE_VERSION  : 'carbon'
]

/** Spécifique pour les builds docker */
def prepareBuildDocker = [:]
//Pour activer des paramètres optionnels, commenter la ligne précédente et décommenter et valoriser les lignes qui suivent en fonction du besoin
/*
def prepareBuildDocker = [

  // Paramètre optionnel :
  // Id du credentials Jenkins à utiliser pour que le build docker puisse tirer les images From des dockerfiles lorsque présentes sur une organisation privée de la DTR et non publique.
  // 'credentialsIdBuild': '{{credentialsIdBuild }}',

  // Paramètre optionnel :
  // Nom du dépôt maven du service nexus sur lequel seront poussés les binaires lors de ce build.
  // Il sera injecté en tant que build-arg "REPO_NAME" lors du build de l'image. Les dockerfiles doivent contenir l'instruction ARG REPO_NAME
  // 'repoBinaires':'{{ maven-repo }}',

  // Paramètre optionnel :
  // id du credential permettant de downloader les binaires présents sur le service Nexus
  // 'credentialsIdDownload':'{{credentialsId-download}}',

  // Paramètre optionnel :
  // Le nom des images est construit à partir du nom du dépôt git. Ce paramètre permet d'utiliser une valeur différente à la place du nom du dépot.
  // Pour les projets multi-modules, le nom de l'image sera construite à partir de ce préfixe et du nom du module dans les sources sous le dossier docker.
  // Pour les projets non modulaire, le nom de l'image correspondra à ce préfixe.
  //'prefixImage': '{{ prefix-Image }}',

  //Paramètre optionnel :
  //Permet de passer en argument du build docker une variable no_proxy, qui par défaut est valorisée avec les adresses en .sncf.fr et l'adresse du nexus metier
  //'no_proxy': '{{ no-proxy}}',

  //Paramètre optionnel:
  //Permet de passer des arguments au build des images docker.
  // Les valeurs possibles sont des listes de dictionnaires disposant des clés 'name' et 'value'.
  // Par exemple, [ [ 'name':'BUILD', 'value':'docker' ], ['name': 'OS', 'value': 'ubuntu' ] ]
  // permettra d'ajouter à la commande build "--build-arg BUILD='docker' --build-arg OS='ubuntu'"
  //'buildArgs': [ ],
]
*/

//Valorisation des options par défaut
options = defaultBuildOptions(options)

//Propriétés du job
properties([
  [$class: 'BuildConfigProjectProperty'],
  //Connexion Gitlab
  gitLabConnection("${options['GITLAB_NAME']}"),
  //Conservation des 10 dernières éxecutions
  buildDiscarder(logRotator(numToKeepStr: "${options['NUM_TO_KEEP']}")),
  //Déclenchement du job via webhook lors de push de nouveau code ou de creation de merge request
  pipelineTriggers([[$class: 'GitLabPushTrigger', triggerOnPush: true, triggerOnMergeRequest: true, branchFilterType: 'All']])
])

//Plugin timestamp pour afficher le temps à chaque ligne de log
timestamps {
  withTools([
    [name: 'node', version: "${options['NODE_VERSION']}"],
    [name: 'sonar-scanner', image: 'sonar-scanner', registry: 'eul']
  ]) {
    try {
      stage('Récupération code source') {
        scmInfo = checkout scm
        env.GIT_URL = scmInfo.GIT_URL
        env.GIT_COMMIT = scmInfo.GIT_COMMIT
      }

      stage('Extraction information package.json') {
        container('node') {
          if (!fileExists('package.json')) {
            currentBuild.result = 'FAILURE'
            error 'Le fichier package.json n\'est pas présent à la racine du projet'
          }

          //Récupération de l'attribut name de package.json
          env.NAME = sh(script: "node -p \"require('./package.json').name\"", returnStdout: true).trim()
          println "Nom extrait du package.json : ${env.NAME}"
          //Récupération de l'attribut version de package.json
          env.VERSION = sh(script: "node -p \"require('./package.json').version\"", returnStdout: true).trim()
          println "Version extraite du package.json : ${env.VERSION}"

          //Si la version n'est pas suffixée par SNAPSHOT et que l'on est pas sur la branche master
          if (!env.VERSION.endsWith("-SNAPSHOT") && env.BRANCH_NAME != "master") {
            currentBuild.result = 'FAILURE'
            echo env.VERSION
            error 'la version doit être suffixée par -SNAPSHOT'
          }
          prepareBuildDocker['version'] = env.VERSION
        }
      }


      configFileProvider([configFile(fileId: "${options['NPM_CONFIG_ID']}", variable: 'NPM_SETTINGS')]) {
        container('node') {
          stage('Install') {
            sh "npm install"
          }
          stage('Build') {
            sh "npm run build"
            // Pour conserver le contenu du dossier dist tant que
            // l'historique du build est conservé
            archiveArtifacts 'dist/**/*'
          }
          stage('Test') {
            // Instruction npm de test en environnement d'intégration continue
            // Cette instruction générique peut être modifiée par les projets suivants le framework utilisé :
            // angular : sh "npm test -- --watch=false --code-coverage"
            // react : sh "CI=true npm test -- --coverage"
            sh "npm test"
          }
		  // Phase d'upload, publication sur la page du jobs, des artefacts poussés uniquement sur la branche develop
           if (env.BRANCH_NAME == options['BRANCH_DEVELOP']) {
             stage('Publish') {
               def archiveFile = "${env.NAME}-${env.VERSION}.tar.gz"
               /* Création du tar.gz du dossier dist, possibilité d'ajouter cette étape
               *  dans le postbuild défini dans le package.json : "postbuild": "tar -zcvf {nom_archive}.tar.gz dist/*"
               *  Pour ne pas inclure le dossier parent dist, remplacer par un "cd dist && tar -zcvf {nom_archive}.tar.gz *"
               *  et mettre à jour le paramètre file de l'appel au nexusArtifactUploader (le préfixer par dist/)
               */
               sh "tar -zcvf ${archiveFile} *"

               nexusArtifactUploader(
                 artifacts: [
                   [artifactId: "${env.NAME}",
                    file      : "${archiveFile}",
                    type      : 'tar.gz']],
                 credentialsId: "${options['CREDENTIAL_NEXUS_ID']}",
                 groupId: "${options['GROUP_ID']}",
                 nexusUrl: "${options['NEXUS_URL']}",
                 nexusVersion: 'nexus3',
                 protocol: 'https',
                 repository: "${options['GROUP_REPOSITORY_NEXUS_ID']}-snapshots",
                 version: "${env.VERSION}"
               )
             }
           }
        }
        //phase n'analyse qualité uniquement sur la branche de developpement par defaut
        if (env.BRANCH_NAME == options['BRANCH_DEVELOP']) {
          container('sonar-scanner') {
            stage('Qualimetrie') {
              withSonarQubeEnv("sonarqube") {
                sh "sonar-scanner -Dsonar.projectKey=${options['PROJECT_SONAR_KEY_BRANCH']} -Dsonar.projectName=${env.NAME} -Dsonar.projectVersion=${env.VERSION}"
              }
            }
          }
        }
      }
      //voir https://jenkins.io/doc/pipeline/steps/gitlab-plugin/ pour plus de précisions
      updateGitlabCommitStatus name: 'build', state: 'success'
      currentBuild.result = 'SUCCESS'

      //Décommenter pour activer le build docker
      /*
      if ( currentBuild.result !='FAILURE' && env.BRANCH_NAME == options['BRANCH_DEVELOP'] ){

          buildDocker(prepareBuildDocker)
      }*/

    } catch (all) {
      currentBuild.result = 'FAILURE'
      //voir https://jenkins.io/doc/pipeline/steps/gitlab-plugin/ pour plus de précisions
      updateGitlabCommitStatus name: 'build', state: 'failed'

      //Envoi d'un mail en cas d'échec
      //voir https://jenkins.io/doc/pipeline/steps/email-ext/ pour plus de précisions
      emailext(
        body: '${DEFAULT_CONTENT}',
        subject: '${DEFAULT_SUBJECT}',
        //envoie du mail aux développeurs responsables d'une modification du code
        recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']],
        //Pour également envoyer le mail à une liste d'adresses (séparées par des ,)
        //  to : "adressmail1, adressmail2"
      )

      throw all
    }
  }
}
