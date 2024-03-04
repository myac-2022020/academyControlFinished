'use strict'

import User from './user.model.js'
import Course from '../course/course.model.js'
import { checkPassword, encrypt, checkUpdate} from '../utils/validator.js'
import { generateJWT } from '../utils/jwt.js'
import { validateJwt } from '../middlewares/validate.jwt.js'
import { hash } from 'bcrypt'


export const test = (req, res)=>{
    return res.send('Hello world')
}

export const register = async(req, res)=>{
    try {
        let data = req.body;
        console.log(data)
        data.password = await encrypt(data.password)
        data.role = 'STUDENT' 
        let user = new User(data)
        await user.save()
        return res.send({message: 'Registered successfully'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error registering user ',err})
    }
}

export const login = async(req, res) => {
    try{
        let { username, password } = req.body 
        let user = await User.findOne({ username }) 
        if(user && await checkPassword(password, user.password)){
            let loggedUser = { 
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJWT(loggedUser)
            return res.send({message: `Welcome ${user.name}`, loggedUser, token})
        }
        return res.status(404).send({message: 'Invalid Credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

export const update =  async(req, res)=>{
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message:'Have submitted some data that cannot be update or missing data'})
        let updateUser = await User.findOneAndUpdate(
            {_id: id}, 
            data, 
            {new: true} 
        )
        if(!updateUser) if (!update ) return res.status(400).send({message: 'User not found and not updated'})
            return res.send({message:'Update user', updateUser})
    } catch (err) {
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is already taken`})
        return res.status(500).send({message:'Error updating account'})
    }
}

export const deleteU = async(req, res)=>{
    try {
        let { id } = req.params    
        let deletedUser = await User.findOneAndDelete({_id: id})
        if(!deletedUser) return res.status(404).send({message: 'The acount not found and not deleted'})
        return res.send({message:`Account whit username ${deletedUser.username} delete successfully`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting acount'})
    }
}

export const assignCourse = async (req, res) => {
    try {
        let courseId = req.params.id;
        let userId = req.uid;


        // Verificar si el usuario y el curso existen
        const user = await User.findById(userId);
        const course = await Course.findOne({ _id: courseId });

        if (!user || !course) {
            return res.status(404).send({ message: 'User or course not found' });
        }

        // Verificar si el usuario ya está asignado al curso
        if (user.courses.includes(courseId)) {
            return res.status(400).send({ message: 'User is already assigned to this course' });
        }

        // Verificar si el usuario ya tiene 3 cursos asignados
        if (user.courses.length >= 3) {
            return res.status(400).send({ message: 'User cannot be assigned to more than 3 courses' });
        }

        // Asignar el curso al usuario
        user.courses.push(courseId);
        await user.save();

        return res.send({ message: 'Course assigned successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error assigning course', err });
    }
};

export const listUserCourses = async (req, res) => {
    try {
        let { userId } = req.uid;
        let user = await User.findOne(userId).populate('courses');
        if (!user) return res.status(404).send({ message: 'User not found' })
        const userCourses = user.courses
        return res.send({ message: 'User courses found', userCourses });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error listing user courses', err });
    }
};
