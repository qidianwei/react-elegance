import { useEffect, useRef, useState } from 'react';
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
  const timeRef = useRef(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Check if the component is mounted
    console.log("ParticleWave mounting");
    
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
      currentScene = scene;

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
      renderer.setClearColor(0x000000, 0); // Transparent background
      currentContainer.innerHTML = ''; // Clear any existing elements
      currentContainer.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      currentRenderer = renderer;

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      // Enhanced particle creation
      const particleCount = 5000; // More particles for better visibility
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const initialPositions = new Float32Array(particleCount * 3);

      // Vibrant color palette
      const colorPalette = [
        new THREE.Color(0x00ffff), // Cyan
        new THREE.Color(0xff00ff), // Magenta 
        new THREE.Color(0x4400ff), // Blue-purple
        new THREE.Color(0x0088ff), // Light blue
        new THREE.Color(0x00ff88), // Turquoise
        new THREE.Color(0xff2222), // Red
        new THREE.Color(0xffff00)  // Yellow
      ];

      // Create particles in a spiral pattern
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Distribute particles in a disc/spiral shape
        const radius = Math.sqrt(Math.random()) * 10;
        const angle = Math.random() * Math.PI * 12;
        
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = Math.sin(angle) * radius;
        positions[i3 + 2] = (Math.random() - 0.5) * 5;
        
        initialPositions[i3] = positions[i3];
        initialPositions[i3 + 1] = positions[i3 + 1];
        initialPositions[i3 + 2] = positions[i3 + 2];
        
        // Assign a color from the palette
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // Simpler point material for debugging
      const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      particlesRef.current = particles;
      currentParticles = particles;

      console.log("Particles created:", particleCount);

      // Mouse move listener
      const handleMouseMove = (event: MouseEvent) => {
        mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      
      const handleMouseEnter = () => {
        setIsHovering(true);
      };
      
      const handleMouseLeave = () => {
        setIsHovering(false);
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      currentContainer.addEventListener('mouseenter', handleMouseEnter);
      currentContainer.addEventListener('mouseleave', handleMouseLeave);

      // Animation loop
      const animate = () => {
        animationFrameId.current = requestAnimationFrame(animate);
        
        // Update time
        const time = Date.now() * 0.001;
        
        // Update particles
        const positions = geometry.attributes.position.array as Float32Array;
        
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const x = initialPositions[i3];
          const y = initialPositions[i3 + 1];
          const initialZ = initialPositions[i3 + 2];
          
          // Calculate distance from mouse (projected onto xy plane)
          const dx = x - mouseRef.current.x * 10;
          const dy = y - mouseRef.current.y * 10;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Create wave effect
          const waveAmplitude = isHovering ? 1.0 : 0.5;
          positions[i3 + 2] = initialZ + 
                             Math.sin(distance * 0.3 - time * 1.5) * waveAmplitude + 
                             Math.sin(time * 0.5 + x * 0.2) * 0.3;
          
          // Add subtle movement in x-y plane when mouse is active
          if (isHovering) {
            positions[i3] = x + Math.sin(time + y * 0.1) * 0.05;
            positions[i3 + 1] = y + Math.cos(time + x * 0.1) * 0.05;
          }
        }
        
        // Update geometry
        geometry.attributes.position.needsUpdate = true;
        
        // Rotate the entire particle system
        particles.rotation.y = time * 0.05;
        particles.rotation.x = Math.sin(time * 0.025) * 0.1;

        if (currentRenderer && currentScene && cameraRef.current) {
          currentRenderer.render(currentScene, cameraRef.current);
        }
      };
      
      animate();
      console.log("Animation started");

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
        console.log("ParticleWave cleanup");
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        currentContainer.removeEventListener('mouseenter', handleMouseEnter);
        currentContainer.removeEventListener('mouseleave', handleMouseLeave);
        
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        
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
  }, [isHovering]); // Added isHovering to dependencies

  // Apply CSS module class to the container div
  return <div ref={containerRef} className={styles.particleContainer} style={{ position: 'fixed', width: '100%', height: '100%', zIndex: -1 }} />;
};

export default ParticleWave; 