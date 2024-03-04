import { Schema, model } from "mongoose"

const userSchema = Schema({
    name:{
        type: String,
        required: true
    },
    surname:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username:{
        type: String,
        unique: true,
        lowercase: true,
        required: true,
    },
    password:{
        type: String,
        minLength: [8, 'Password must be 8 characters'],
        required: true
    },
    phone:{
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true
    },
    courses: [{
        type: Schema.ObjectId,
        ref: 'course'
    }],
    address:{
        type: String,
        required: true
    },
    role:{
        type: String,
        uppercase: true,
        enum: ['TEACHER','STUDENT'],
        required: true
    }

})

export default model('user', userSchema)