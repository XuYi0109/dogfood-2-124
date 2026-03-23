import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// 全局变量
let scene, camera, renderer, controls;
let currentProduct = null;
let currentProductType = 'phone';

// 产品信息配置
const productConfigs = {
    phone: {
        name: '旗舰智能手机',
        price: '¥5,999',
        description: '搭载最新处理器，超清显示屏，专业级摄像系统。支持5G网络，续航持久，设计精美。',
        colors: ['0x1a1a1a', '0xc0c0c0', '0xe94560', '0x4169e1']
    },
    cup: {
        name: '智能保温杯',
        price: '¥299',
        description: '304不锈钢内胆，24小时长效保温。LED温度显示，智能提醒饮水，时尚便携设计。',
        colors: ['0x2c3e50', '0xe74c3c', '0x27ae60', '0xf39c12']
    },
    chair: {
        name: '北欧设计师椅',
        price: '¥1,299',
        description: '进口实木框架，人体工学设计。高品质面料，舒适透气，简约现代风格，适合各种家居环境。',
        colors: ['0x8b4513', '0x2f4f4f', '0x708090', '0xd2691e']
    }
};

// 初始化场景
function init() {
    const container = document.getElementById('canvas-container');

    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);

    // 创建相机
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 2, 6);

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 创建控制器 - 支持360°旋转
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 12;
    controls.enablePan = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;

    // 添加灯光
    setupLighting();

    // 添加环境
    setupEnvironment();

    // 加载初始产品
    loadProduct('phone');

    // 隐藏加载动画
    document.getElementById('loading').style.display = 'none';

    // 监听窗口大小变化
    window.addEventListener('resize', onWindowResize);

    // 开始动画循环
    animate();
}

// 设置灯光
function setupLighting() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // 主光源
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.1;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.bias = -0.001;
    scene.add(mainLight);

    // 补光
    const fillLight = new THREE.DirectionalLight(0x4169e1, 0.5);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // 轮廓光
    const rimLight = new THREE.SpotLight(0xe94560, 0.8);
    rimLight.position.set(0, 5, -8);
    rimLight.lookAt(0, 0, 0);
    scene.add(rimLight);

    // 地面反射光
    const groundLight = new THREE.DirectionalLight(0xffffff, 0.3);
    groundLight.position.set(0, -5, 0);
    scene.add(groundLight);
}

// 设置环境
function setupEnvironment() {
    // 创建地面
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0x16213e,
        roughness: 0.8,
        metalness: 0.2
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2;
    plane.receiveShadow = true;
    scene.add(plane);

    // 创建网格辅助线
    const gridHelper = new THREE.GridHelper(50, 50, 0x0f3460, 0x0f3460);
    gridHelper.position.y = -1.99;
    scene.add(gridHelper);

    // 添加粒子效果
    createParticles();
}

// 创建粒子效果
function createParticles() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = Math.random() * 10;
        positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xe94560,
        size: 0.05,
        transparent: true,
        opacity: 0.6
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 存储粒子引用以便动画
    scene.userData.particles = particles;
}

