var cubes = new Array();
var controls;
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();

document.body.appendChild(renderer.domElement);

// create i x j matrix of cubes
// each forloop places each [i][j] cube in a 3d vector space v = (x, y, z)
var i = 0; // row
for (var x = 0; x < 30; x +=2) {
  var j = 0;
  cubes[i] = new Array();
  for (var y = 0; y < 30; y +=2) {
    // new cube
    var geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    // create shiny material with color props
    var material = new THREE.MeshPhongMaterial({
      color: 0x303030,
      specular: 0xffffff,
      shininess: 20,
      reflectivity: 5.5
    });

    // add mesh material to a mesh that goes over the cube
    cubes[i][j] = new THREE.Mesh(geometry, material);

    // add cube to the scene
    scene.add(cubes[i][j]);

    // place the cube in space
    cubes[i][j].position.set(x, y, 0);
    j++;
  }

  i++;
}

var light = new THREE.AmbientLight(0x505050);
scene.add(light);

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);


directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, -1, -1);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(-1, -1, 0);
scene.add(directionalLight);

camera.position.z = 50;

controls = new THREE.OrbitControls(camera);
controls.addEventListener('change', render);

for(var i = 0; i < 7; i++) {
	controls.pan(new THREE.Vector3( 1, 0, 0 ));
	controls.pan(new THREE.Vector3( 0, 1, 0 ));
}

// rescale cubes based on the data from the AudioProcessingEvent
var render = function() {
  // check if audioArray is valid and has data in it
  if (typeof audioArray === 'object' && audioArray.length > 0) {
    var k = 0;
    for (var i = 0; i < cubes.length; i++) {
      for (var j = 0; j < cubes[i].length; j++) {
        var scale = (audioArray[k] + boost) / 30;
        cubes[i][j].scale.z = (scale < 1 ? 1 : scale);
        k += (k < audioArray.length ? 1 : 0);

        if (cubes[i][j].scale.z > 6) {
          cubes[i][j].material.color.setHex(0xf00808);
        }
        else {
          cubes[i][j].material.color.setHex(0x303030);
        }
      }
    }
  }
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
}

render();
renderer.setSize(window.innerWidth, window.innerHeight);
