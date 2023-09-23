const CONTROLPOINTS = {
  C03: "246.082 0 10.148",
  C10: "97.004 0 34.781",
  C11: "230.357 0 45.488",
  C13: "1.129 0 125.546",
  C14: "94.117 0 111.064",
  C15: "224.199 0 118.366",
  C17: "7.837 0 241.218",
  C18: "82.564 0 247.903",
  C19: "204.992 0 267.374",
  C78: "165.198 0 237.045",
  C09: "10.264 0 17.102",
  CK03: "49.849 0 18.593",
  CK04: "76.598 0 61.351",
  T00: "220.342 0 244.26",
  T00_1: "167.003 0 237.243",
  T00_2: "125.748 0 234.44",
  T01: "222.958 0 206.344",
  T01_1: "226.525 0 152.897",
  T02: "231.589 0 100.894",
  T03: "224.192 0 30.559",
  T04: "104.054 0 20.506",
  T05: "79.469 0 165.21",
  T06: "88.478 0 228.16",
  T07: "28.15 0 26.56",
  T08: "20.724 0 92.20",
  T10: "91.977 0 186.10",
  T12: "124.867 0 199.12",
  T13: "169.185 0 203.26",
  T15: "17.426 0 135.53",
  T16: "32.575 0 111.30",
  T17: "84.087 0 107.96",
  T18: "87.197 0 73.36",
  T19: "23.483 0 58.404",
  T20: "73.593 0 22.677",
  T21: "145.759 0 23.58",
  T22: "180.725 0 27.66",
  T99: "19.226 0 158.509",
};
const MANHOLES = readJsonFile("./pointData/zw.json");
const TREES = readJsonFile("./pointData/tree.json");
const STREETLIGHTS = readJsonFile("./pointData/streetlight.json");

let isPress = false;
let isStreetlight = false;
let moveInterval = null;
let jumpInterval = null;
let downInterval = null;

