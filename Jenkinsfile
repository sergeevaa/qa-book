pipeline {
    agent {
        node {
        label 'TestNode' 
        }
    }
    options {
        ansiColor('xterm')
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 1, unit: 'HOURS') 
        buildDiscarder(logRotator(artifactDaysToKeepStr: '7', artifactNumToKeepStr: '10', daysToKeepStr: '7', numToKeepStr: '50'))
    }
    parameters {
        booleanParam(defaultValue: true, description: 'Build SSIS', name: 'BUILD')
        booleanParam(defaultValue: false, description: 'Deploy SSIS', name: 'DEPLOY')
    }
    environment {
        alarm = ".\\alarm\\index.html"
    }
    stages {
    }
    post {
    // Код ниже будет выполнен вне зависимости от статуса сборки трубы или этапа
        always {
            script {
                # Устанавливаю результат сборки трубы
                currentBuild.result = currentBuild.result ?: 'SUCCESS'
                # Уведомляю Bitbucket о результате сборки
                notifyGitHub()
            }
        }
    }
}