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

// function multipleProcess() {
//   proses1()
//     .then(() => proses2())
//     .then(() => proses3())
//     .then(() => {
//       console.log("All processes completed");
//     })
//     .catch((error) => {
//       console.error("An error occurred:", error);
//     });
// }
