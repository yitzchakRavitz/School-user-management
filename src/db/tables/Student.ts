import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import * as AppModel from "../../model/mainModels"

type StudentSchemaModel = Model<AppModel.Student.Student>

export interface StudentInterface {
    Schema: ModelStatic<StudentSchemaModel>
    insert: (student: Omit<AppModel.Student.Student, "Id">) => Promise<AppModel.Student.Student>
    search: (id: string) => Promise<AppModel.Student.Student | undefined>
    delete: (studentId: string) => Promise<boolean>
}

export async function createStudentTable(sequelize: Sequelize): Promise<StudentInterface> {
    const StudentSchema = sequelize.define<StudentSchemaModel>("Student", {
        Id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        Name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        PhoneNumber: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        Email: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        schema: "college",
        createdAt: false,
    })

    await StudentSchema.sync();

    return {
        Schema: StudentSchema,
        async insert(student) {
            const result = await StudentSchema.create(student as AppModel.Student.Student)
            return result.toJSON();
        },
        async search(id: string) {
            const result = await StudentSchema.findByPk(id)
            return result?.toJSON();
        },
        async delete(studentId) {
            const result = await StudentSchema.destroy({
                where: {
                    Id: studentId
                }
            })
            return result === 1;
        },
    };
}