// 创建手机模型
function createPhone(color = 0x1a1a1a) {
    const group = new THREE.Group();

    // 手机主体 - 使用圆角立方体
    const bodyGeometry = new RoundedBoxGeometry(1.4, 2.8, 0.15, 8, 0.05);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.2,
        metalness: 0.8,
        envMapIntensity: 1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // 屏幕
    const screenGeometry = new RoundedBoxGeometry(1.3, 2.7, 0.01, 8, 0.03);
    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.05,
        metalness: 0.1,
        emissive: 0x111111,
        emissiveIntensity: 0.2
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.08;
    group.add(screen);

    // 屏幕内容（发光效果）
    const displayGeometry = new THREE.PlaneGeometry(1.2, 2.5);
    const displayMaterial = new THREE.MeshBasicMaterial({
        color: 0x4169e1,
        transparent: true,
        opacity: 0.3
    });
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    display.position.z = 0.09;
    group.add(display);

    // 摄像头模组
    const cameraBumpGeometry = new RoundedBoxGeometry(0.5, 0.6, 0.05, 4, 0.02);
    const cameraBumpMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.7
    });
    const cameraBump = new THREE.Mesh(cameraBumpGeometry, cameraBumpMaterial);
    cameraBump.position.set(-0.35, 0.9, -0.1);
    cameraBump.castShadow = true;
    group.add(cameraBump);

    // 摄像头镜头
    const lensGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.03, 32);
    const lensMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.1,
        metalness: 0.9
    });

    const lens1 = new THREE.Mesh(lensGeometry, lensMaterial);
    lens1.rotation.x = Math.PI / 2;
    lens1.position.set(-0.45, 1.05, -0.13);
    group.add(lens1);

    const lens2 = new THREE.Mesh(lensGeometry, lensMaterial);
    lens2.rotation.x = Math.PI / 2;
    lens2.position.set(-0.25, 1.05, -0.13);
    group.add(lens2);

    const lens3 = new THREE.Mesh(lensGeometry, lensMaterial);
    lens3.rotation.x = Math.PI / 2;
    lens3.position.set(-0.35, 0.75, -0.13);
    group.add(lens3);

    // 侧边按钮
    const buttonGeometry = new THREE.BoxGeometry(0.02, 0.3, 0.08);
    const buttonMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.4,
        metalness: 0.8
    });

    const powerButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
    powerButton.position.set(0.71, 0.5, 0);
    group.add(powerButton);

    const volumeButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
    volumeButton.position.set(-0.71, 0.6, 0);
    group.add(volumeButton);

    return group;
}

// 创建保温杯模型
function createCup(color = 0x2c3e50) {
    const group = new THREE.Group();

    // 杯身
    const bodyGeometry = new THREE.CylinderGeometry(0.6, 0.55, 2.2, 64);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.6
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // 杯底
    const bottomGeometry = new THREE.CylinderGeometry(0.55, 0.55, 0.1, 64);
    const bottomMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.8,
        metalness: 0.2
    });
    const bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
    bottom.position.y = -1.15;
    group.add(bottom);

    // 杯盖
    const lidGeometry = new THREE.CylinderGeometry(0.62, 0.6, 0.4, 64);
    const lidMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.6
    });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.y = 1.3;
    lid.castShadow = true;
    group.add(lid);

    // 杯盖顶部
    const lidTopGeometry = new THREE.CylinderGeometry(0.5, 0.62, 0.1, 64);
    const lidTop = new THREE.Mesh(lidTopGeometry, lidMaterial);
    lidTop.position.y = 1.55;
    group.add(lidTop);

    // LED显示屏
    const screenGeometry = new THREE.PlaneGeometry(0.4, 0.25);
    const screenMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 0.5, 0.61);
    group.add(screen);

    // 温度数字（使用小平面模拟）
    const digitGeometry = new THREE.PlaneGeometry(0.03, 0.15);
    const digitMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // 数字 "2"
    for (let i = 0; i < 5; i++) {
        const digit = new THREE.Mesh(digitGeometry, digitMaterial);
        digit.position.set(-0.1 + i * 0.02, 0.5, 0.62);
        digit.scale.x = [1, 0.5, 1, 0.5, 1][i];
        digit.rotation.z = [0, Math.PI/2, 0, Math.PI/2, 0][i];
        group.add(digit);
    }

    // 数字 "5"
    for (let i = 0; i < 5; i++) {
        const digit = new THREE.Mesh(digitGeometry, digitMaterial);
        digit.position.set(0.05 + i * 0.02, 0.5, 0.62);
        digit.scale.x = [1, 0.5, 1, 0.5, 1][i];
        digit.rotation.z = [0, Math.PI/2, 0, -Math.PI/2, 0][i];
        group.add(digit);
    }

    // 度符号
    const degreeGeometry = new THREE.CircleGeometry(0.04, 16);
    const degree = new THREE.Mesh(degreeGeometry, digitMaterial);
    degree.position.set(0.18, 0.58, 0.62);
    group.add(degree);

    // 品牌Logo区域
    const logoGeometry = new THREE.CircleGeometry(0.15, 32);
    const logoMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.4,
        metalness: 0.5
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(0, -0.3, 0.58);
    group.add(logo);

    return group;
}

