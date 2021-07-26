const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const cors = require('cors')
const {buildSchema} = require('graphql')
const {readFileSync} = require('fs')
const {makeExecutableSchema} = require('graphql-tools')

const stringSchema = readFileSync('./correctSchema.graphql', {encoding: 'utf8'})

const app = express();
app.use(cors())

const root = require('./correctResolvers')

const schema = makeExecutableSchema({
    typeDefs: stringSchema,
    resolvers: root
})

app.use('/graphql', graphqlHTTP({
    graphiql:true,
    schema,
    rootValue: root
}))

app.listen(5000, () => {
    console.log('Server started on port 5000')
})