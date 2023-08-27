const {ApolloServer} = require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4');
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const data = require('./model/db.json')
const os = require('os');
const { exec } = require('child_process');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const siteUrl = process.env.APP_BASE_URL

console.log(siteUrl)

const typeDefs = require('./graphql/Schema')
const resolvers = require('./graphql/Resolvers')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const protect = require('./middleware/authMiddleware')
const authControllers = require('./controllers/authControllers')


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
    introspection:true,

  });
  await server.start();

  var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
  
  app.use(morgan('combined', { stream: accessLogStream }))
  app.use(morgan('combined'))
  app.set("view engine", "ejs");
  app.use(express.static("public"));
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use("/graphql", expressMiddleware(server));
  app.use(cookieParser())
  

  
  app.get("/", (req, res) => {
    res.redirect("/Home");
   console.log("homeControllers")
  });
  
  app.get("/Home", protect , (req,res,next) => {
    
    
    console.log(req.query.file)
    var input = req.query.file
    if(req.query.file != undefined)
    {
        const fs = require('fs');
        const data = fs.readFileSync(__dirname + "/public/books/" + input, "utf-8");
        return res.render("index", { data: data });
    }else
    {
      res.render("index" , {data : ""})
    }
    
  }
  );

  
  
  app.get("/login" , (req,res,next) => {
    res.render("login")
  }
  )
  
  app.post("/login" , authControllers.login)
  
  app.use(notFound);
  app.use(errorHandler);
  
  
  

  
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Express ready at http://localhost:${port}`);
      console.log(`🚀 Graphql ready at http://localhost:${port}/graphql`);
    });

};



bootstrapServer();