// 创建椅子模型
function createChair(color = 0x8b4513) {
    const group = new THREE.Group();

    // 座位
    const seatGeometry = new RoundedBoxGeometry(2, 0.15, 1.8, 4, 0.05);
    const seatMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.7,
        metalness: 0.1
    });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.position.y = 1;
    seat.castShadow = true;
    seat.receiveShadow = true;
    group.add(seat);

    // 靠背
    const backGeometry = new RoundedBoxGeometry(2, 1.5, 0.15, 4, 0.05);
    const back = new THREE.Mesh(backGeometry, seatMaterial);
    back.position.set(0, 1.8, -0.85);
    back.rotation.x = -0.1;
    back.castShadow = true;
    group.add(back);

    // 靠背软垫
    const cushionGeometry = new RoundedBoxGeometry(1.6, 1.1, 0.1, 4, 0.05);
    const cushionMaterial = new THREE.MeshStandardMaterial({
        color: 0xd2691e,
        roughness: 0.9,
        metalness: 0
    });
    const cushion = new THREE.Mesh(cushionGeometry, cushionMaterial);
    cushion.position.set(0, 1.8, -0.77);
    cushion.rotation.x = -0.1;
    group.add(cushion);

    // 座位软垫
    const seatCushionGeometry = new RoundedBoxGeometry(1.8, 0.1, 1.6, 4, 0.05);
    const seatCushion = new THREE.Mesh(seatCushionGeometry, cushionMaterial);
    seatCushion.position.set(0, 1.08, 0);
    group.add(seatCushion);

    // 椅腿材质
    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x2f4f4f,
        roughness: 0.3,
        metalness: 0.8
    });

    // 四条椅腿
    const legGeometry = new THREE.CylinderGeometry(0.06, 0.04, 1, 16);

    const legPositions = [
        { x: -0.9, z: 0.8 },
        { x: 0.9, z: 0.8 },
        { x: -0.9, z: -0.8 },
        { x: 0.9, z: -0.8 }
    ];

    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(pos.x, 0.5, pos.z);
        leg.castShadow = true;
        group.add(leg);
    });

    // 椅腿连接件
    const supportGeometry = new THREE.BoxGeometry(1.8, 0.05, 1.6);
    const support = new THREE.Mesh(supportGeometry, legMaterial);
    support.position.y = 0.5;
    group.add(support);

    // 扶手
    const armrestGeometry = new RoundedBoxGeometry(0.1, 0.8, 1.4, 4, 0.02);
    const armrestMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.7,
        metalness: 0.1
    });

    const leftArmrest = new THREE.Mesh(armrestGeometry, armrestMaterial);
    leftArmrest.position.set(-1.05, 1.4, 0);
    leftArmrest.castShadow = true;
    group.add(leftArmrest);

    const rightArmrest = new THREE.Mesh(armrestGeometry, armrestMaterial);
    rightArmrest.position.set(1.05, 1.4, 0);
    rightArmrest.castShadow = true;
    group.add(rightArmrest);

    // 扶手顶部
    const armTopGeometry = new RoundedBoxGeometry(0.15, 0.05, 1.4, 4, 0.02);
    const armTopMaterial = new THREE.MeshStandardMaterial({
        color: 0xd2691e,
        roughness: 0.9,
        metalness: 0
    });

    const leftArmTop = new THREE.Mesh(armTopGeometry, armTopMaterial);
    leftArmTop.position.set(-1.05, 1.82, 0);
    group.add(leftArmTop);

    const rightArmTop = new THREE.Mesh(armTopGeometry, armTopMaterial);
    rightArmTop.position.set(1.05, 1.82, 0);
    group.add(rightArmTop);

    return group;
}

