//  synchronous
// console.log("Start");

// function getData() {
//   const data = "data berhasil diambil";
//     return data;
// }

console.log("Start");

// function getData() {
//   const data = "data berhasil diambil";
//   console.log(data);
// }
// function fetchDataWithTime() {
//     setTimeout(getData, 2000);
// }
// fetchDataWithTime();

// console.log("End");

// function sayEnd() {
//   console.log("End");
// }, 5000;

// function greeting(name, callback) {
//   console.log("Hi", name);
//   callback();
// }

// greeting("Daffa", sayEnd);

// function proses1() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log("Proses 1");
//       resolve(1);
//     }, 5000);
//   });
// }
// function proses2() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log("Proses 2");
//       resolve(2);
//     }, 4000);
//   });
// }
// function proses3() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log("Proses 3");
//       resolve(3);
//     }, 3000);
//   });
// }

// setTimeout(() => {
//   proses1();
//   setTimeout(() => {
//   proses2();
//   setTimeout(() => {
//   proses3();

// }, 3000); }, 2000); }, 1000);

// asynchronous
async function multipleProcess() {
  await proses1();
  await proses2();
  await proses3();
}

multipleProcess();