window.onload = () => {
  document.getElementById('clickme').onclick = function(e) {
    // e = Mouse click event.
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left; //x position within the element.
    let y = e.clientY - rect.top;  //y position within the element.
    let ax = -50+y*7/9 -180.730 ;
    let az = 350-x*7/9-50 - 27.659;
    console.log(x, ax)
    const cam = document.querySelector("#camera");
    cam.setAttribute("position", `${ax} ${cam.getAttribute("position").y} ${az}`);
  }
  AFRAME.registerComponent("resize", {
    schema: {
      axis: {
        type: "string",
        default: "x",
      },
      value: {
        type: "number",
        default: 1,
      },
    },
    init: function () {
      let el = this.el;
      let model = el.sceneEl.object3D;
      el.addEventListener("model-loaded", function (e) {
        let mbox = new THREE.Box3().setFromObject(model);
        console.log(mbox.min);
        //Get the model size(scale is not equal to aframe world)
        let x = mbox.max.x - mbox.min.x;
        let y = mbox.max.y - mbox.min.y;
        let z = mbox.max.z - mbox.min.z;

        // let scale;
        // if(data.axis === 'x') {
        //   scale = data.value / x;
        // }
        // else if(data.axis === 'y') {
        //   scale = data.value / y;
        // }
        // else {
        //   scale = data.value / z;
        // }
        // el.setAttribute('scale', scale + ' ' + scale + ' ' + scale);
      });
    },
  });
  AFRAME.registerComponent("showinfo", {
    schema: {
      coordE: {type: "number", default: NaN},
      coordN: {type: "number", default: NaN},
      itemName: { type: "string", default: "" },
      height: { type: "number", default: NaN },
      elevation: { type: "number", default: NaN },
      chestRadius: { type: "number", default: NaN },
      typeName: { type: "string", default: "" },
      terrainID: { type: "string", default: "0000000" },
    },
    init: function () {
      let controlBtn = this.el;
      controlBtn.addEventListener("click", (ee) => {
        const infoText = {
          position: "Position: ",
          itemName: "Item Name: ",
          typeName: "Type Name: ",
          terrainID: "Terrain ID: ",
          height: "Height: ",
          elevation: "Elevation: ",
          chestRadius: "Chest Diameter: ",
        };
        let att = ee.srcElement;
        const infoArr = [];
        let attPos = att.getAttribute("position");
        infoText.position += `E: ${String(
          Math.round(1000*(this.data.coordE))/1000
        )}, N: ${String(-1 * Math.round(1000*(this.data.coordN))/1000)}`; //TWD97 coordinate(3826)
        infoArr.push(infoText.position);
        infoText.itemName += this.data.itemName;
        infoArr.push(infoText.itemName);
        infoText.terrainID += this.data.terrainID;
        infoArr.push(infoText.terrainID);
        if((this.data.typeName && this.data.chestRadius) && Number(this.data.chestRadius) >= 10){
          infoText.typeName += this.data.typeName;
          infoArr.push(infoText.typeName);
        }
        infoText.elevation += String(Math.round(1000*(Number(this.data.elevation)))/1000) + ' m';
        infoArr.push(infoText.elevation);
        if(this.data.height){
          infoText.height += String(Math.round(1000*(Number(this.data.height)))/1000) + ' m';
          infoArr.push(infoText.height);
        }
        if(this.data.chestRadius){
          infoText.chestRadius += String(Math.round(1000*(Number(this.data.chestRadius)))/1000) + ' cm';
          infoArr.push(infoText.chestRadius);
        } 

        if (document.querySelector(".tarInfo")) 
          document.querySelector(".tarInfo").remove();
        
        createInfoBoard(attPos, infoArr);
      });
    },
  });

  // Create Grids
  // let gridEnti = document.createElement("a-entity");
  // document.querySelector("a-scene").appendChild(gridEnti);
  // gridEnti.setAttribute("id", "gridEnti");
  // for (let i = 0; i <= 250 / 5; i++) {
  //   let gridLines = document.createElement("a-box");
  //   document.querySelector("#gridEnti").appendChild(gridLines);
  //   gridLines.setAttribute("position", `${i * 5} 0 150`);
  //   gridLines.setAttribute(`width`, 0.025);
  //   gridLines.setAttribute(`height`, 0.025);
  //   gridLines.setAttribute(`depth`, 300);
  //   gridLines.setAttribute(`color`, "red");
  // }
  // for (let i = 0; i <= 300 / 5; i++) {
  //   let gridLines = document.createElement("a-box");
  //   document.querySelector("#gridEnti").appendChild(gridLines);
  //   gridLines.setAttribute("position", `125 0 ${i * 5}`);
  //   gridLines.setAttribute(`width`, 250);
  //   gridLines.setAttribute(`height`, 0.025);
  //   gridLines.setAttribute(`depth`, 0.025);
  //   gridLines.setAttribute(`color`, "red");
  // }

  addControlPoints(CONTROLPOINTS);

  let btnL = document.querySelector("#btnL");
  let btnR = document.querySelector("#btnR");
  let btnF = document.querySelector("#btnF");
  let btnB = document.querySelector("#btnB");

  btnF.addEventListener("mousedown", () => {
    isPress = true;
    if (isPress) {
      moveInterval = setInterval(() => {
        changeCamPos("FORWARD");
      }, 10);
    }
  });
  btnB.addEventListener("mousedown", () => {
    isPress = true;
    if (isPress) {
      moveInterval = setInterval(() => {
        changeCamPos("BACKWARD");
      }, 10);
    }
  });
  btnL.addEventListener("mousedown", () => {
    isPress = true;
    if (isPress) {
      moveInterval = setInterval(() => {
        changeCamPos("LEFT");
      }, 10);
    }
  });
  btnR.addEventListener("mousedown", () => {
    isPress = true;
    if (isPress) {
      moveInterval = setInterval(() => {
        changeCamPos("RIGHT");
      }, 10);
    }
  });
  btnF.addEventListener("mouseup", () => {
    isPress = false;
    clearInterval(moveInterval);
  });
  btnB.addEventListener("mouseup", () => {
    isPress = false;
    clearInterval(moveInterval);
  });
  btnL.addEventListener("mouseup", () => {
    isPress = false;
    clearInterval(moveInterval);
  });
  btnR.addEventListener("mouseup", () => {
    isPress = false;
    clearInterval(moveInterval);
  });

  window.addEventListener(
    "keydown",
    function (e) {
      if (e.code == "Space") {
        if (!jumpInterval) {
          jumpInterval = setInterval(changeCamPos, 1, "JUMP");

          setTimeout(() => {
            clearInterval(jumpInterval);
            jumpInterval = null;
            downInterval = setInterval(changeCamPos, 1, "DOWN");
            setTimeout(() => {
              clearInterval(downInterval);
            }, 250);
          }, 250);
        }
      }
    },
    false
  );

  let modelsEntiGroup = document.querySelector("#models");
  addModels(MANHOLES, "manhole", 0.008, modelsEntiGroup);
  addModels(TREES, "leaftree", 1, modelsEntiGroup);
  addModels(STREETLIGHTS, "streetlight", 1, modelsEntiGroup);
  // addModels(new Array(30), "cloud", 1, modelsEntiGroup);

  /*click window to get the camera position in TWD97*/
  // window.addEventListener("click", () => {
  //   let pos = document.getElementById("camera").getAttribute("position");
  //   console.log("E: " + String(Number(pos["x"]) + 169850 + 180.73));
  //   console.log("N: " + String(-1 * Number(pos["z"]) + 2544350 - 27.659));
  // });
  /*click window to get the camera position in Local*/
  // window.addEventListener("click", () => {
  //   let pos = document.getElementById("camera").getAttribute("position");
  //   console.log("E: " + String(Number(pos["x"]) + 180.73));
  //   console.log("N: " + String( Number(pos["z"]) + 27.659));
  // });
};

