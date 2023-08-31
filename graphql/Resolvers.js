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
    },
    async authenticateAuthor(_,args){
      console.log("amrrrrrrrr")
      return controllers.login(args)
        .then(response => {
          if (response.success) {
            return { success: true, token: response.token, redirect: response.redirect };
          } else {
            throw new Error("Authentication failed"); // Handle failed login
          }
        })
        .catch(error => {
          throw new Error(error.message); // Propagate the error to GraphQL
        });
    }
  }
  
}

module.exports = resolvers