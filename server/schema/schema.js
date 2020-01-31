const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;

const movies = [
  { id: 1, name: 'Film 1', genre: 'Crime', directorId: 1 },
  { id: 2, name: 'Film 2', genre: 'Sci-Fi', directorId: 2 },
  { id: 3, name: 'Film 3', genre: 'Sci-Fi-Triller', directorId: 3 },
  { id: 4, name: 'Film 4', genre: 'Crime-Comedy', directorId: 4 },
  { id: 5, name: 'Film 5', genre: 'Comedy', directorId: 5 },
  { id: 6, name: 'Film 6', genre: 'Crime-Comedy', directorId: 1 },
  { id: 7, name: 'Film 7', genre: 'Sci', directorId: 1 },
  { id: 7, name: 'Film 8', genre: 'Detective', directorId: 4 }
]

const directors = [
  { id: 1, name: 'Quentin', age: 55 },
  { id: 2, name: 'Michael', age: 72 },
  { id: 3, name: 'James', age: 51 },
  { id: 4, name: 'Guy', age: 50 },
  { id: 5, name: 'Federico', age: 70 }
]

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    directorId: { type: GraphQLID },
    director: {
      type: DirectorType,
      resolve(parent, args) {
        return directors.find(director => director.id == parent.directorId)
      }
    }
  })
})

const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return movies.filter(movie => movie.directorId == parent.id)
      }
    }
  })
})

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return movies.find(movie => movie.id == args.id)
      }
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return directors.find(director => director.id == args.id)
      }
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return movies
      }
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parent, args) {
        return directors
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: Query
})