'use strict';

import Category from './category.model.js';
import Course from '../course/course.model.js'

export const test = (req, res) => {
    return res.send('Hello world');
};

export const createCategory = async (req, res) => {
    try {
        let data = req.body;
        let category = new Category(data);
        await category.save();
        return res.send({ message: 'Category created successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating category', err });
    }
};

export const updateCategory = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true });
        if (!updatedCategory) {
            return res.status(404).send({ message: 'Category not found or not updated' });
        }
        return res.send({ message: 'Category updated successfully', updatedCategory });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating category' });
    }
};

export const deleteCategory = async(req, res)=>{
    try {
        let { id } = req.params;
        let deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).send({ message: 'Category not found or not deleted' });
        }
        const defaultCategory = await Category.findOne({name: 'Default'})
        if(!defaultCategory){
            const data = {
                name: 'Default',
                description: 'Category for default.'
            };
            let category = new Category(data);
            await category.save();
        }
        const courses = await Course.find({ category: id });
        if(courses.length === 0){
            return res.send({ message: 'The selected category does not have courses. Deleted successfully' });
        }
        await Course.updateMany({ category: id }, { $set: { category: defaultCategory._id } });
        return res.send({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting category' });
    }
};

export const listCategory = async(req, res)=>{
    try {
        const categories = await Category.find();
        if(categories.length === 0) 
            return res.status(404).send({ message: 'No categories found' });
        return res.send({ message: 'Categories found.', categories });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error listing categories' });
    }
};