import { useEffect, useRef, Suspense } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { Canvas } from "@react-three/fiber";
import {
  Float,
  Environment,
  ContactShadows,
  OrbitControls,
} from "@react-three/drei";
import { ArrowRight, Zap, Shield, Star } from "lucide-react";

// 3D Floating Device Model (geometric representation)
const FloatingDevice = () => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      {/* Phone body */}
      <group position={[0, 0, 0]} rotation={[0.2, -0.3, 0]}>
        {/* Main phone body */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 3.6, 0.15]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Screen */}
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[1.6, 3.2, 0.01]} />
          <meshStandardMaterial
            color="#0a0a0a"
            metalness={0.5}
            roughness={0}
            emissive="#c9a84c"
            emissiveIntensity={0.05}
          />
        </mesh>

        {/* Screen glow */}
        <mesh position={[0, 0, 0.09]}>
          <boxGeometry args={[1.55, 3.15, 0.001]} />
          <meshStandardMaterial
            color="#c9a84c"
            emissive="#c9a84c"
            emissiveIntensity={0.3}
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Camera bump */}
        <mesh position={[-0.4, 1.3, 0.1]} castShadow>
          <boxGeometry args={[0.7, 0.7, 0.08]} />
          <meshStandardMaterial color="#111111" metalness={1} roughness={0.1} />
        </mesh>

        {/* Camera lens 1 */}
        <mesh position={[-0.52, 1.45, 0.15]}>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
          <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0} />
        </mesh>

        {/* Camera lens 2 */}
        <mesh position={[-0.28, 1.45, 0.15]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 32]} />
          <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0} />
        </mesh>

        {/* Camera lens 3 */}
        <mesh position={[-0.4, 1.2, 0.15]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 32]} />
          <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0} />
        </mesh>

        {/* Side button */}
        <mesh position={[0.92, 0.5, 0]}>
          <boxGeometry args={[0.05, 0.4, 0.1]} />
          <meshStandardMaterial color="#222222" metalness={1} roughness={0.2} />
        </mesh>

        {/* Volume buttons */}
        <mesh position={[-0.92, 0.6, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.1]} />
          <meshStandardMaterial color="#222222" metalness={1} roughness={0.2} />
        </mesh>
        <mesh position={[-0.92, 0.2, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.1]} />
          <meshStandardMaterial color="#222222" metalness={1} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
};

