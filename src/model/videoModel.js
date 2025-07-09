import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  id:{
    type:String,
    required: true,
    unique: true
  },
  original_title: {
    type: String, 
  },
  name: {
    type: String,       
  },
  overview: {   
    type: String,       
  },
  vote_average: {
    type: String
  },
  isOriginal: {
    type: Boolean
    },
    image: {
    type: String  
  }
}, { timestamps: true });


export const Video = mongoose.model('Video', videoSchema);