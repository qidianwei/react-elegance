import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './ParticleWave.module.css'; // Import CSS Module

const ParticleWave = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null); // Ref for animation frame ID

  useEffect(() => {
    // Store current refs in local variables for cleanup
    const currentContainer = containerRef.current;
    let currentRenderer = rendererRef.current;
    let currentParticles = particlesRef.current;
    let currentScene = sceneRef.current;

    if (!currentContainer) {
      console.error('Container ref is null during mount');
      return;
    }

    try {
      // Initialization logic (scene, camera, renderer setup)
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      currentScene = scene; // Update local variable

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      currentContainer.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      currentRenderer = renderer; // Update local variable

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      // Particle creation logic
      const particleCount = 500;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const initialPositions = new Float32Array(particleCount * 3); // Store initial Z

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 10; // Wider distribution again
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;
        initialPositions[i3 + 2] = positions[i3 + 2]; // Store initial Z

        colors[i3] = Math.random(); // Random colors again
        colors[i3 + 1] = Math.random();
        colors[i3 + 2] = Math.random();
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.1, // Slightly smaller size
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      particlesRef.current = particles;
      currentParticles = particles; // Update local variable

      // Mouse move listener
      const handleMouseMove = (event: MouseEvent) => {
        mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', handleMouseMove);

      // Animation loop
      const animate = () => {
        animationFrameId.current = requestAnimationFrame(animate);

        const time = Date.now() * 0.0005; // Slower animation
        const positions = geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const x = positions[i3];
          const y = positions[i3 + 1];
          const initialZ = initialPositions[i3 + 2];

          // Calculate distance from mouse (projected onto xy plane)
          const dx = x - mouseRef.current.x * 5;
          const dy = y - mouseRef.current.y * 5;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Combine wave effect based on distance and general time-based oscillation
          positions[i3 + 2] = initialZ + Math.sin(distance * 1.5 - time * 2) * 0.5 + Math.sin(time + x * 0.5) * 0.2;
        }
        geometry.attributes.position.needsUpdate = true;

        if (currentRenderer && currentScene && cameraRef.current) {
            currentRenderer.render(currentScene, cameraRef.current);
        }
      };
      animate();

      // Resize listener
      const handleResize = () => {
        if (cameraRef.current && currentRenderer) {
          const width = window.innerWidth;
          const height = window.innerHeight;
          cameraRef.current.aspect = width / height;
          cameraRef.current.updateProjectionMatrix();
          currentRenderer.setSize(width, height);
        }
      };
      window.addEventListener('resize', handleResize);

      // Cleanup function
      return () => {
        // console.log('ParticleWave cleanup');
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        // Use the local variables captured at the start of the effect
        if (currentContainer && currentRenderer) {
          currentContainer.removeChild(currentRenderer.domElement);
        }
        if (currentParticles) {
          currentParticles.geometry.dispose();
          (currentParticles.material as THREE.Material).dispose();
          if(currentScene) {
            currentScene.remove(currentParticles);
          }
        }
        if (currentRenderer) {
          currentRenderer.dispose();
        }
      };
    } catch (error) {
      console.error('Error in ParticleWave:', error);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Apply CSS module class to the container div
  return <div ref={containerRef} className={styles.particleContainer} />;
};

export default ParticleWave; 