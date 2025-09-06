
export default
    (schema) => {
        return (req, res, next) => {
            let keys = Object.keys(schema)
            let errors = []
            keys.forEach(key => {
                let  {error}  = schema[key].validate(req[key] , {abortEarly: false});
                if (error) {
                    errors.push( error.message )
                }
            })
            if (errors.length > 0) {
                res.status(500).json({ errors })
            } else {
                next()
            }
        }
    }