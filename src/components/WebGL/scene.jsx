import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";

import tvStand from "../../assests/objects/tvStand.glb"; // GLB FILE
import tv from "../../assests/objects/tv.glb"; // GLB FILE
import diningTable from "../../assests/objects/diningTable.glb"; // GLB FILE
import sofa from "../../assests/objects/sofa.glb"; // GLB FILE
import singleSofa from "../../assests/objects/singleSofa.glb"; // GLB FILE
import table from "../../assests/objects/table.glb"; // GLB FILE
import gamingTable from "../../assests/objects/gamingTable.glb"; // GLB FILE
import chair from "../../assests/objects/chair.glb"; // GLB FILE

import ceramic from "../../assests/textures/ceramic.jpg";
import concrete from "../../assests/textures/concrete.JPG";

const style = {
  height: 500,
};

class WebGL extends Component {
  state = {
    singleSofaLeft: {
      posX: -0.28,
      posZ: 1.46,
      rotY: 2.82,
    },

    singleSofaRight: {
      posX: 30.94,
      posZ: -8.95,
      rotY: 3.47,
    },

    table: {
      scalX: 0.1665,
      scalY: 0.1231,
      scalZ: 0.1014,
      posX: -0.28,
      posY: -0.28,
      posZ: -16.75,
      rotY: 3.15,
    },

    gamingTable: {
      scalX: 2.57,
      scalY: 2.78,
      scalZ: 2.89,
      posX: -5.48,
      posY: 6.66,
      posZ: 25.73,
      rotY: 3.2,
    },

    chair: {
      scalX: 0.8,
      scalY: 0.8,
      scalZ: 0.8,
      posX: -9.82,
      posY: 0,
      posZ: 20.53,
      rotY: 1.13,
    },
  };

  componentDidMount() {
    this.sceneSetup();
    this.addCustomSceneObjects();
    this.startAnimationLoop();
    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    this.controls.dispose();
  }

  sceneSetup = () => {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.camera.position.x = -8;
    this.camera.position.y = 25;
    this.camera.position.z = 30;

    this.controls = new OrbitControls(this.camera, this.mount);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.mount.appendChild(this.renderer.domElement);
  };