// Orbiting particles
const Particles = () => {
  const count = 80;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#c9a84c"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const Hero = () => {
  const containerRef = useRef(null);
  const taglineRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const btnsRef = useRef(null);
  const statsRef = useRef(null);
  const canvasRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    // Tagline
    tl.fromTo(
      taglineRef.current,
      { y: 40, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)" },
    )
      // Heading lines stagger
      .fromTo(
        ".heading-line",
        { y: 80, opacity: 0, skewY: 3 },
        {
          y: 0,
          opacity: 1,
          skewY: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power4.out",
        },
        "-=0.3",
      )
      // Subtitle
      .fromTo(
        subRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        "-=0.5",
      )
      // Buttons
      .fromTo(
        ".hero-btn",
        { y: 30, opacity: 0, scale: 0.85 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(1.7)",
        },
        "-=0.4",
      )
      // Stats
      .fromTo(
        ".stat-card",
        { y: 40, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.5)",
        },
        "-=0.3",
      )
      // 3D Canvas
      .fromTo(
        canvasRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
        "-=1.2",
      )
      // Scroll indicator
      .fromTo(
        scrollRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.2",
      );

    // Scroll indicator bounce
    gsap.to(scrollRef.current, {
      y: 10,
      duration: 1.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2,
    });
  }, []);

  const stats = [
    { icon: <Zap size={18} />, value: "500+", label: "Products" },
    { icon: <Star size={18} />, value: "4.9★", label: "Rating" },
    { icon: <Shield size={18} />, value: "2 Yr", label: "Warranty" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-dark overflow-hidden flex items-center"
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* radial gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)",
          }}
        />
        {/* grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, #141414 100%)",
          }}
        />
        {/* bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40
          bg-gradient-to-t from-dark to-transparent"
        />
      </div>

      {/* ── Main Grid ── */}
      <div
        className="relative z-10 max-w-7xl mx-auto w-full
        px-4 sm:px-6 lg:px-8 pt-28 pb-16
        grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
      >
        {/* ── LEFT: Copy ── */}
        <div className="flex flex-col gap-6 sm:gap-8 order-2 lg:order-1">
          {/* Tagline badge */}
          <div
            ref={taglineRef}
            className="inline-flex w-fit items-center gap-2
              bg-dark-200 border border-accent/30 rounded-full
              px-4 py-2 shadow-lg shadow-accent/10"
          >
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full
                rounded-full bg-accent opacity-75"
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-xs sm:text-sm text-primary-300 font-medium tracking-widest uppercase">
              New Arrivals Just Dropped
            </span>
          </div>

          {/* Heading */}
          <div ref={headingRef} className="overflow-hidden space-y-1">
            <div
              className="heading-line font-display font-bold
              text-5xl sm:text-6xl lg:text-7xl text-light leading-none tracking-tight"
            >
              Future
            </div>
            <div
              className="heading-line font-display font-bold
              text-5xl sm:text-6xl lg:text-7xl leading-none tracking-tight"
            >
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #c9a84c 0%, #f0efed 50%, #c9a84c 100%)",
                }}
              >
                Tech,
              </span>
              <span className="text-light"> Today.</span>
            </div>
            <div
              className="heading-line font-display font-bold
              text-5xl sm:text-6xl lg:text-7xl text-primary-400 leading-none tracking-tight"
            >
              Delivered.
            </div>
          </div>

          {/* Sub */}
          <p
            ref={subRef}
            className="text-primary-400 text-sm sm:text-base leading-relaxed max-w-sm"
          >
            Premium smartphones & laptops, curated for those who demand the
            best. Fast delivery. Real warranty. Unbeatable prices.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Link
              to="/products"
              className="hero-btn group relative overflow-hidden
                bg-accent text-dark font-bold text-sm uppercase tracking-widest
                px-6 sm:px-8 py-3 sm:py-4 rounded-full
                hover:shadow-xl hover:shadow-accent/30
                transition-all duration-300 flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                Shop Now
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </span>
              {/* Shimmer effect */}
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                bg-gradient-to-r from-transparent via-white/20 to-transparent
                transition-transform duration-700 skew-x-12"
              />
            </Link>

            <Link
              to="/products?category=pc"
              className="hero-btn group border border-primary-600 text-light
                font-semibold text-sm uppercase tracking-widest
                px-6 sm:px-8 py-3 sm:py-4 rounded-full
                hover:border-accent hover:text-accent
                transition-all duration-300 flex items-center gap-2"
            >
              View PCs
              <ArrowRight
                size={16}
                className="opacity-0 -translate-x-2 group-hover:opacity-100
                  group-hover:translate-x-0 transition-all duration-300"
              />
            </Link>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="flex items-center gap-3 sm:gap-4 pt-2">
            {stats.map((s, i) => (
              <div
                key={i}
                className="stat-card flex-1 bg-dark-200 border border-dark-400
                  rounded-2xl p-3 sm:p-4 text-center
                  hover:border-accent/50 hover:bg-dark-300
                  transition-all duration-300 group cursor-default"
              >
                <div
                  className="flex items-center justify-center gap-1.5
                  text-accent mb-1 group-hover:scale-110 transition-transform duration-300"
                >
                  {s.icon}
                  <span className="font-bold text-light text-sm sm:text-base">
                    {s.value}
                  </span>
                </div>
                <p className="text-primary-500 text-[10px] sm:text-xs uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: 3D Canvas ── */}
        <div
          ref={canvasRef}
          className="order-1 lg:order-2 relative
            h-[300px] sm:h-[400px] lg:h-[600px] w-full"
        >
          {/* Glow behind canvas */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-64 h-64 sm:w-80 sm:h-80 rounded-full
              bg-accent/10 blur-[80px]"
            />
          </div>

          <Canvas
            camera={{ position: [0, 0, 6], fov: 45 }}
            style={{ background: "transparent" }}
          >
            <Suspense fallback={null}>
              {/* Lighting */}
              <ambientLight intensity={0.3} />
              <spotLight
                position={[5, 5, 5]}
                intensity={2}
                color="#c9a84c"
                castShadow
              />
              <spotLight
                position={[-5, -5, 3]}
                intensity={0.5}
                color="#f0efed"
              />
              <pointLight
                position={[0, 0, 3]}
                intensity={0.5}
                color="#c9a84c"
              />

              {/* 3D Phone */}
              <FloatingDevice />

              {/* Particles */}
              <Particles />

              {/* Ground shadow */}
              <ContactShadows
                position={[0, -2.5, 0]}
                opacity={0.4}
                scale={8}
                blur={2}
                color="#c9a84c"
              />

              {/* Environment */}
              <Environment preset="city" />

              {/* Subtle orbit for desktop */}
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={1.5}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 3}
              />
            </Suspense>
          </Canvas>

          {/* Floating label on 3D */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2
            bg-dark-200/90 backdrop-blur-md border border-accent/30
            rounded-2xl px-4 py-2 sm:px-5 sm:py-3 text-center
            shadow-xl pointer-events-none"
          >
            <p className="text-accent font-bold text-sm sm:text-base font-display tracking-wider">
              Samsung Galaxy S24 Ultra
            </p>
            <p className="text-primary-400 text-xs mt-0.5">
              From <span className="text-light font-semibold">$1,299</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <div
        ref={scrollRef}
        className="absolute bottom-6 left-1/2 -translate-x-1/2
          flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-primary-600 text-[10px] uppercase tracking-widest">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-accent/60 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
