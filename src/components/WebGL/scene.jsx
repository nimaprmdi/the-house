import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { GUI } from "three/examples/jsm/libs/dat.gui.module";

import tvStand from "../../assests/objects/tvStand.glb"; // GLB FILE
import tv from "../../assests/objects/tv.glb"; // GLB FILE
import diningTable from "../../assests/objects/diningTable.glb"; // GLB FILE
import sofa from "../../assests/objects/sofaLow.glb"; // GLB FILE
import singleSofa from "../../assests/objects/armChair.glb"; // GLB FILE
import table from "../../assests/objects/table.glb"; // GLB FILE
import gamingTable from "../../assests/objects/gamingTable.glb"; // GLB FILE
import chair from "../../assests/objects/chair.glb"; // GLB FILE
import box from "../../assests/objects/box.glb"; // GLB FILE
import home from "../../assests/objects/homeThreeEditor.glb"; // GLB FILE

import ceramic from "../../assests/textures/ceramic.jpg";
import concrete from "../../assests/textures/wall.jpg";
import grass from "../../assests/textures/grasslight-big.jpg";

const style = {
  height: 500,
};

class WebGL extends Component {
  state = {
    singleSofaLeft: {
      posX: -22.82,
      posZ: -8.08,
      rotY: 2.69,
    },

    singleSofaRight: {
      posX: 24,
      posZ: -8.08,
      rotY: 3.6,
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

    this.scene.background = new THREE.Color(0xcce0ff);

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

    // adding fog
    this.getFog();

    // adding sphere
    const sphereMaterial = this.getMaterial("phong", "rgb(255, 255, 255)");
    const sphere = this.getSphere(sphereMaterial, 1);

    // const sphere2 = this.getSphere(sphereMaterial, 2);

    // sphere2.position.x = 0;
    // sphere2.position.y = 10;
    // sphere2.position.z = 0;

    // this.scene.add(sphere2);

    // adding  plane
    const planeMaterial = this.getMaterial("standard", "rgb(70, 70, 70)");
    var planeTexture = new THREE.TextureLoader().load(grass);
    planeTexture.wrapS = THREE.RepeatWrapping;
    planeTexture.wrapT = THREE.RepeatWrapping;
    planeTexture.repeat.set(80, 80);

    planeMaterial.map = planeTexture;
    const plane = this.getPlane(planeMaterial, 900);
    plane.rotation.x = Math.PI / 2;

    this.scene.add(plane);

    // add big BOX
    // const boxSize = 70;
    // const boxMaterial = {};
    // const box = this.getBox(boxSize, boxSize, boxSize / 2, boxMaterial);
    // box.position.z = -boxSize / 4;
    // plane.add(box);

    //adding objects
    this.getTv();
    this.getTvStand();
    // this.getDiningTable();
    this.getSofa();
    // this.getSingleSofa(singleSofaLeft);
    // this.getSingleSofa(singleSofaRight);
    // this.getTable(table);
    // this.getGamingTable(gamingTable);
    // this.getChair(chair);
    // this.getBoxObj();

    this.getHome();

    // adding spotLight
    const lightLeft = new THREE.PointLight(0xffffff, 1, 50);
    lightLeft.castShadow = true;

    this.scene.add(lightLeft);
    lightLeft.position.x = -9.6;
    lightLeft.position.y = 17;
    lightLeft.position.z = 26.7;

    lightLeft.intensity = 1;
    lightLeft.distance = 20;

    lightLeft.add(sphere);

    // gui.add(lightLeft.position, "x", -30, 60).name("x");
    // gui.add(lightLeft.position, "y", -60, 60).name("y");
    // gui.add(lightLeft.position, "z", -60, 60).name("z");

    // gui.add(lightLeft, "intensity", 0, 30).name("intensity");
    // gui.add(lightLeft, "distance", 0, 150).name("distance");

    // rectAreLight
    const rectLight = this.getRectAreaLight();
    rectLight.rotation.set(5, 1.55, 1.3);
    rectLight.position.set(34.27, 5, 18);

    this.scene.add(rectLight);

    var rectLightMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(),
      new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: 0xff5cff })
    );
    rectLightMesh.scale.x = rectLight.width;
    rectLightMesh.scale.y = rectLight.height;

    rectLight.add(rectLightMesh);

    var rectLightMeshBack = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    rectLightMesh.add(rectLightMeshBack);

    // gui.add(lightLeft.position, "x", -30, 30).name("x");
    // gui.add(lightLeft.position, "y", -30, 30).name("y");
    // gui.add(lightLeft.position, "z", -30, 30).name("z");

    // gui.add(lightLeft, "intensity", 0, 30).name("intensity");
    // gui.add(lightLeft, "distance", 0, 150).name("distance");

    // the sun ( helper lights)
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

  // fogging
  getFog = () => {
    var enableFog = true;

    if (enableFog) {
      this.scene.fog = new THREE.FogExp2("rgba(204,224 ,255, 0.01)", 0.005);
      // this.scene.fog = new THREE.Fog(0xcce0ff, 500, 10000);
    }

    // const gui = new GUI();

    // gui.add(this.scene.fog, "density", 0, 0.05).step(0.001);
  };

  // object creation
  getPlane = (material, size) => {
    var geometry = new THREE.PlaneGeometry(size, size);
    material.side = THREE.DoubleSide;
    var plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;

    return plane;
  };

  getBox = (w, h, d, materials) => {
    var geometry = new THREE.BoxGeometry(w, h, d);

    var texture = new THREE.TextureLoader().load(concrete);

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);

    texture.flipY = true;

    var material = new THREE.MeshPhongMaterial({
      // flatShading: true,
      wireframe: false,
      color: 0x212121,
      polygonOffset: true,
      polygonOffsetFactor: 1, // positive value pushes polygon further away
      polygonOffsetUnits: 1,
      side: THREE.DoubleSide,
      map: texture,
      bumpMap: texture,
      bumpScale: 0.2,
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh;
  };

  getBoxObj = (objData) => {
    this.loader = new GLTFLoader();
    // const gui = new GUI();

    var texture = new THREE.TextureLoader().load(concrete);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);

    this.loader.load(
      box,

      (box) => {
        this.gltf = box.scene;
        this.scene.add(box.scene);

        var newMaterial = new THREE.MeshStandardMaterial({
          // metalness: 0,
          // roughness: 0.5,
          wireframe: false,
          // emissive: new THREE.Color(0x002a49),
          // clipShadows: true,
          // opacity: 0.1,

          color: 0xffffff,
          polygonOffset: true,
          polygonOffsetFactor: 1, // positive value pushes polygon further away
          polygonOffsetUnits: 1,
          side: THREE.DoubleSide,
          map: texture,
          bumpMap: texture,
          bumpScale: 0.45,
        });
        this.gltf.traverse((o) => {
          if (o.isMesh) o.material = newMaterial;
        });

        // singleSofa.scene.position.x = -1.51;
        // singleSofa.scene.position.y = 0;
        // singleSofa.scene.position.z = 1.74;

        box.scene.position.x = 0;
        box.scene.position.y = -14.5;
        box.scene.position.z = 0;

        box.scene.scale.x = 51;
        box.scene.scale.y = 28;
        box.scene.scale.z = 39.5;

        // box.scene.rotation.y = objData.rotY;

        // gui.add(box.scene.scale, "x", 0, 80).name("gaming").step(0.5);
        // gui.add(box.scene.scale, "y", 0, 80).name("gaming").step(0.5);
        // gui.add(box.scene.scale, "z", 0, 80).name("gaming").step(0.5);

        // gui.add(box.scene.position, "y", -15, 5).name("gaming").step(0.5);

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

  getHome = (objData) => {
    this.loader = new GLTFLoader();

    this.loader.load(
      home,

      (home) => {
        this.gltf = home.scene;
        this.scene.add(home.scene);

        // singleSofa.scene.position.x = -1.51;
        // singleSofa.scene.position.y = 0;
        // singleSofa.scene.position.z = 1.74;

        home.scene.position.x = 0;
        home.scene.position.y = 0;
        home.scene.position.z = 0;

        home.scene.scale.x = 2;
        home.scene.scale.y = 2;
        home.scene.scale.z = 2;

        home.scene.rotation.y = 0.8;

        // const gui = new GUI();

        // gui
        //   .add(home.scene.position, "x", 0, 6)
        //   .name("home_position_x")
        //   .step(0.5);
        // gui
        //   .add(home.scene.position, "y", 0, 6)
        //   .name("home_position_y")
        //   .step(0.5);
        // gui
        //   .add(home.scene.position, "z", 0, 6)
        //   .name("home_position_z")
        //   .step(0.5);

        // gui.add(home.scene.rotation, "y", 0, 6).name("gaming").step(0.001);
      },
      undefined,

      (error) => {
        console.log(error);
      }
    );
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

  getRectAreaLight = () => {
    const width = 10;
    const height = 30;
    const intensity = 10;
    const rectLight = new THREE.RectAreaLight(
      0xff5cff,
      intensity,
      width,
      height
    );

    // rectLight.position.z = 26;
    // rectLight.rotation.x = 0.8;

    // const gui = new GUI();
    // gui.add(rectLight.position, "x", -16, 60).name("ScaleX").step(0.01);
    // gui.add(rectLight.position, "y", -16, 60).name("ScaleX").step(0.01);
    // gui.add(rectLight.position, "z", -16, 60).name("ScaleX").step(0.01);

    // gui.add(rectLight.rotation, "x", 0, 6).name("ScaleX").step(0.01);
    // gui.add(rectLight.rotation, "y", 0, 6).name("rotY").step(0.01);
    // gui.add(rectLight.rotation, "z", 0, 6).name("ScaleX").step(0.01);

    rectLight.lookAt(0, 0, 0);

    return rectLight;
  };

  // objects
  getTv = () => {
    this.loader = new GLTFLoader();

    this.loader.load(
      tv,

      (tv) => {
        this.gltf = tv.scene;
        this.scene.add(tv.scene);

        tv.scene.position.x = -6.198;
        tv.scene.position.y = 1.107;
        tv.scene.position.z = 17.542;

        tv.scene.scale.x = 3.2;
        tv.scene.scale.y = 2.5;
        tv.scene.scale.z = 3.2;

        tv.scene.rotation.y = 3.174;

        // const gui = new GUI();

        // gui.add(tv.scene.position, "x", -20, 20).name("tv_Pos_X").step(0.001);
        // gui.add(tv.scene.position, "y", -20, 20).name("tv_Pos_y").step(0.001);
        // gui.add(tv.scene.position, "z", -20, 20).name("tv_Pos_z").step(0.001);

        // gui.add(tv.scene.scale, "x", -10, 10).name("tv_scale_X").step(0.001);
        // gui.add(tv.scene.scale, "y", -10, 10).name("tv_scale_y").step(0.001);
        // gui.add(tv.scene.scale, "z", -10, 10).name("tv_scale_z").step(0.001);

        // gui.add(tv.scene.rotation, "y", 0, 6).name("tv_scale_z").step(0.001);
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

        tvStand.scene.scale.x = 4.5;
        tvStand.scene.scale.y = 2.7;
        tvStand.scene.scale.z = 3.8;

        tvStand.scene.position.x = -6.21;
        tvStand.scene.position.y = 0.35;
        tvStand.scene.position.z = 17.64;

        // const gui = new GUI();
        // gui.add(tvStand.scene.scale, "x", -10, 10).name("tvStand_scale_X");
        // gui.add(tvStand.scene.scale, "y", -10, 10).name("tvStand_scale_y");
        // gui.add(tvStand.scene.scale, "z", -10, 10).name("tvStand_scale_z");

        // gui
        //   .add(tvStand.scene.position, "x", -20, 20)
        //   .name("tvStand_Pos_X")
        //   .step(0.01);
        // gui
        //   .add(tvStand.scene.position, "y", -20, 20)
        //   .name("tvStand_Pos_y")
        //   .step(0.01);
        // gui
        //   .add(tvStand.scene.position, "z", -20, 20)
        //   .name("tvStand_Pos_z")
        //   .step(0.01);

        // gui.add(tvStand.scene.rotation, "y", 0, 4).name("tvStand_rotation_y");
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

        sofa.scene.position.x = -6.007;
        sofa.scene.position.y = 1.2;
        sofa.scene.position.z = 13.075;

        sofa.scene.scale.x = 2.2;
        sofa.scene.scale.y = 2.2;
        sofa.scene.scale.z = 2.2;

        sofa.scene.rotation.y = 6.28;

        const gui = new GUI();

        gui
          .add(sofa.scene.position, "x", -20, 20)
          .name("sofa_position_x")
          .step(0.001);
        gui
          .add(sofa.scene.position, "y", -20, 20)
          .name("sofa_position_y")
          .step(0.001);
        gui
          .add(sofa.scene.position, "z", -20, 20)
          .name("sofa_position_z")
          .step(0.001);

        gui
          .add(sofa.scene.scale, "x", -10, 10)
          .name("sofa_scale_x")
          .step(0.001);
        gui
          .add(sofa.scene.scale, "y", -10, 10)
          .name("sofa_scale_y")
          .step(0.001);
        gui
          .add(sofa.scene.scale, "z", -10, 10)
          .name("sofa_scale_z")
          .step(0.001);

        gui
          .add(sofa.scene.rotation, "y", 0, 8)
          .name("sofa_rotation_x")
          .step(0.001);
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

        singleSofa.scene.scale.x = 1.2;
        singleSofa.scene.scale.y = 1.1;
        singleSofa.scene.scale.z = 1;

        singleSofa.scene.rotation.y = objData.rotY;

        // const gui = new GUI();
        // gui.add(singleSofa.scene.scale, "x", 0, 10).name("ScaleX");
        // gui.add(singleSofa.scene.scale, "y", 0, 10).name("ScaleY");
        // gui.add(singleSofa.scene.scale, "z", 0, 10).name("ScaleZ");

        // gui
        //   .add(singleSofa.scene.position, "x", -40, 40)
        //   .name("PosX")
        //   .step(0.01);
        // gui
        //   .add(singleSofa.scene.position, "y", -40, 40)
        //   .name("PosY")
        //   .step(0.01);
        // gui
        //   .add(singleSofa.scene.position, "z", -40, 40)
        //   .name("PosZ")
        //   .step(0.01);

        // gui.add(singleSofa.scene.rotation, "y", -6, 6).name("RotY").step(0.01);
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
