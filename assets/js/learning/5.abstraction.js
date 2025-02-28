class Phone {
  battery = 0;
  screen = 0;
  signal = 0;

  constructor(name = "") {
    this.name = name;
  }

  // connectWifi() {
  //   console.log("this phone has signal :", this.signal);
  //   console.log("this phone has battery :", this.battery);
  //   if (this.signal > 50 && this.battery > 20) {
  //     this.successConnectWifi();
  //     console.log("Connected to Wifi");
  //   } else {
  //     console.log("Failed to connect to Wifi");
  //   }
  }
//   successConnectWifi() {
//     console.log("Success to connect to Wifi");
//   }
//   failedConnectWifi() {
//     console.log("Failed to connect to Wifi");
//   }
// }

const iphone = new Phone("iPhone 16 Pro Max");
iphone.signal = 30;
iphone.battery = 80;

iphone.connectWifi();
