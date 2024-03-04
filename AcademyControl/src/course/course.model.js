'use strict';

import { Schema, model } from 'mongoose';

const courseSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: Schema.ObjectId,
        ref: 'category',
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    }
});

export default model ('course', courseSchema)