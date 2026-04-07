import server from './src/app.js'
import connectDB from './src/db/db.js'


connectDB();

server.listen(3000, () => {
    console.log('app run on port 3000')
})