  addCustomSceneObjects = () => {
    const {
      singleSofaLeft,
      singleSofaRight,
      table,
      gamingTable,
      chair,
    } = this.state;

    // adding sphere
    const sphereMaterial = this.getMaterial("phong", "rgb(255, 255, 255)");
    const sphere = this.getSphere(sphereMaterial, 1);

    // adding  plane

    const planeMaterial = this.getMaterial("standard", "rgb(237, 237, 237)");
    var planeTexture = new THREE.TextureLoader().load(ceramic);
    planeTexture.wrapS = THREE.RepeatWrapping;
    planeTexture.wrapT = THREE.RepeatWrapping;
    planeTexture.repeat.set(4, 4);

    planeMaterial.map = planeTexture;
    const plane = this.getPlane(planeMaterial, 80);
    plane.rotation.x = Math.PI / 2;

    this.scene.add(plane);

    // add big BOX
    const boxSize = 70;
    const boxMaterial = {};

    const box = this.getBox(boxSize, boxSize, boxSize / 2, boxMaterial);
    box.position.z = -boxSize / 4;
    plane.add(box);

    //adding objects
    this.getTv();
    this.getTvStand();
    this.getDiningTable();
    this.getSofa();
    this.getSingleSofa(singleSofaLeft);
    this.getSingleSofa(singleSofaRight);
    this.getTable(table);
    this.getGamingTable(gamingTable);
    this.getChair(chair);

    // adding spotLight
    const lightLeft = new THREE.PointLight(0x87bbff, 1, 50);
    this.scene.add(lightLeft);
    lightLeft.position.x = -9.6;
    lightLeft.position.y = 17;
    lightLeft.position.z = 26.7;
    lightLeft.add(sphere);

    const gui = new GUI();
    gui.add(lightLeft.position, "x", -30, 30).name("x");
    gui.add(lightLeft.position, "y", -30, 30).name("y");
    gui.add(lightLeft.position, "z", -30, 30).name("z");

    gui.add(lightLeft, "intensity", 0, 30).name("intensity");
    gui.add(lightLeft, "distance", 0, 150).name("distance");

    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);
  };

  // object creation
  getPlane = (material, size) => {
    var geometry = new THREE.PlaneGeometry(size, size);
    material.side = THREE.DoubleSide;
    var plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;

    return plane;
  };

  getBox = (w, h, d, material) => {
    var geometry = new THREE.BoxGeometry(w, h, d);

    var texture = new THREE.TextureLoader().load(concrete);

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);

    var material = new THREE.MeshPhongMaterial({
      // flatShading: true,
      wireframe: false,
      color: 0xeb1c1c,
      polygonOffset: true,
      polygonOffsetFactor: 1, // positive value pushes polygon further away
      polygonOffsetUnits: 1,
      side: THREE.DoubleSide,

      map: texture,
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    return mesh;
  };

  getSphere = (material, size, segments) => {
    var geometry = new THREE.SphereGeometry(size, segments, segments);
    var obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;

    return obj;
  };

  // material creation
  getMaterial = (type, color) => {
    var selectedMaterial;
    var materialOptions = {
      color: color === undefined ? "rgb(255, 255, 255)" : color,
    };

    switch (type) {
      case "basic":
        selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
        break;
      case "lambert":
        selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
        break;
      case "phong":
        selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
        break;
      case "standard":
        selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
        break;
      default:
        selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
        break;
    }

    return selectedMaterial;
  };

  // lighting
  getSpotLight = (intensity, color) => {
    color = color === undefined ? "rgb(255, 255, 255)" : color;
    var light = new THREE.SpotLight(color, intensity);
    light.castShadow = true;
    light.penumbra = 0.5;

    light.shadow.mapSize.width = 2024;
    light.shadow.mapSize.height = 2024;
    light.shadow.bias = 0.001;

    return light;
  };

  // objects
  getTv = () => {
    this.loader = new GLTFLoader();

    this.loader.load(
      tv,

      (tv) => {
        this.gltf = tv.scene;
        this.scene.add(tv.scene);

        tv.scene.position.x = 0;
        tv.scene.position.y = 5.25;
        tv.scene.position.z = -30;

        tv.scene.scale.x = 15;
        tv.scene.scale.y = 13;
        tv.scene.scale.z = 6;
      },
      undefined,

      (error) => {
        console.log(error);
      }
    );
  };

  getTvStand = () => {
    this.loader = new GLTFLoader();

    this.loader.load(
      tvStand,

      (tvStand) => {
        this.gltf = tvStand.scene;
        this.scene.add(tvStand.scene);

        tvStand.scene.position.x = 0;
        tvStand.scene.position.y = 0;
        tvStand.scene.position.z = -30;

        tvStand.scene.scale.x = 23;
        tvStand.scene.scale.y = 19.5;
        tvStand.scene.scale.z = 21.7;
      },
      undefined,

      (error) => {
        console.log(error);
      }
    );
  };

  getDiningTable = () => {
    this.loader = new GLTFLoader();

    this.loader.load(
      diningTable,

      (diningTable) => {
        this.gltf = diningTable.scene;
        this.scene.add(diningTable.scene);

        diningTable.scene.position.x = 24.5;
        diningTable.scene.position.y = 0;
        diningTable.scene.position.z = 25;

        diningTable.scene.scale.x = 10;
        diningTable.scene.scale.y = 10;
        diningTable.scene.scale.z = 10;

        // const gui = new GUI();
        // gui.add(diningTable.scene.scale, "x", -10, 10).name("scal");
        // gui.add(diningTable.scene.scale, "y", -10, 10).name("scal");
        // gui.add(diningTable.scene.scale, "z", -10, 10).name("scal");

        // gui
        //   .add(diningTable.scene.position, "x", -30, 30)
        //   .name("scal")
        //   .step(0.01);
        // gui
        //   .add(diningTable.scene.position, "y", -30, 30)
        //   .name("scal")
        //   .step(0.01);
        // gui
        //   .add(diningTable.scene.position, "z", -30, 30)
        //   .name("scal")
        //   .step(0.01);
      },
      undefined,

      (error) => {
        console.log(error);
      }
    );
  };

  getSofa = () => {
    this.loader = new GLTFLoader();

    this.loader.load(
      sofa,

      (sofa) => {
        this.gltf = sofa.scene;
        this.scene.add(sofa.scene);

        sofa.scene.position.x = 2.39;
        sofa.scene.position.y = 0;
        sofa.scene.position.z = 3.04;

        sofa.scene.scale.x = 0.009;
        sofa.scene.scale.y = 0.009;
        sofa.scene.scale.z = 0.009;

        sofa.scene.rotation.y = 2.69;

        // const gui = new GUI();
        // gui.add(sofa.scene.scale, "x", -0.009, 0.009).name("scal");
        // gui.add(sofa.scene.scale, "y", -0.009, 0.009).name("scal");
        // gui.add(sofa.scene.scale, "z", -0.009, 0.009).name("scal");

        // gui.add(sofa.scene.position, "x", -30, 30).name("scal").step(0.01);
        // gui.add(sofa.scene.position, "y", -30, 30).name("scal").step(0.01);
        // gui.add(sofa.scene.position, "z", -30, 30).name("scal").step(0.01);

        // gui.add(sofa.scene.rotation, "y", -3, 3).name("scal").step(0.01);
      },
      undefined,

      (error) => {
        console.log(error);
      }
    );
  };

  getSingleSofa = (objData) => {
    this.loader = new GLTFLoader();

    this.loader.load(
      singleSofa,

      (singleSofa) => {
        this.gltf = singleSofa.scene;
        this.scene.add(singleSofa.scene);

        // singleSofa.scene.position.x = -1.51;
        // singleSofa.scene.position.y = 0;
        // singleSofa.scene.position.z = 1.74;

        singleSofa.scene.position.x = objData.posX;
        singleSofa.scene.position.y = 0;
        singleSofa.scene.position.z = objData.posZ;

        singleSofa.scene.scale.x = 0.009;
        singleSofa.scene.scale.y = 0.009;
        singleSofa.scene.scale.z = 0.009;

        singleSofa.scene.rotation.y = objData.rotY;

        // const gui = new GUI();
        // gui.add(singleSofa.scene.scale, "x", -0.009, 0.009).name("scal");
        // gui.add(singleSofa.scene.scale, "y", -0.009, 0.009).name("scal");
        // gui.add(singleSofa.scene.scale, "z", -0.009, 0.009).name("scal");

        // gui
        //   .add(singleSofa.scene.position, "x", -40, 40)
        //   .name("scal")
        //   .step(0.01);
        // gui
        //   .add(singleSofa.scene.position, "y", -40, 40)
        //   .name("scal")
        //   .step(0.01);
        // gui
        //   .add(singleSofa.scene.position, "z", -40, 40)
        //   .name("scal")
        //   .step(0.01);

        // gui.add(singleSofa.scene.rotation, "y", -6, 6).name("scal").step(0.01);
      },
      undefined,

      (error) => {
        console.log(error);
      }
    );
  };

  getTable = (objData) => {
    this.loader = new GLTFLoader();

    this.loader.load(
      table,

      (table) => {
        this.gltf = table.scene;
        this.scene.add(table.scene);

        // singleSofa.scene.position.x = -1.51;
        // singleSofa.scene.position.y = 0;
        // singleSofa.scene.position.z = 1.74;

        table.scene.position.x = objData.posX;
        table.scene.position.y = objData.posY;
        table.scene.position.z = objData.posZ;

        table.scene.scale.x = objData.scalX;
        table.scene.scale.y = objData.scalY;
        table.scene.scale.z = objData.scalZ;

        table.scene.rotation.y = objData.rotY;

        // const gui = new GUI();
        // gui.add(table.scene.scale, "x", -1, 1).name("scal");
        // gui.add(table.scene.scale, "y", -1, 1).name("scal");
        // gui.add(table.scene.scale, "z", -1, 1).name("scal");

        // gui.add(table.scene.position, "x", -40, 40).name("scal").step(0.01);
        // gui.add(table.scene.position, "y", -40, 40).name("scal").step(0.01);
        // gui.add(table.scene.position, "z", -40, 40).name("scal").step(0.01);

        // gui.add(table.scene.rotation, "y", -6, 6).name("scal").step(0.01);
      },
      undefined,

      (error) => {
        console.log(error);
      }
    );
  };

  getGamingTable = (objData) => {
    this.loader = new GLTFLoader();

    this.loader.load(
      gamingTable,

      (gamingTable) => {
        this.gltf = gamingTable.scene;
        this.scene.add(gamingTable.scene);

        // singleSofa.scene.position.x = -1.51;
        // singleSofa.scene.position.y = 0;
        // singleSofa.scene.position.z = 1.74;

        gamingTable.scene.position.x = objData.posX;
        gamingTable.scene.position.y = objData.posY;
        gamingTable.scene.position.z = objData.posZ;

        gamingTable.scene.scale.x = objData.scalX;
        gamingTable.scene.scale.y = objData.scalY;
        gamingTable.scene.scale.z = objData.scalZ;

        gamingTable.scene.rotation.y = objData.rotY;

        // const gui = new GUI();
        // gui.add(gamingTable.scene.scale, "x", -5, 5).name("gaming");
        // gui.add(gamingTable.scene.scale, "y", -5, 5).name("gaming");
        // gui.add(gamingTable.scene.scale, "z", -5, 5).name("gaming");

        // gui
        //   .add(gamingTable.scene.position, "x", -40, 40)
        //   .name("scal")
        //   .step(0.01);
        // gui
        //   .add(gamingTable.scene.position, "y", -40, 40)
        //   .name("scal")
        //   .step(0.01);
        // gui
        //   .add(gamingTable.scene.position, "z", -40, 40)
        //   .name("scal")
        //   .step(0.01);

        // gui.add(gamingTable.scene.rotation, "y", -6, 6).name("scal").step(0.01);
      },
      undefined,

      (error) => {
        console.log(error);
      }
    );
  };

  getChair = (objData) => {
    this.loader = new GLTFLoader();

    this.loader.load(
      chair,

      (chair) => {
        this.gltf = chair.scene;
        this.scene.add(chair.scene);

        // singleSofa.scene.position.x = -1.51;
        // singleSofa.scene.position.y = 0;
        // singleSofa.scene.position.z = 1.74;

        chair.scene.position.x = objData.posX;
        chair.scene.position.y = objData.posY;
        chair.scene.position.z = objData.posZ;

        chair.scene.scale.x = objData.scalX;
        chair.scene.scale.y = objData.scalY;
        chair.scene.scale.z = objData.scalZ;

        chair.scene.rotation.y = objData.rotY;

        // const gui = new GUI();
        // gui.add(chair.scene.scale, "x", -5, 5).name("gaming");
        // gui.add(chair.scene.scale, "y", -5, 5).name("gaming");
        // gui.add(chair.scene.scale, "z", -5, 5).name("gaming");

        // gui.add(chair.scene.position, "x", -40, 40).name("scal").step(0.01);
        // gui.add(chair.scene.position, "y", -40, 40).name("scal").step(0.01);
        // gui.add(chair.scene.position, "z", -40, 40).name("scal").step(0.01);

        // gui.add(chair.scene.rotation, "y", -6, 6).name("scal").step(0.01);
      },
      undefined,

      (error) => {
        console.log(error);
      }
    );
  };

  // animation
  startAnimationLoop = () => {
    this.renderer.render(this.scene, this.camera);

    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  handleWindowResize = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();
  };

  render() {
    return <div style={style} ref={(ref) => (this.mount = ref)} />;
  }
}

class Scene extends React.Component {
  state = { isMounted: true };

  getInput() {
    console.log("event");
  }

  handleMount = () => {
    this.setState({ isMounted: !this.state.isMounted });
  };

  render() {
    const { isMounted = false } = this.state;
    return (
      <>
        {/* <button onClick={() => this.handleMount()}>
          {isMounted ? "Unmount" : "Mount"}
        </button> */}
        {isMounted && <WebGL />}
      </>
    );
  }
}

export default Scene;