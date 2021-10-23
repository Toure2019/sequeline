import { Request, Response } from 'express'
import Service from './service'
import schema from './schema'

/**
 * GET /exportation/segment-gestions
 * returns a csv with all comptes
 * @params
 * etablissement: number
 */
export default async (req: Request, res: Response) => {
  // we check params sent by the API
  const request = await Service.validateRequest(req, schema)
  if (request.error) {
    return res.status(422).json(request)
  }

  // we get the csv content
  const data = await Service.getData(request.etablissement)

  if (data instanceof Error) {
    return res.status(422).json({
      success: false,
      error: `Des erreurs sont apparu lors de la récupération des données: ${data.message}`
    })
  }

  // return the CSV
  res.set('Content-Type', 'text/csv;charset=utf-8')
  res.set('Access-Control-Expose-Headers', 'Content-Disposition')
  res.set(
    'content-Disposition',
    'attachment;filename="listes_segments_gestion.csv"'
  )

  res.send(`\uFEFF${  data}`)
}
