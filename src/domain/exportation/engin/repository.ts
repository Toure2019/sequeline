import models from '../../index'

class Repository {
  static getAllEngins = async () => {
    return models.Engin.findAll({
      order: [['libelle', 'ASC']],
      raw: true
    })
  }

  static getEnginUniteConfig = async (id: number) => {
    // TODO: Put this in a config file
    const config = [
      {
        id: 0,
        libelle: 'HEURE',
        placeholder: '00:00',
        test: '{"action": "time","accept_empty":true}',
        visible: true
      },
      {
        id: 1,
        libelle: 'JOURNÉE',
        placeholder: '0.0',
        test:
          '{"actions":[{"action": "float","value": ""},{"action": "divisable","value": "0.5"}],"accept_empty":true}',
        visible: true
      },
      {
        id: 2,
        libelle: 'UNITÉ',
        placeholder: '0.0',
        test:
          '{"actions":[{"action": "float","value": ""},{"action": "divisable","value": "0.5"}],"accept_empty":true}' /*,{"action": "maxval","value": "1"}*/,
        visible: true
      },
      {
        id: 3,
        libelle: 'KM',
        placeholder: '0',
        test: '{"action": "int","accept_empty":true}',
        visible: true
      },
      {
        id: 4,
        libelle: 'KTM',
        placeholder: '0',
        test: '{"action": "int","accept_empty":true}',
        visible: true
      },
      {
        id: 5,
        libelle: 'EURO',
        placeholder: '0.0',
        test: '{"action": "float","accept_empty":true}',
        visible: true
      },
      {
        id: 6,
        libelle: 'MÈTRE',
        placeholder: '0',
        test: '{"action": "int","accept_empty":true}',
        visible: true
      },
      {
        id: 7,
        libelle: 'SEMAINE',
        placeholder: '0',
        test: '{"action": "int","accept_empty":true}',
        visible: true
      },
      {
        id: 8,
        libelle: 'TONNE',
        placeholder: '0',
        test: '{"action": "int","accept_empty":true}',
        visible: true
      }
    ]

    let result = {}
    for (let index = 0; index < config.length; index++) {
      if (id == config[index].id) {
        result = config[index]
        break
      }
    }

    return result
  }

  static getStatutLibelle = async (engin: { [key: string]: any }) => {
    let statut
    switch (engin.statut) {
      case 0: {
        statut = 'I'
        break
      }
      case 1: {
        statut = 'A'
        break
      }
      default: {
        statut = ''
        break
      }
    }
    return statut
  }

  static getUniteLibelle = async (engin: { [key: string]: any }) => {
    const uniteEngine: {
      [key: string]: any
    } = await Repository.getEnginUniteConfig(engin.unite)

    let libelle = engin.unite
    if (uniteEngine && uniteEngine.libelle) {
      libelle = uniteEngine.libelle
    }

    return libelle
  }
}

export default Repository
