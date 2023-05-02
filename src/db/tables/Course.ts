
import { Op } from "sequelize";
import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import * as AppModel from "../../model/mainModels"
import { LecturerInterface } from "./Lecturer";


type Course = Omit<AppModel.Course.Course, "ClassDates" | "Syllabus">
type CourseSchemaModel = Model<Course>

export interface CourseInterface {
    Schema: ModelStatic<CourseSchemaModel>
    insert: (course: Partial<Course>) => Promise<Course>
    delete: (courseId: string) => Promise<boolean>
    searchById: (id: string) => Promise<AppModel.Course.Course | undefined>
    searchByName: (course_name: string) => Promise<AppModel.Course.Course | undefined>
    updateCourseByName: (course_name: string, updates: Partial<AppModel.Course.Course>) => Promise<AppModel.Course.Course | undefined>
    getLecturerWithCurrentCourses: (lecturerId: string) => Promise<string>
    getLecturerWithBetweenDates: (lecturerId: string, startDate: Date, endDate: Date) => Promise<string | undefined>
    addCourseToLecturer: (lecturerId: string, courseId: string) => Promise<void | undefined>
    addLectureDataEntryToCourse: (courseId: string, updates: Pick<Course, "StartingDate" | "EndDate">) => Promise<AppModel.Course.Course | undefined>
    deleteLectureDataEntryFromCourse: (courseId: string, updates: Pick<Course, "StartingDate" | "EndDate">) => Promise<AppModel.Course.Course | undefined>
    updateIsReady: (courseId: string) => Promise<[affectedCount: number]>
}

export async function createCourseTable(sequelize: Sequelize, Lecturer: LecturerInterface["Schema"]): Promise<CourseInterface> {
    const CourseSchema = sequelize.define<CourseSchemaModel>("Course", {
        Id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        CourseName: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        StartingDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        EndDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        MinimumPassingScore: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        MaximumStudents: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        IsReady: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    }, {
        schema: "college",
        createdAt: false,
    })
    Lecturer.hasMany(CourseSchema, { foreignKey: 'LecturerId' });
    CourseSchema.belongsTo(Lecturer, { foreignKey: 'LecturerId' });
    await CourseSchema.sync();

    return {
        Schema: CourseSchema,
        async insert(course) {
            const result = await CourseSchema.create(course as Course)
            return result.toJSON();
        },
        async delete(courseId) {
            const result = await CourseSchema.destroy({
                cascade: true,
                where: {
                    Id: courseId
                }
            })
            return result === 1;
        },
        async searchById(id: string) {
            const result = await CourseSchema.findByPk(id)
            return result?.toJSON();
        },
        async searchByName(course_name: string) {
            const result = await CourseSchema.findOne({
                where: { CourseName: course_name }
            })
            return result?.toJSON();
        },
        async updateCourseByName(course_name: string, updates: Partial<AppModel.Course.Course>) {
            try {
                const [rowsAffected, [updatedCourse]] = await CourseSchema.update(updates, {
                    where: {
                        CourseName: course_name,
                    },
                    returning: true, // Return the updated record
                    //   plain: true, // Return only the updated record (without metadata)
                });
                if (rowsAffected > 0) {
                    return updatedCourse.toJSON() as any
                } else {
                    return undefined;
                }
            } catch (error) {
                console.error(error);
                return undefined;
            }
        },
        async addLectureDataEntryToCourse(courseId, updates) {
            try {
                const [rowsAffected, [updatedCourse]] = await CourseSchema.update(updates, {
                    where: {
                        Id: courseId,
                    },
                    returning: true, // Return the updated record
                    //   plain: true, // Return only the updated record (without metadata)
                });
                if (rowsAffected > 0) {
                    return updatedCourse.toJSON() as any
                } else {
                    return undefined;
                }
            } catch (error) {
                console.error(error);
                return undefined;
            }
        },
        async deleteLectureDataEntryFromCourse(courseId, updates) {
            try {
                const { StartingDate, EndDate } = updates;
                console.log(`StartingDate${StartingDate} EndDate ${EndDate} in the Function before`);

                const [rowsAffected, [updatedCourse]] = await CourseSchema.update(
                    { StartingDate, EndDate },
                    {
                        where: { Id: courseId },
                        returning: true, // Return the updated record
                    }
                );
                console.log(`StartingDate${StartingDate} EndDate ${EndDate} in the Function after !!!!`);
                if (rowsAffected > 0) {
                    return updatedCourse.toJSON() as AppModel.Course.Course;
                } else {
                    return undefined;
                }
            } catch (error) {
                console.error(error);
                return undefined;
            }
        },
        async addCourseToLecturer(lecturerId: string, courseId: string) {

            const course = await CourseSchema.findByPk(courseId);
            if (!course) {
                throw new Error(`Course with ID ${courseId} not found`);
            }

            const lecturer = await Lecturer.findByPk(lecturerId);
            if (!lecturer) {
                throw new Error(`Student with ID ${lecturerId} not found`);
            }

            await (lecturer as any).addCourse(course);

        },
        async getLecturerWithCurrentCourses(lecturerId) {
            const today = new Date();
            const result = await Lecturer.findOne({
                where: {
                    Id: lecturerId,
                },
                attributes: ['Name', 'Id'],
                include: [
                    {
                        model: CourseSchema,
                        attributes: ['CourseName'],

                        where: {
                            EndDate: { [Op.gte]: today },
                        }
                    },
                ]
            });
            if (!result) {
                throw new Error('Course not found');
            }
            const data: any = result.toJSON();
            return data;
        },
        async getLecturerWithBetweenDates(lecturerId, startDate, endDate) {
            const result = await Lecturer.findOne({
                where: {
                    Id: lecturerId,
                },
                attributes: ['Name', 'Id'],
                include: [
                    {
                        model: CourseSchema,
                        attributes: ['CourseName'],

                        where: {
                            StartingDate: { [Op.between]: [startDate, endDate] },
                            EndDate: { [Op.between]: [startDate, endDate] },
                        }
                    },
                ]
            });
            if (!result) {
                throw new Error('Course not found');
            }
            const data: any = result.toJSON();
            return data;
        },
        async updateIsReady(courseId){
            const result = await CourseSchema.update(
                { IsReady: true},
               { where: {
                    Id: courseId
                }}
            )
            return result;
         
        },
    }
}
