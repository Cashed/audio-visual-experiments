
  // the main three.js components
  var camera;
  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer({ alpha: true });
  var faces = ['cards/100.jpg', 'cards/101.jpg', 'cards/102.jpg', 'cards/103.jpg', 'cards/104.jpg', 'cards/105.jpg', 'cards/106.jpg', 'cards/107.jpg', 'cards/108.jpg', 'cards/109.jpg', 'cards/110.jpg'];

  // keep track of the mouse position
  // var mouseX = 0;
  // var mouseY = 0;

  // an array to store out cards in
  var cards = [];

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

    makeCards();
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

  // creates a random field of card objects
  function makeCards() {
    var card, material;

    // we're gonna move from z position -1000 (far away)
    // to 1000 (where the camera is) and add a random card at every position
    var j = 1000;
    var loader = new THREE.TextureLoader();
    for (var zPos = -1000; zPos < j; zPos += 10) {
      (function(zPos) {
        loader.load(
        faces[Math.floor(Math.random() * 11)],
        function(texture) {
          material = new THREE.MeshBasicMaterial();
          material.map = texture;
          // make the card
           var geometry = new THREE.PlaneGeometry(5, 5, 1);

           card = new THREE.Mesh(geometry, material);

          // give it a random x and y position between -500 and 500
          card.position.x = Math.random() * 1000 - 500;
          card.position.y = Math.random() * 1000 - 500;

          // set its z position
          card.position.z = zPos;

          // scale it up a btn-info-outline
          card.scale.x = card.scale.y = 10;

          // add it to the scene
          scene.add(card);

          // and to the array of cards
          cards.push(card);
          j++;
        })
      })(zPos);
    }
  }

  function updateCards() {
    if (typeof audioArray === 'object' && audioArray.length > 0) {
      var k = 0;
      // iterate through every card
      for (var i = 0; i < cards.length; i++) {
        var scale = (audioArray[k] + boost) / 10;
        card = cards[i];

        card.rotateX(i/3000);
        card.rotateY(i/3000);
        card.rotateZ(i/3000);

        if (i % 2 === 0) {
          card.scale.y = (scale < 1 ? 1 : scale);
        }
        else {
          card.scale.x = (scale < 1 ? 1 : scale);
        }

        k += (k < audioArray.length ? 1 : 0);

        // if (card.scale.y > 22 || card.scale.x > 22) {
        //    card.material.color.setHex(0xf00808);
        //  }
        //  else if(card.scale.y <= 22 && card.scale.y > 18
        //  || card.scale.x <= 22 && card.scale.x > 18){
        //    card.material.color.setHex(0x0000ff);
        //  }
        //  else if(card.scale.y <= 18 && card.scale.y > 2
        //  || card.scale.x <= 18 && card.scale.x > 2){
        //    card.material.color.setHex(0xff00ff);
        //  }
        //  else {
        //    card.material.color.setHex(0x303030);
        //  }

        // move card forward
        card.position.z += 5;

        // if the particle is too close move it to the backward
        if (card.position.z > 1000) {
          card.position.z -= 2000;
        }
      }
    }
      requestAnimationFrame(updateCards);
      // render the scene from the perspective of the camera
      renderer.render(scene, camera);
  }

  updateCards();
  renderer.setSize(window.innerWidth, window.innerHeight);