// 加载产品
function loadProduct(type) {
    // 移除当前产品
    if (currentProduct) {
        scene.remove(currentProduct);
    }

    currentProductType = type;

    // 创建新产品
    switch (type) {
        case 'phone':
            currentProduct = createPhone();
            break;
        case 'cup':
            currentProduct = createCup();
            break;
        case 'chair':
            currentProduct = createChair();
            break;
    }

    // 添加入场动画
    currentProduct.scale.set(0, 0, 0);
    currentProduct.rotation.y = Math.PI;

    scene.add(currentProduct);

    // 动画效果
    let scale = 0;
    const animateEntry = () => {
        scale += 0.05;
        if (scale <= 1) {
            currentProduct.scale.set(scale, scale, scale);
            currentProduct.rotation.y = Math.PI * (1 - scale);
            requestAnimationFrame(animateEntry);
        }
    };
    animateEntry();

    // 更新UI
    updateProductInfo(type);
    updateColorPicker(type);
}

// 更新产品信息
function updateProductInfo(type) {
    const config = productConfigs[type];
    document.getElementById('product-name').textContent = config.name;
    document.getElementById('product-price').textContent = config.price;
    document.getElementById('product-desc').textContent = config.description;
}

// 更新颜色选择器
function updateColorPicker(type) {
    const config = productConfigs[type];
    const picker = document.getElementById('color-picker');
    picker.innerHTML = '';

    config.colors.forEach((color, index) => {
        const option = document.createElement('div');
        option.className = 'color-option' + (index === 0 ? ' active' : '');
        option.style.background = '#' + color.replace('0x', '');
        option.dataset.color = color;
        option.addEventListener('click', () => changeColor(color, option));
        picker.appendChild(option);
    });
}

// 改变颜色
function changeColor(colorHex, element) {
    // 更新UI
    document.querySelectorAll('.color-option').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    // 更新模型颜色
    const color = parseInt(colorHex);

    currentProduct.traverse((child) => {
        if (child.isMesh && child.material) {
            // 根据产品类型确定哪些部分需要改变颜色
            if (currentProductType === 'phone') {
                // 手机：改变主体和摄像头模组颜色
                if (child.geometry.type === 'RoundedBoxGeometry' && child.position.y !== 0.5) {
                    child.material.color.setHex(color);
                }
            } else if (currentProductType === 'cup') {
                // 保温杯：改变杯身和杯盖颜色
                if (child.geometry.type === 'CylinderGeometry' && child.position.y !== -1.15) {
                    child.material.color.setHex(color);
                }
            } else if (currentProductType === 'chair') {
                // 椅子：改变木质部分颜色
                if (child.material.roughness > 0.5) {
                    child.material.color.setHex(color);
                }
            }
        }
    });
}

// 窗口大小调整
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);

    controls.update();

    // 粒子动画
    if (scene.userData.particles) {
        const positions = scene.userData.particles.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] += 0.01;
            if (positions[i] > 10) {
                positions[i] = 0;
            }
        }
        scene.userData.particles.geometry.attributes.position.needsUpdate = true;
        scene.userData.particles.rotation.y += 0.001;
    }

    // 产品悬浮动画
    if (currentProduct) {
        currentProduct.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }

    renderer.render(scene, camera);
}

// UI事件监听
document.addEventListener('DOMContentLoaded', () => {
    // 产品切换按钮
    document.querySelectorAll('.product-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.product-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadProduct(btn.dataset.product);
        });
    });

    // 用户交互时暂停自动旋转
    document.addEventListener('mousedown', () => {
        controls.autoRotate = false;
    });

    document.addEventListener('mouseup', () => {
        setTimeout(() => {
            controls.autoRotate = true;
        }, 3000);
    });

    // 初始化
    init();
});
