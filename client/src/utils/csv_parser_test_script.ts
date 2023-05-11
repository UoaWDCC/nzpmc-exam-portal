import { parseCSV, Student} from './csv_parser';

async function main() {
  try {
    // parseCSV only works insides async function (old code did not need to be in async function)
    const students = await parseCSV('csv_dummy_template.csv');
    //console.log(students);
    students.forEach(logStudentAttributes);
  } 
  catch (error) {
    console.error(error);
  }
}

function logStudentAttributes(student: Student) {
  Object.entries(student).forEach(([key, value]) => {
    // back tick is used to format a variable inside of text
    console.log(`${key}:`, value);
  });
  console.log('--------------------------');
}

main();