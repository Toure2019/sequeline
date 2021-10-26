import { NextFunction, Request, Response } from 'express';
import Service from './../services/user.service';
export const getUsersList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentDate, codeEtablissement, active } = req.query;

    const result = await Service.getUsersList(currentDate, codeEtablissement, active);

    const userList = result.map((user: any) => ({
      cp: user.cp,
      actif: user.enabled,
      niveau: user.uo?.niveau,
      nom: user.nom,
      prenom: user.prenom,
      codeRessource: user.codeRessource,
      uo: user.uo?.code,
      sousEquipe: user.sousEquipe?.libelle,
      profils: user.profils,
    }));

    res.status(200).json(userList);
  } catch (error) {
    next({
      status: error.status || 500,
      message: error.message || '',
      context: 'UserController',
      stack: error,
    });
  }
};

export const updateUserMailAndPhone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mail, phone, userId } = req.body;
    const result = await Service.updateUserMailAndPhone(mail, phone, userId);

    res.status(200).json(result);
  } catch (error) {
    next({
      status: error.status || 500,
      message: error.message || '',
      context: 'UserController',
      stack: error,
    });
  }
};

export const getUserListsBySousEquipe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sousEquipeId, currentEtablissement, currentDate } = req.query;
    const result = await Service.getUsersList(currentDate, currentEtablissement, 1, sousEquipeId);

    res.status(200).json(result);
  } catch (error) {
    next({
      status: error.status || 500,
      message: error.message || '',
      context: 'UserController',
      stack: error,
    });
  }
};

export const getAgents = async (req: Request, res: Response, next: NextFunction) => {
  const { listSousEquipe, codeEtablissement, currentDate } = req.query;
  let result = [];
  try {
    for (const equipe of listSousEquipe) {
      var listAgents = await Service.getUsersBySousEquipe(equipe, codeEtablissement, currentDate);
      result = [...new Set([...listAgents, ...result])];
    }
    res.status(200).json({ result });
  } catch (error) {
    next({
      status: error.status || 500,
      message: error.message || '',
      context: 'UserController',
      stack: error,
    });
  }
};