function createInfoBoard(itemPos, textArr) {
  let userRot = getCamRot();
  let enti = document.createElement("a-entity");
  document.querySelector("a-scene").appendChild(enti);
  enti.setAttribute("class", "tarInfo");
  enti.setAttribute("color", "white");
  enti.setAttribute("position", {
    x: itemPos["x"] -2*Math.cos(Math.PI*userRot[1]/180),
    y: itemPos["y"] + 2,
    z: itemPos["z"] +2*Math.sin(Math.PI*userRot[1]/180),
  });
  
  enti.setAttribute("rotation", { x: 0, y: userRot[1], z: 0 });
  let box = document.createElement("a-box");
  document.querySelector(".tarInfo").appendChild(box);
  box.setAttribute("color", "white");
  box.setAttribute("height", 2);
  box.setAttribute("width", 3);
  box.setAttribute("depth", "0.025");

  let textPrefix = "anchor: center; width: 2; color: black; value: ";
  let text = document.createElement("a-text");
  for (let item of textArr) {
    textPrefix += item + "\n";
  }
  document.querySelector(".tarInfo").appendChild(text);
  text.setAttribute("position", { x: 0, y: 0, z: 0.025 });
  text.setAttribute("width", 30);
  text.setAttribute("text", textPrefix);
  text.setAttribute("wrap-count", 20);
}

function getCamRot() {
  // return an array contains rotation of x, y, z in order
  const rotation = document.querySelector("#camera").getAttribute("rotation");
  const rotarr = [];

  for (let [key, val] of Object.entries(rotation)) {
    rotarr.push(val);
  }

  return rotarr;
}

function changeCamPos(direction) {
  const cam = document.querySelector("#camera");
  const camPos = cam.getAttribute("position");
  const posarr = []; //x, y, z
  const camRotY = (Math.PI * getCamRot()[1]) / 180; //in degree

  for (let [key, val] of Object.entries(camPos)) {
    posarr.push(val);
  }

  const DELTA = 0.01;

  switch (direction) {
    case "FORWARD":
      cam.setAttribute("look-controls", "enabled", false);
      cam.setAttribute("position", {
        x: posarr[0] - DELTA * Math.sin(camRotY),
        y: posarr[1],
        z: posarr[2] - DELTA * Math.cos(camRotY),
      });
      cam.setAttribute("look-controls", "enabled", true);
      break;
    case "BACKWARD":
      cam.setAttribute("look-controls", "enabled", false);
      cam.setAttribute("position", {
        x: posarr[0] + DELTA * Math.sin(camRotY),
        y: posarr[1],
        z: posarr[2] + DELTA * Math.cos(camRotY),
      });
      cam.setAttribute("look-controls", "enabled", true);
      break;
    case "LEFT":
      cam.setAttribute("look-controls", "enabled", false);
      cam.setAttribute("position", {
        x: posarr[0] - DELTA * Math.cos(camRotY),
        y: posarr[1],
        z: posarr[2] + DELTA * Math.sin(camRotY),
      });
      cam.setAttribute("look-controls", "enabled", true);
      break;
    case "RIGHT":
      cam.setAttribute("look-controls", "enabled", false);
      cam.setAttribute("position", {
        x: posarr[0] + DELTA * Math.cos(camRotY),
        y: posarr[1],
        z: posarr[2] - DELTA * Math.sin(camRotY),
      });
      cam.setAttribute("look-controls", "enabled", true);
      break;
    case "JUMP":
      cam.setAttribute("look-controls", "enabled", false);
      cam.setAttribute("position", {
        x: posarr[0],
        y: posarr[1] + 0.03,
        z: posarr[2],
      });
      cam.setAttribute("look-controls", "enabled", true);
      break;
    case "DOWN":
      cam.setAttribute("look-controls", "enabled", false);
      cam.setAttribute("position", {
        x: posarr[0],
        y: posarr[1] - 0.03,
        z: posarr[2],
      });
      cam.setAttribute("look-controls", "enabled", true);
      break;
  }
}

