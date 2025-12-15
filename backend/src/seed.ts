import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db';
import Category from './models/Category';

dotenv.config();

connectDB();

const seedCategories = async () => {
    try {
        await Category.deleteMany();

        const categories = [
            { name: 'Technology' },
            { name: 'Lifestyle' },
            { name: 'Travel' },
            { name: 'Food' },
            { name: 'Health' },
        ];

        await Category.insertMany(categories);
        console.log('Categories seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding categories', error);
        process.exit(1);
    }
};

seedCategories();
