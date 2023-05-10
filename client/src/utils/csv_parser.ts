import * as fs from 'fs';
import * as path from 'path';
import {parse} from '../../node_modules/csv-parse';

// Island enums for error checking
enum Island {
    NORTH_ISLAND = 'North Island',
    SOUTH_ISLAND = 'South Island'
  }

// Student object that can be accessed
export class Student {
  // Simple constructor that takes in all the CSV headers (taken from registration_5's headers)
  constructor(
    public firstName: string,
    public middleName: string,
    public surname: string,
    public email: string,
    public yearLevel: number,
    public heardFrom: string,
    public reasonForTaking: string,
    public teacherCode: string,
    public teacherName: string,
    public teacherEmail: string,
    public schoolName: string,
    public schoolAddress: string,
    public phoneNumber: string,
    public teacherCategory: string,
    public island: Island, // Use enum
    public city: string,
  ) {}
  // Public method that can be used on an instance of a student object
  public getAttributes() {
    return [
      this.firstName,
      this.middleName,
      this.surname,
      this.email,
      this.yearLevel,
      this.heardFrom,
      this.reasonForTaking,
      this.teacherCode,
      this.teacherName,
      this.teacherEmail,
      this.schoolName,
      this.schoolAddress,
      this.phoneNumber,
      this.teacherCategory,
      this.island,
      this.city,
    ];
  }
}
// Create a students array that will hold student objects


// Main Csv Parser (via Promise)
export async function parseCSV(filename: string): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    // Does some parser voodoo via csv-parse module
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
    });
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
        const student = new Student(
          toTitleCase(firstName),
          toTitleCase(middleName),
          toTitleCase(surname),
          email,
          parseInt(yearLevel),
          heardFrom,
          reasonForTaking,
          teacherCode,
          toTitleCase(teacherName),
          teacherEmail,
          schoolName,
          schoolAddress,
          phoneNumber, //<--- Could this be formatted?
          teacherCategory,
          toTitleCase(island) as Island,
          city,
        );
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
  return email.includes('@');
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


