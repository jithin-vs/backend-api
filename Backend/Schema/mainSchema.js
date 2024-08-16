import mongoose from "mongoose";

const Schema = mongoose.Schema;

const directorSchema = new Schema({
    directorId :{type:Number , unique:true},
    name :{type: String , unique:true},
});

const movieSchema = new Schema({
    id : {type:Number , unique:true},
    name : String ,
    directorId:Number,
});

const Director = mongoose.model('Director', directorSchema);
const Movie = mongoose.model('Movie', movieSchema);

export { Director, Movie };