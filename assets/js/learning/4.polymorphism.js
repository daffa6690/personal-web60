// class Animal {
//   speak() {
//     console.log("please define either cat or duck");
//   }
// }

// class Duck extends Animal {
//   speak() {
//     console.log("quack quack");
//   }
// }

// class cat extends Animal {
//   speak() {
//     console.log("meow");
//   }
// }

const donald = new Duck();
donald.speak(); // quack quack

const tom = new cat();
tom.speak(); // meow

const animal = new Animal();
animal.speak(); // cannot speak
