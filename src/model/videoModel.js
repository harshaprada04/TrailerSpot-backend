import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
      "adult": {
        type: Boolean,
        default: false
      },
      "backdrop_path": {
        type: String
      },
      "id": {
        type: Number
      },
      "original_language": {
        type: String
      },
      "original_name": {
        type: String
      },
      "overview":{
        type: String
      },
      "popularity": {
        type: Number
      },
      "poster_path":{
        type: String
      },
      "first_air_date": {
        type: String
      },
      "name": {
        type: String
      },
      "vote_average": {
        type: Number
      },
      "vote_count": {
        type: Number
      },
}, { timestamps: true });


export const Video = mongoose.model('Video', videoSchema);