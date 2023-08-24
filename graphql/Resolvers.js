const controllers = require('../controllers/authControllers')
const resolvers = {
  Query: {
    
    authors()
    {
      return controllers.displayUsers()
    }
    

  }
  ,
  Mutation: {

    addAuthor(_,args){
      return controllers.register(args)
    }
  }
  
}

module.exports = resolvers