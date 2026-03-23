import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type ProductType = 'phone' | 'cup' | 'furniture';

interface ProductShowcaseProps {
  productType: ProductType;
}

function ProductShowcase({ productType }: ProductShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const productGroupRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI / 2 + 0.3;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4a90e2, 0.5, 20);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(20, 20, 0x334155, 0x1e293b);
    gridHelper.position.y = -1.99;
    scene.add(gridHelper);

    const productGroup = new THREE.Group();
    productGroupRef.current = productGroup;
    scene.add(productGroup);

    createProduct(productType, productGroup);

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      controls.dispose();
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          }
        }
      });
      
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (productGroupRef.current) {
      while (productGroupRef.current.children.length > 0) {
        const child = productGroupRef.current.children[0];
        productGroupRef.current.remove(child);
        
        if (child instanceof THREE.Group) {
          child.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.geometry.dispose();
              if (object.material instanceof THREE.Material) {
                object.material.dispose();
              }
            }
          });
        } else if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      }
      createProduct(productType, productGroupRef.current);
    }
  }, [productType]);

  const createProduct = (type: ProductType, group: THREE.Group) => {
    switch (type) {
      case 'phone':
        createPhone(group);
        break;
      case 'cup':
        createCup(group);
        break;
      case 'furniture':
        createFurniture(group);
        break;
    }
  };

  const createPhone = (group: THREE.Group) => {
    const phoneGroup = new THREE.Group();

    const bodyGeometry = new THREE.BoxGeometry(3, 6, 0.3);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.3,
      metalness: 0.8,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    phoneGroup.add(body);

    const screenGeometry = new THREE.BoxGeometry(2.7, 5.4, 0.05);
    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e3a5f,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x0a1929,
      emissiveIntensity: 0.3,
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.18;
    phoneGroup.add(screen);

    const cameraGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32);
    const cameraMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.2,
      metalness: 0.9,
    });
    const camera = new THREE.Mesh(cameraGeometry, cameraMaterial);
    camera.rotation.x = Math.PI / 2;
    camera.position.set(-0.8, 2.5, 0.2);
    phoneGroup.add(camera);

    const lensGeometry = new THREE.CircleGeometry(0.08, 32);
    const lensMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.1,
      metalness: 0.9,
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.position.set(-0.8, 2.5, 0.26);
    phoneGroup.add(lens);

    phoneGroup.rotation.x = -0.1;
    group.add(phoneGroup);
  };

  const createCup = (group: THREE.Group) => {
    const cupGroup = new THREE.Group();

    const cupGeometry = new THREE.CylinderGeometry(1, 1.2, 3, 32);
    const cupMaterial = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.4,
      metalness: 0.3,
    });
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    cup.castShadow = true;
    cup.receiveShadow = true;
    cupGroup.add(cup);

    const rimGeometry = new THREE.TorusGeometry(1.2, 0.1, 16, 32);
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.8,
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.5;
    cupGroup.add(rim);

    const handleGeometry = new THREE.TorusGeometry(0.8, 0.15, 16, 32, Math.PI);
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.4,
      metalness: 0.3,
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.rotation.z = Math.PI / 2;
    handle.rotation.y = Math.PI;
    handle.position.set(1.3, 0, 0);
    cupGroup.add(handle);

    const lidGeometry = new THREE.CylinderGeometry(1.1, 1.1, 0.2, 32);
    const lidMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e40af,
      roughness: 0.3,
      metalness: 0.5,
    });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.y = 1.6;
    cupGroup.add(lid);

    cupGroup.position.y = -0.5;
    group.add(cupGroup);
  };

  const createFurniture = (group: THREE.Group) => {
    const furnitureGroup = new THREE.Group();

    const baseGeometry = new THREE.BoxGeometry(6, 0.5, 3);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.7,
      metalness: 0.1,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.castShadow = true;
    base.receiveShadow = true;
    base.position.y = -1.75;
    furnitureGroup.add(base);

    const legGeometry = new THREE.BoxGeometry(0.3, 2, 0.3);
    const legMaterial = new THREE.MeshStandardMaterial({
      color: 0x451a03,
      roughness: 0.6,
      metalness: 0.1,
    });

    const legPositions = [
      [-2.7, -2.75, 1.2],
      [2.7, -2.75, 1.2],
      [-2.7, -2.75, -1.2],
      [2.7, -2.75, -1.2],
    ];

    legPositions.forEach((pos) => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(pos[0], pos[1], pos[2]);
      leg.castShadow = true;
      furnitureGroup.add(leg);
    });

    const cushionGeometry = new THREE.BoxGeometry(5.5, 1, 2.5);
    const cushionMaterial = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.8,
      metalness: 0,
    });
    const cushion = new THREE.Mesh(cushionGeometry, cushionMaterial);
    cushion.position.y = -1;
    cushion.castShadow = true;
    furnitureGroup.add(cushion);

    const backrestGeometry = new THREE.BoxGeometry(5.5, 2.5, 0.5);
    const backrestMaterial = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.8,
      metalness: 0,
    });
    const backrest = new THREE.Mesh(backrestGeometry, backrestMaterial);
    backrest.position.set(0, 0.25, -1.2);
    backrest.rotation.x = -0.2;
    backrest.castShadow = true;
    furnitureGroup.add(backrest);

    const armrestGeometry = new THREE.BoxGeometry(0.4, 1, 2.5);
    const armrestMaterial = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.7,
      metalness: 0.1,
    });

    const leftArmrest = new THREE.Mesh(armrestGeometry, armrestMaterial);
    leftArmrest.position.set(-2.95, -1, 0);
    leftArmrest.castShadow = true;
    furnitureGroup.add(leftArmrest);

    const rightArmrest = new THREE.Mesh(armrestGeometry, armrestMaterial);
    rightArmrest.position.set(2.95, -1, 0);
    rightArmrest.castShadow = true;
    furnitureGroup.add(rightArmrest);

    group.add(furnitureGroup);
  };

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
}

export default ProductShowcase;