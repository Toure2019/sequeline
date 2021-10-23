import Repository from './repository'
import CompteService from '../compte/service'

class Service {

  static async findSegmentGestionChantier(codeEtablissement: string, toClient: string, idDepartement: string, compteId: string) {
    let bupc = ''
    if (compteId !== '-1' && compteId !== '') {
        const compte = await CompteService.findOneById(compteId) as any
        bupc = compte.pc
    }
    return Repository.findAllBy(codeEtablissement, toClient, idDepartement, bupc)
  }
}

export default Service
