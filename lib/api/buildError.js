export default function buildError({ code = 500, details = '', message = '' }) {
  const error = new Error(message)
  error.code = code
  error.details = details
  return error
}
