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
        type: String,
    required: true,
    unique: true,
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
        type: String
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
        type: String
      },
      "vote_count": {
        type: String
      },
}, { timestamps: true });


export const Video = mongoose.model('Video', videoSchema);