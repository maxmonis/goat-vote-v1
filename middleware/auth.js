module.exports = (req, res, next) => {
  const token = req.header('x-auth-token')
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' })
  }
  next()
}
