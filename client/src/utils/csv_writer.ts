import {createObjectCsvWriter } from 'csv-writer';
import type {Student} from './csv_parser';
import * as path from 'path';
import type { ObjectStringifierHeader } from 'csv-writer/src/lib/record';

/**
* Generates a CSV file from the given students array
* @param students - The array of students to generate the CSV file from
* @returns A promise that resolves when the CSV file has been generated
*/
export async function generateCsvFile(students: Student[]): Promise<void> {
    const filePath = path.join(__dirname, 'students_output.csv');
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
            {id: 'firstName', title: 'First Name'},
            {id: 'middleName', title: 'Middle Name'}, 
            {id: 'surname', title: 'Last Name'},
            {id: 'email', title: 'Email'},
            {id: 'yearLevel', title: 'Year Level'},
            {id: 'heardFrom', title: 'Heard From'},
            {id: 'reasonForTaking', title: 'Reason for Taking'},
            {id: 'teacherCode', title: 'Teacher Code'},
            {id: 'teacherName', title: 'Teacher Name'},
            {id: 'teacherEmail', title: 'Teacher Email'},
            {id: 'schoolName', title: 'School Name'},
            {id: 'schoolAddress', title: 'School Address'},
            {id: 'phoneNumber', title: 'Phone Number'},
            {id: 'teacherCategory', title: 'Teacher Category'},
            {id: 'island', title: 'Island'},
            {id: 'city', title: 'City'}
        ]
    });

    try {
        // Write the student records to the csv file
        await csvWriter.writeRecords(students);
    }

    catch (err) {
        console.log(err);
    }

}
