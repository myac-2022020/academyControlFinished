'use strict'

import { Router } from 'express'
import { createCategory, deleteCategory, listCategory, test, updateCategory } from './category.controller.js'
import { isTeacher, validateJwt } from '../middlewares/validate.jwt.js'

const api = Router()

api.get('/test',[validateJwt, isTeacher], test)
api.post('/create',[validateJwt, isTeacher], createCategory)
api.put('/update/:id',[validateJwt, isTeacher], updateCategory)
api.delete('/delete/:id',[validateJwt, isTeacher], deleteCategory)
api.get('/list',[validateJwt], listCategory)

export default api