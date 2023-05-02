import { Op } from "sequelize";
import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import * as AppModel from "../../model/mainModels"

type LecturerSchemaModel = Model<AppModel.Lecturer.Lecturer>

export interface LecturerInterface {
    Schema: ModelStatic<LecturerSchemaModel>
    insert: (lecturer: Omit<AppModel.Lecturer.Lecturer, "Id">) => Promise<AppModel.Lecturer.Lecturer>
    searchById: (id: string) => Promise<AppModel.Lecturer.Lecturer | undefined>
    delete: (lecturerId: string) => Promise<boolean>
  
 

}

export async function createLecturerTable(sequelize: Sequelize): Promise<LecturerInterface> {
    const LecturerSchema = sequelize.define<LecturerSchemaModel>("Lecturer", {
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

    await LecturerSchema.sync();

    return {
        Schema: LecturerSchema,
        async insert(lecturer) {
            const result = await LecturerSchema.create(lecturer as AppModel.Lecturer.Lecturer)
            return result.toJSON();
        },
        async searchById(id: string) {
            const result = await LecturerSchema.findByPk(id)
            return result?.toJSON();
        },
        async delete(lecturerId) {
            const result = await LecturerSchema.destroy({
                where: {
                    Id: lecturerId
                }
            })
            return result === 1;
        }
       
    };
}
