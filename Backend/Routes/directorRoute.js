import express from 'express';
import { Director } from '../Schema/mainSchema.js';
import { customAlphabet } from 'nanoid';
import { authToken,generateToken } from '../Auth/auth.js';
const router = express.Router();
const nanoid = customAlphabet('1234567890', 6);

router.get('/',async(req, res) => {    
    try{
        const directors = await Director.find({},{ _id: 0, name: 1, directorId: 1 });
        const token = generateToken();
        res.status(200).json({director_list:directors,token:token});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error!!",error:err});
    }
 })
router.post('/',authToken,async(req, res) => {
    try{
        const dir_name = req.body.name;
        const dir_id = nanoid();
        const director = new Director({name:dir_name,directorId:dir_id});
        await director.save();
        res.status(200).json({message:"Successfully added to database!!"});
    }catch(err){
        if (err.code === 11000) {
            console.log('Duplicate field value error :', err.message);
            res.status(401).json({message:"Director already Exists!!"});
          } else {
            console.log("error:",err);
            res.status(500).json({message:"Could not insert into database!!",error:err});
          }
    }
 })
router.get('/:id',authToken,async(req, res) => {
    try{
        const dir_id = req.params.id;
        const director = await Director.findOne({ directorId: dir_id });
        if (!director) {
            res.status(200).json({message:"Director Not Found!!"});
        } else {
            res.status(200).json({message:"Director Found!!",director:director});
        }
    }catch(err){
        console.log("error:",err);
        res.status(500).json({message:"Internal Server Error!!",error:err});
    }
 })
router.put('/:id',authToken,async(req, res) => {
    try{
        const dir_id = req.params.id;
        const new_name = req.body.name;
        const updated_director = await Director.findOneAndUpdate(
            { directorId: dir_id },
            { name:new_name},
            {new:true}
            );  

        if (!updated_director) {
            res.status(200).json({message:"Director Not Found!!"});
        } else {
            res.status(200).json({message:"Director updated!!",director:updated_director});
        }
    }catch(err){
        console.log("error:",err);
        res.status(500).json({message:"Internal Server Error:Could not update director!!",error:err});
    }
 })
router.delete('/:id',authToken,async(req, res) => {
    try{
        const dir_id = req.params.id;
        const deleted_director = await Director.findOneAndDelete( { directorId: dir_id } );  
        if (!deleted_director) {
            res.status(200).json({message:"Director Not Found!!"});
        } else {
            res.status(200).json({message:"Director deleted!!",director:deleted_director});
        }
    }catch(err){
        console.log("error:",err);
        res.status(500).json({message:"Internal Server Error:Could not delete director!!",error:err});
    }
 })
export default router ;