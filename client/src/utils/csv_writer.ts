import {createObjectCsvWriter } from 'csv-writer';
import type {Student} from './csv_parser';
import * as path from 'path';

/**
* Generates a CSV file from the given students array
* @param students - The array of students to generate the CSV file from
* @returns A promise that resolves when the CSV file has been generated
*/
export async function generateCsvFile(students: Student[]): Promise<void> {
    // TODO: Implement the generateCsvFile function

    const csvWriter = createObjectCsvWriter({
        path: "", //TODO: Implement the path (Where will the file be written to?)
        header: [
            //TODO: Implement the headers (16 total) e.g.
            //id: 'firstName', title: 'First Name',
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
