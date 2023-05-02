
export interface ClassDate {
    Id: string;
    StartHour: Date;
    EndHour: Date;
    RoomId: string;
    EntryInSyllabus: string;
    LecturerId?: string;
}

export interface Syllabus {
    Id: string;
    Title: string;
    Description: string;
    References: Array<string>
}


export interface Course {
    Id: string;
    CourseName: string;
    StartingDate: Date;
    EndDate: Date;
    MinimumPassingScore: number;
    MaximumStudents: number;
    IsReady: boolean;
    ClassDates?: Array<ClassDate>;
    Syllabus?: Array<Syllabus>
}

