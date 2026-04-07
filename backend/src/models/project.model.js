import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import user from './user.model.js'

const projectSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    userId: [{
        type: Schema.Types.ObjectId,
        ref: "user"
    }]
})

const projectModel = mongoose.model("project" , projectSchema)

export default projectModel;