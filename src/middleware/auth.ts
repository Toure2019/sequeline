import jwt from 'jsonwebtoken'
import secretKey from './../config/secret'

export default function auth(...permittedRoles) {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decodedToken = jwt.verify(token, secretKey)
      const userId = decodedToken['user']
      const roles = decodedToken['role']
      const selectedRole = req.headers['x-selected-role']

      
      const roleFound = roles.find(role => role.libelle === selectedRole)
      
      if (!roleFound) {
        throw 'Le role selectionné n\'est pas un role de utilisateur'
      }

      if (userId && this.isAllowed(selectedRole, permittedRoles)) {
        req.user = {
          id: userId,
          role: roleFound,
        }
        next()
      } else {
        throw 'L\'utilisateur est introuvable ou n\'a pas accès à ces informations'
      }
    } catch (err) {
      res.status(401).json({
        error: new Error(`Requête invalide: ${err}`)
      })
    }
  }
}

export function isAllowed(selectedRole: any, allowed: string[]) {
  if (!allowed || allowed.length === 0) {
    return true
  }
  if (allowed.indexOf(selectedRole) !== -1) {
    return true
  }
  return false
}
