import express, { Request, Response } from "express"
import { DB } from '../db'
import { isUUID } from "./validation";

export function createClassDateRoute(db: DB) {
    const classDateRouter = express.Router();
    classDateRouter.post('/', async (req: Request, res: Response) => {
        const classDate = await db.ClassDate.insert(req.body);
        if (!classDate) {
            res.status(404).json({ course: "Not Found" })
        }
        res.json(classDate);
    });
    
    classDateRouter.post('/:classDateId/lecturer/:lecturerId', async (req: Request, res: Response) => {
        const { classDateId, lecturerId } = req.params;

        if (!isUUID(classDateId)) {
            return res.status(400).json({ error: 'Invalid classDateId parameter' });
        }
        if (!isUUID(lecturerId)) {
            return res.status(400).json({ error: 'Invalid lecturerId parameter' });
        }
        const classDate: any = await db.ClassDate.addClassDateToLecturer(lecturerId, classDateId);
        if (!classDate) {
            res.status(404).json({ status: 'not found' });
        }
        else {
            res.status(200).json({ status: 'lecturer adding to classDate is success !' });
        }
        console.log(classDate);

    });
    classDateRouter.post('/:classDateId/course/:courseId', async (req: Request, res: Response) => {
        const { classDateId, courseId } = req.params;

        if (!isUUID(classDateId)) {
            return res.status(400).json({ error: 'Invalid classDateId parameter' });
        }
        if (!isUUID(courseId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }
        const classDate: any = await db.ClassDate.addClassDateToCourse(courseId, classDateId);
        if (!classDate) {
            res.status(404).json({ status: 'not found' });
        }
        else {
            res.status(200).json({ status: 'course adding to classDate is success !' });
        }
        console.log(classDate);

    });

    return classDateRouter;
}