import {Request, Response, NextFunction} from "express"

module.exports = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-auth-token")
  if (!token) {
    return res.status(401).json({msg: "No token, authorization denied"})
  }
  next()
}
