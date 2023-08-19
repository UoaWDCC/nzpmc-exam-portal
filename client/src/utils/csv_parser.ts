import { parse } from 'papaparse'

// Island enums for error checking
enum Island {
  NORTH_ISLAND = 'North Island',
  SOUTH_ISLAND = 'South Island'
}

// TODO: This type will eventually be replaced by a DTO class as defined in common
export type Student = {
  firstName: string
  middleName: string
  surname: string
  email: string
  yearLevel: number
  heardFrom: string
  reasonForTaking: string
  teacherCode: string
  teacherName: string
  teacherEmail: string
  schoolName: string
  schoolAddress: string
  phoneNumber: string
  teacherCategory: string
  island: Island
  city: string
}

export async function parseCSVPapaparse(file) {
  return new Promise<Student[]>((resolve, reject) => {
    const students: Student[] = []

    const reader = new FileReader()

    reader.onload = () => {
      const csvData = reader.result
      const parsedData = parse(csvData, { header: true }).data

      parsedData.forEach((record) => {
        const {
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
          City: city
        } = record

        //TODO make error checking less harsh
        /*
        if (island && !isValidIsland(toTitleCase(island))) {
          reject(new Error(`Invalid island value: ${island}`))
          return
        }
        // Check if the year level was valid
        if (yearLevel && !isValidYearLevel(parseInt(yearLevel))) {
          reject(new Error(`Invalid year level: ${yearLevel}`))
          return
        }
        // Check if the student email was valid
        if (email && isValidEmail(email)) {
          reject(new Error(`Invalid student email: ${email}`))
          return
        }
        // Check if the teacher email was valid
        if (teacherEmail && !isValidEmail(teacherEmail)) {
          reject(new Error(`Invalid teacher email: ${teacherEmail}`))
          return
        }
        // Check if the phone number was valid
        if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
          reject(new Error(`Invalid phone number: ${phoneNumber}`))
          return
        }
    */

        if (!email) return
        // Create the student object instance
        const student: Student = {
          firstName: toTitleCase(firstName),
          middleName: toTitleCase(middleName),
          surname: toTitleCase(surname),
          email: email,
          yearLevel: parseInt(yearLevel),
          heardFrom: heardFrom,
          reasonForTaking: reasonForTaking,
          teacherCode: teacherCode,
          teacherName: toTitleCase(teacherName),
          teacherEmail: teacherEmail,
          schoolName: toTitleCase(schoolName),
          schoolAddress: schoolAddress,
          phoneNumber: phoneNumber,
          teacherCategory: toTitleCase(teacherCategory),
          island: toTitleCase(island) as Island,
          city: toTitleCase(city)
        }

        students.push(student)
      })

      resolve(students)
    }

    reader.onerror = (e) => {
      console.error(e)
      reject(new Error('Failed to read the file.'))
    }

    reader.readAsText(file)
  })
}

/*
// Main Csv Parser (via Promise)
export async function parseCSV(filename: string): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    // Does some parser voodoo via csv-parse module
    const parser = parse({
      columns: true,
      skip_empty_lines: true
    })
    // Create a students array that will hold student objects
    const students: Student[] = []

    parser.on('readable', () => {
      let record // 1 student at a time
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
          City: city
        } = record
        // Check if the island was a valid ENUM! (Function can be replicated to check other attributes)
        if (!isValidIsland(toTitleCase(island))) {
          reject(new Error(`Invalid island value: ${island}`))
          return
        }
        // Check if the year level was valid
        if (!isValidYearLevel(parseInt(yearLevel))) {
          reject(new Error(`Invalid year level: ${yearLevel}`))
          return
        }
        // Check if the student email was valid
        if (!isValidEmail(email)) {
          reject(new Error(`Invalid student email: ${email}`))
          return
        }
        // Check if the teacher email was valid
        if (!isValidEmail(teacherEmail)) {
          reject(new Error(`Invalid teacher email: ${teacherEmail}`))
          return
        }
        // Check if the phone number was valid
        if (!isValidPhoneNumber(phoneNumber)) {
          reject(new Error(`Invalid phone number: ${phoneNumber}`))
          return
        }

        // Create the student object instance
        const student: Student = {
          firstName: toTitleCase(record.StudentFirstName),
          middleName: toTitleCase(record.StudentMiddleName),
          surname: toTitleCase(record.StudentSurname),
          email: record.StudentEmail,
          yearLevel: parseInt(record.StudentYearLevel),
          heardFrom: record.HeardFrom,
          reasonForTaking: record.ReasonForTaking,
          teacherCode: record.TeacherCode,
          teacherName: toTitleCase(record.TeacherName),
          teacherEmail: record.TeacherEmail,
          schoolName: toTitleCase(record.SchoolName),
          schoolAddress: record.SchoolAddress,
          phoneNumber: record.PhoneNumber,
          teacherCategory: toTitleCase(record.TeacherCategory),
          island: toTitleCase(record.Island) as Island,
          city: toTitleCase(record.City)
        }
        // Push the student object into the students array
        students.push(student)
      }
    })

    parser.on('error', (err) => {
      reject(err)
    })

    parser.on('end', () => {
      resolve(students)
    })

    // Call the parser
    const input = fs.createReadStream(path.join(__dirname, filename))
    input.pipe(parser)
  })
}
*/

// Error checking functions
// function isValidIsland(islandValue: string): boolean {
//   return Object.values(Island).includes(islandValue as Island)
// }

// function isValidYearLevel(yearLevel: number): boolean {
//   return yearLevel >= 1 && yearLevel <= 13
// }

// function isValidEmail(email: string): boolean {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//   return emailRegex.test(email)
// }

// function isValidPhoneNumber(phoneNumber: string): boolean {
//   return phoneNumber.length === 10
// }

// This function will capitalise words if they were passed through in lowercase
function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => {
    return match.toUpperCase()
  })
}
