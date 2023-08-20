const resolvers = {
  Query: {
    games() {
      return db.games
    },
    game(_,args)
    {
      return db.games.find((e) => 
        e.id === args.id
      
      )
    },
    authors()
    {
      return db.authors
    }
    ,
    author(_,args)
    {
      return db.authors.find((e) => e.id === args.id)
    }
    ,
    reviews()
    {
      return db.reviews
    },
    review(_,args)
    {
      return db.reviews.find((e) => e.id === args.id)
    }
    

  }
  ,
  Game: {
    reviews(parent)
    {
      return db.reviews.filter((e) => e.game_id === parent.id)
    }
  }
  ,
  Review:
  {
    game(parent){
      return db.games.find((e) => e.id === parent.game_id)
    },
    author(parent)
    {
      return db.authors.find((e) => e.id === parent.author_id)
    }
  },
  Author:
  {
    reviews(parent)
    {
      return db.reviews.filter((e) => e.author_id === parent.id)
    }
  },
  Mutation: {
    addGame(_,args){
      let game = {
        ...args.game ,
        id: Math.floor(Math.random() * 10000).toString()
      }
      db.games.push(game)

      return game 
    }
    ,
    deleteGame(_,args)
    {
      db.games = db.games.filter((g) => g.id !== args.id)

      return db.games
    }
    ,
    updateGame(_,args)
    {
      db.games = db.games.map((g) => {
        if(g.id === args.id)
        {
          return {...g , ...args.edits}
        }

      })

      return db.games.find((e) => g.id === args.id)
    }
  }

}

module.exports = resolvers