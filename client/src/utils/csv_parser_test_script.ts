import { parseCSV } from './csv_parser';

async function main() {
  try {
    // parseCSV only works insides async function (old code did not need to be in async function)
    const students = await parseCSV('csv_dummy_template.csv');
    console.log(students);
  } 
  catch (error) {
    console.error(error);
  }
}
main();

// old test script
// parseCSV('csv_dummy_template.csv')
//   .then(students => {
//     students.forEach(student => {
//         console.log(student.getAttributes());
//     });
//     console.log(`There are ${students.length} students in the array.`);

//     return;
//   })
//   .catch(error => {
//     console.error(error);
//   });