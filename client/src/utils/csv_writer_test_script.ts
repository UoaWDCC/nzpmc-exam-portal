import {generateCsvFile } from './csv_writer';
import {parseCSV} from './csv_parser';

/**
 * Main function
 * @returns A promise that resolves when the CSV file has been generated
 */
async function main(): Promise<void> {
    try {
        // gets the students array from the csv_parser.ts
        const students = await parseCSV('csv_dummy_template.csv');
        
        // Calls the generateCsvFile function from csv_writer.ts
        await generateCsvFile(students);
    } 
    catch (error) {
        console.error('An error occurred:', error);
    }
  }

main();
