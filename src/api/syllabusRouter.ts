import express, { Request, Response } from "express"
import { DB } from "../db"
import { isUUID } from "./validation";



export function createSyllabusRoute(db: DB) {

    const syllabusRouter = express.Router();
    //This API add a new Syllabus
    syllabusRouter.post('/', async (req: Request, res: Response) => {
        const syllabus = await db.Syllabus.insert(req.body);
        if (!syllabus) {
            res.status(404).json({ syllabus: 'not added a new syllabus' });
        }
        else {
            res.json({ status: 'add a new syllabus succeeded !', syllabus });
        }
        console.log(syllabus);
    });


    return syllabusRouter;
}