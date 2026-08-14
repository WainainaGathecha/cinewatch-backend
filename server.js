import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';


const app = express();
const PORT = 5000;

// Point the native driver to the local file location
const libsqlClient = createClient({
    url: 'file:./prisma/dev.db',
});

// Wrap it inside Prisma's official drive adapter
const adapter = new PrismaLibSql(libsqlClient);

// Hand the adapter down to the prisma client constructor
const prisma = new PrismaClient({adapter});

// Middleware to let the server read incoming JSON data structures
app.use(express.json());

// TEST ROUTE 1: A simple text greeting to verify the server works
app.get('/api/health', (req,res) => {
    res.json({status: "healthy", message: "Cinewatch server is up and running!"});
});

// TEST ROUTE 2: Fetch all movies directly out of the SQLite database
app.get('/api/movies', async (req, res) => {
    try {
        // This is prisma talking to the SQLite file
        const movies = await prisma.movie.findMany();
        res.json(movies);
    } catch (error) {
        res.status(500).json({error: "could not fetch movies from database"});
    }
});

// Start the server and listen on Port 5000
app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`)
});