import { parseCsv } from './csv_parser';

parseCsv('csv_dummy_template.csv')
  .then(students => {
    students.forEach(student => {
        console.log(student.getAttributes());
    });
    console.log(`There are ${students.length} students in the array.`);

    return;
  })
  .catch(error => {
    console.error(error);
  });