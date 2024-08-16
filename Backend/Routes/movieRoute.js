import express from 'express';
import { Movie,Director } from '../Schema/mainSchema.js';
import { customAlphabet } from 'nanoid';
import { authToken, generateToken } from '../Auth/auth.js';

const router = express.Router();
const movieNanoid = customAlphabet('1234567890', 10);
const directorNanoid = customAlphabet('1234567890', 6);

router.get('/',async(req, res) => {
    try{
        const movies = await Movie.find({},{ _id: 0, id:1 , name: 1, directorId: 1 });
        const token = generateToken();
        res.status(200).json({movie_list:movies,token:token});
    }catch(err){
        res.status(500).json({message:"Internal server error!!",error:err});
    }
 })

router.get('/director/:id',authToken,async(req, res) => {
    try{
        const director_id = req.params.id;
        const movies = await Movie.find({directorId:director_id},{_id:0});
        console.log(movies);
        if (!movies) {
            res.status(200).json({message:"Movie Not Found!!"});
        } else {
            res.status(200).json({message:"Movie Found!!",Movie:movies});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error!!",error:err});
    }
 })

router.post('/',authToken,async(req, res) => {
    try{
        const movie_name = req.body.name;
        const movie_id = movieNanoid();
        const director_name = req.body.director;
        const director_id = await Director.find({name:director_name},{ _id: 0, directorId: 1 });
        console.log("director:",director_id[0].directorId);
        if (!director_id) {
            const dir_id = directorNanoid();
            const director = new Director({name:director_name,directorId:dir_id});
            await director.save();
        }  
        const movie = new Movie({name:movie_name,id:movie_id,directorId:director_id[0].directorId});
        await movie.save();
        res.status(200).json({message:"Successfully added to database!!"});
    }catch(err){
        console.log("error:",err);
        res.status(500).json({message:"Could not insert into database!!",error:err});
    }
 })

router.get('/:id',authToken,async(req, res) => {
    try{
        const movie_id = req.params.id;
        const movie = await Movie.findOne({ id: movie_id },{_id :0, id:1, name: 1});
        if (!movie) {
            res.status(200).json({message:"Movie Not Found!!"});
        } else {
            res.status(200).json({message:"Movie Found!!",movie:movie});
        }
    }catch(err){
        console.log("error:",err);
        res.status(500).json({message:"Internal Server Error!!",error:err});
    }
 })

router.put('/:id',authToken,async(req, res) => {
    try{
        const movie_id = req.params.id;
        const new_name = req.body.name;
        const updated_movie = await Movie.findOneAndUpdate(
            { id: movie_id },
            { name: new_name },
            { new: true }
        ).select({ _id: 0, id: 1, name: 1 }); 

        if (!updated_movie) {
            res.status(200).json({message:"Movie Not Found!!"});
        } else {
            res.status(200).json({message:"Movie updated!!",Movie:updated_movie});
        }
    }catch(err){
        console.log("error:",err);
        res.status(500).json({message:"Could not update Movie!!:Internal Server Error",error:err});
    }
 })
router.delete('/:id',authToken,async(req, res) => {
    try{
        const movie_id = req.params.id;
        const deletedMovie = await Movie.findOneAndDelete( { id: movie_id } );  
        if (!deletedMovie) {
            res.status(200).json({message:"Movie Not Found!!"});
        } else {
            res.status(200).json({message:"Movie deleted!!",Movie:deletedMovie});
        }
    }catch(err){
        console.log("error:",err);
        res.status(500).json({message:"Could not delete Movie !!:InternalServer Error \n",error:err});
    }
 })
export default router ;