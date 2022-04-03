export default function wrapAsync(fn) {
  return async (req, res) => {
    try {
      await fn(req, res)
    } catch (err) {
      let message = err.message || ''
      let details = err.details || ''
      if (typeof err.code === 'string') {
        message = err.code
        details = err.message
        err.code = 500
      }
      res.status(err.code || 500).json({
        message: message,
        details: details
      })
    }
  }
}
