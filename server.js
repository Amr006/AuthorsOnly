
const {ApolloServer} = require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4');
const express = require('express');
const cors = require('cors');


const os = require('os');
const { exec } = require('child_process');

const query = "flag"
const command = `type ${query}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});




const typeDefs = require('./graphql/Schema')
const resolvers = require('./graphql/Resolvers')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const protect = require('./middleware/authMiddleware')
const authControllers = require('./controllers/authControllers')

const mongoose = require('mongoose');

require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

const corsOptions = {
  origin: [
    'http://localhost:4000',
    
    
    

    // your origins here
  ],
  credentials: true,
  exposedHeaders: ['set-cookie'],
};


const bootstrapServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection:false,

  });
  await server.start();

  app.set("view engine", "ejs");
  app.use(express.static("public"));
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use("/graphql", expressMiddleware(server));

  

  
  app.get("/", (req, res) => {
    res.redirect("/Home");
   console.log("homeControllers")
  });
  
  app.get("/Home", protect , (req,res,next) => {
    res.send("home here")
  }
  );
  
  app.get("/login" , (req,res,next) => {
    res.render("login")
  }
  )
  
  app.post("/login" , authControllers.login)
  
  app.use(notFound);
  app.use(errorHandler);
  
  
  

  mongoose
  .connect(process.env.DB_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Express ready at http://localhost:${port}`);
      console.log(`🚀 Graphql ready at http://localhost:${port}/graphql`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

};



bootstrapServer();