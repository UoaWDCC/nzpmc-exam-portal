import * as fs from 'fs';
import * as path from 'path';
import {parse} from '../../../node_modules/csv-parse';
import { IsDataURI, IsEmail, IsOptional } from 'class-validator'


// Island enums for error checking
enum Island {
    NORTH_ISLAND = 'North Island',
    SOUTH_ISLAND = 'South Island'
  }

// Student object that can be accessed
export type Student = {
  firstName: string;
  middleName: string;
  surname: string;
  email: string;
  yearLevel: number;
  heardFrom: string;
  reasonForTaking: string;
  teacherCode: string;
  teacherName: string;
  teacherEmail: string;
  schoolName: string;
  schoolAddress: string;
  phoneNumber: string;
  teacherCategory: string;
  island: Island;
  city: string;
};


// Main Csv Parser (via Promise)
export async function parseCSV(filename: string): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    // Does some parser voodoo via csv-parse module
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
    });
    // Create a students array that will hold student objects
    const students: Student[] = [];

    parser.on('readable', () => {
      let record; // 1 student at a time
      while ((record = parser.read())) {
        // Take's in all the information from 1 record in CSV (Left to right)
        const {
          // LHS are the CSV headers, RHS are the variables that will hold the values
          StudentFirstName: firstName,
          StudentMiddleName: middleName,
          StudentSurname: surname,
          StudentEmail: email,
          StudentYearLevel: yearLevel,
          HeardFrom: heardFrom,
          ReasonForTaking: reasonForTaking,
          TeacherCode: teacherCode,
          TeacherName: teacherName,
          TeacherEmail: teacherEmail,
          SchoolName: schoolName,
          SchoolAddress: schoolAddress,
          PhoneNumber: phoneNumber,
          TeacherCategory: teacherCategory,
          Island: island,
          City: city,
        } = record;
        // Check if the island was a valid ENUM! (Function can be replicated to check other attributes)
        if (!isValidIsland(toTitleCase(island))) {
          reject(new Error(`Invalid island value: ${island}`));
          return;
        }
        // Check if the year level was valid
        if (!isValidYearLevel(parseInt(yearLevel))) {
          reject(new Error(`Invalid year level: ${yearLevel}`));
          return;
        }
        // Check if the email was valid
        if (!isValidEmail(email)) {
          reject(new Error(`Invalid email: ${email}`));
          return;
        }
        // Check if the phone number was valid
        if (!isValidPhoneNumber(phoneNumber)) {
          reject(new Error(`Invalid phone number: ${phoneNumber}`));
          return;
        }

        // Create the student object instance
        const student: Student = {
          firstName: record.StudentFirstName,
          middleName: record.StudentMiddleName,
          surname: record.StudentSurname,
          email: record.StudentEmail,
          yearLevel: parseInt(record.StudentYearLevel),
          heardFrom: record.HeardFrom,
          reasonForTaking: record.ReasonForTaking,
          teacherCode: record.TeacherCode,
          teacherName: record.TeacherName,
          teacherEmail: record.TeacherEmail,
          schoolName: record.SchoolName,
          schoolAddress: record.SchoolAddress,
          phoneNumber: record.PhoneNumber,
          teacherCategory: record.TeacherCategory,
          island: record.Island as Island,
          city: record.City,
        };
        // Push the student object into the students array
        students.push(student);
      }
    });

    parser.on('error', (err) => {
      reject(err);
    });

    parser.on('end', () => {
      resolve(students);
    });

    // Call the parser
    const input = fs.createReadStream(path.join(__dirname, filename));
    input.pipe(parser);
  });
}


// Error checking functions
function isValidIsland(islandValue: string): boolean {
  return Object.values(Island).includes(islandValue as Island);
}

function isValidYearLevel(yearLevel: number): boolean {
  return yearLevel >= 1 && yearLevel <= 13;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhoneNumber(phoneNumber: string): boolean {
  return phoneNumber.length === 10;
}

// This function will capitalise words if they were passed through in lowercase
function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => {
    return match.toUpperCase();
  });
}



