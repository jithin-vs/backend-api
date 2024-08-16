import express from 'express';
import {connectDb} from './Database/db.js';
import movieRoute from './Routes/movieRoute.js';
import directorRoute from './Routes/directorRoute.js';
 

const app = express();
 
const PORT = process.env.PORT;
connectDb();
app.use(express.json());
app.use('/directors',directorRoute);
app.use('/movies',movieRoute);


app.listen(PORT,() => {
    
    console.log(`Server is running on http://localhost:${PORT}`);
})




