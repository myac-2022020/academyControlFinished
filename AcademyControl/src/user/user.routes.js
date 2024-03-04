'use strict'

import express from 'express'
import { validateJwt, isTeacher} from '../middlewares/validate.jwt.js'
import { test, register, login, update, deleteU, assignCourse, listUserCourses } from './user.controller.js'

const api = express.Router()

api.get('/test', [validateJwt, isTeacher], test)
api.post('/register', register)
api.post('/login', login)
api.put('/update/:id', [validateJwt], update)
api.delete('/delete/:id', [validateJwt], deleteU)
api.post('/assign/:id', [validateJwt], assignCourse)
api.post('/list', [validateJwt], listUserCourses)

export default api