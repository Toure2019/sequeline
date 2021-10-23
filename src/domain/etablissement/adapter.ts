/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import _ from 'lodash'
import { unserialize } from 'php-serialize'

const typeEtablissement = new Map([['V' , 'INFRAPOLE'], ['L', 'INFRALOG'], ['N', 'INFRALOG NATIONAL']])

export const adaptEtablissement = (data: any) => {
  return data.map((item: any) => {
    item = item.toJSON()
    const res: any = {
      code: item.code,
      libelle: item.libelle,
      libelle_min: item.libelle_min,
      type: typeEtablissement.get(item.t_type_etablissement_code),
      date_effet: item.date_effet,
      date_effet_end: item.date_effet_end,
      date_start: item.date_start,
      date_end: item.date_end,
      enabled: item.enabled,
      version: item.version,
      data: item.t_etablissement_data.map((item: any) => {
        if (item.key === 'departements') {
          const dpts = unserialize(item.value)
          item.value = dpts
        }

        return item
      }),
      uos: item.t_uos.map((item: any) => {
        return { code: item.code, libelle: item.libelle }
      }),
      divisions: _.uniqBy(item.t_uos, (e: any) => {
        return (
          e.t_departement.t_rg.t_division.code &&
          e.t_departement.t_rg.t_division.libelle
        )
      }).map((item: any) => {
        return item.t_departement.t_rg.t_division
      }),
      departements: _.uniqBy(item.t_uos, (e: any) => {
        return e.t_departement.code && e.t_departement.libelle
      }).map((item: any) => {
        return item.t_departement.t_rg.t_division
      })
    }
    return res
  })
}
