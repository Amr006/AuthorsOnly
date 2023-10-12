const jwt = require('jsonwebtoken')


const authenticate = (req,res,next) => {
  
    try {
      
        console.log(req.cookies.token)
        let cookieToken = req.cookies.token;
        
        //const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(cookieToken, process.env.SECRET_KEY);
        req.userName = decode.Name
        
        return next()


    }catch(error)
    {
        return res.redirect('/login')
    }
    
}

module.exports = authenticate