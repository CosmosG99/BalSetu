/**
 * Express middleware to validate request body, query, or params using a Zod schema.
 * Returns consistent error format: { error: { code: 'VALIDATION_ERROR', message: string, details: array } }
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const parsed = schema.parse(dataToValidate);
      req[source] = parsed;
      next();
    } catch (err) {
      if (err.errors) {
        const firstError = err.errors[0];
        const errorPath = firstError.path.length > 0 ? `${firstError.path.join('.')}: ` : '';
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: `${errorPath}${firstError.message}`,
            details: err.errors.map(e => ({
              path: e.path.join('.'),
              message: e.message
            }))
          }
        });
      }
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: err.message || 'Invalid request payload'
        }
      });
    }
  };
}