function addControlPoints(CTP) {
  let enti = document.createElement("a-entity");
  document.querySelector("a-scene").appendChild(enti);
  enti.setAttribute("id", "ctpEntis");
  for (let [key, val] of Object.entries(CTP)) {
    let ctpEnti = document.createElement("a-cylinder");
    document.querySelector("#ctpEntis").appendChild(ctpEnti);
    ctpEnti.setAttribute("id", key);
    ctpEnti.setAttribute("position", val);
    ctpEnti.setAttribute("height", 0.2);
    ctpEnti.setAttribute("radius", 0.5);
    ctpEnti.setAttribute("color", "yellow");

    let posArr = val.split(" ");
    let text = document.createElement("a-text");
    document.querySelector("#ctpEntis").appendChild(text);
    text.setAttribute("position", {
      x: posArr[0] + 1.5,
      y: posArr[1] + 0.1,
      z: posArr[2] + 0.5,
    });
    text.setAttribute("rotation", "-90 180 0");
    text.setAttribute("value", key);
    text.setAttribute("width", 30);
    text.setAttribute("wrapCount", 5);
    text.setAttribute("color", "black");
  }
}

function addModels(objArr, modelID, modelScale, parentNode) {
  for (let i = 0; i < objArr.length; i++) {
    // if (modelID == "leaftree") {
    //   let planeEnti = document.createElement("a-plane");
    //   parentNode.appendChild(planeEnti);
    //   planeEnti.setAttribute("rotation", "-90 0 0");
    //   planeEnti.setAttribute("position", `${objArr[i].AframeLocalX} 0 ${objArr[i].AframeLocalZ}`);
    //   planeEnti.setAttribute("width", 3);
    //   planeEnti.setAttribute("height", 3);
    //   planeEnti.setAttribute(
    //     "material",
    //     "src: #grass; repeat:1 1; transparent: true; opacity: 1"
    //   );
    // }
    let modelentis = document.createElement("a-entity");
    parentNode.appendChild(modelentis);
    modelentis.setAttribute("gltf-model", "#" + modelID);
    if (modelID == "cloud") {
      let randnPos =
        "" +
        Math.random() * 350 +
        " " +
        (Math.random() * 100 + 100) +
        " " +
        Math.random() * 450;
      modelentis.setAttribute("position", randnPos);
    } else {
      modelentis.setAttribute("position", objArr[i].AframeLocalX + " 0 " + objArr[i].AframeLocalZ);
      modelentis.setAttribute("showInfo", `itemName: ${objArr[i].RefName}; elevation: ${objArr[i].Elevation}; terrainID: ${objArr[i].TerrainID};
      typeName: ${objArr[i].Types?objArr[i].Types:""}; height: ${objArr[i].TrueHeight?objArr[i].TrueHeight:"0"}; chestRadius: ${objArr[i].ChestRadius?objArr[i].ChestRadius:""};
      coordE: ${objArr[i].E}; coordN: ${objArr[i].N}`);
      if(objArr[i].TrueHeight)
        modelentis.setAttribute("scale", `${modelScale*objArr[i].TrueHeight/5} ${modelScale*objArr[i].TrueHeight/5} ${modelScale*objArr[i].TrueHeight/5}`);
      else
        modelentis.setAttribute("scale", `${modelScale} ${modelScale} ${modelScale}`);
    }
  }
}

function readJsonFile(file) {
  let obj = null;
  let rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if(rawFile.readyState === 4)  {
      if(rawFile.status === 200 || rawFile.status == 0) {
        obj = JSON.parse(rawFile.responseText);
       }
    }
  }
  rawFile.send(null);
  // console.log(obj);
  return obj;
}