
  // the main three.js components
  var camera;
  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer();

  // keep track of the mouse position
  var mouseX = 0;
  var mouseY = 0;

  // an array to store out particles in
  var particles = [];

  init();

  function init() {
    // camera params:
    // field of view, aspect ratio for render output, near and far clipping plane
    camera = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight, 1, 4000);

    // move the camera backwards so we can see stuff
    // default position is 0,0,0
    camera.position.z = 1000;

    // scene contains all the 3d object data
    scene.add(camera);

    // the renderer's canvas dom element is added to the body
    document.body.appendChild(renderer.domElement);

    makeParticles();

    // add the mouse move listener
    // document.addEventListener('mousemove', onMouseMove, false);

    // render 30 times a second
    // (should also look at requestAnimationFrame)
    // setInterval(updateParticles, 1000/30);
  }

  var light = new THREE.AmbientLight(0xffffff);
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

  // creates a random field of particle objects
  function makeParticles() {
    var particle, material;

    // we're gonna move from z position -1000 (far away)
    // to 1000 (where the camera is) and add a random particle at every position
    for (var zPos = -1000; zPos < 1000; zPos += 10) {
      // make a particle material and pass through the colour
      // and custom particle render function we defined
      material = new THREE.MeshPhongMaterial({
        color: 0x303030,
        specular: 0xffffff,
        shininess: 20,
        reflectivity: 5.5
      });
      // make the particle
       var geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);

       particle = new THREE.Mesh(geometry, material);

      // give it a random x and y position between -500 and 500
      particle.position.x = Math.random() * 1000 - 500;
      particle.position.y = Math.random() * 1000 - 500;

      // set its z position
      particle.position.z = zPos;

      // scale it up a btn-info-outline
      particle.scale.x = particle.scale.y = 10;

      // add it to the scene
      scene.add(particle);

      // and to the array of particles
      particles.push(particle);
    }
  }

  function updateParticles() {
    if (typeof audioArray === 'object' && audioArray.length > 0) {
      var k = 0;
      // iterate through every particle
      for (var i = 0; i < particles.length; i++) {
        var scale = (audioArray[k] + boost) / 10;
        particle = particles[i];

        if (i % 2 === 0) {
          particle.scale.y = (scale < 1 ? 1 : scale);
        }
        else {
          particle.scale.x = (scale < 1 ? 1 : scale);
        }

        k += (k < audioArray.length ? 1 : 0);

        if (particle.scale.y > 22 || particle.scale.x > 22) {
           particle.material.color.setHex(0xf00808);
         }
         else if(particle.scale.y <= 22 && particle.scale.y > 18
         || particle.scale.x <= 22 && particle.scale.x > 18){
           particle.material.color.setHex(0x0000ff);
         }
         else if(particle.scale.y <= 18 && particle.scale.y > 2
         || particle.scale.x <= 18 && particle.scale.x > 2){
           particle.material.color.setHex(0xff00ff);
         }
         else {
           particle.material.color.setHex(0x303030);
         }

        // move particle forward
        particle.position.z += 5;

        // if the particle is too close move it to the backward
        if (particle.position.z > 1000) {
          particle.position.z -= 2000;
        }
      }
    }
      requestAnimationFrame(updateParticles);
      // render the scene from the perspective of the camera
      renderer.render(scene, camera);
  }

  updateParticles();
  renderer.setSize(window.innerWidth, window.innerHeight);
