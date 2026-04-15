"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export function AuditSphereContent({ status }: { status: "auditing" | "consistent" | "contradiction" }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  const getColor = () => {
    switch (status) {
      case "auditing":
        return "#00f0ff"; // Cyan
      case "consistent":
        return "#33ff66"; // Green
      case "contradiction":
        return "#ff3333"; // Red
    }
  };

  const getDistort = () => {
    if (status === "contradiction") return 0.6;
    if (status === "auditing") return 0.4;
    return 0.2; // consistent
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Sphere ref={meshRef} args={[1.5, 64, 64]} scale={1.5}>
        <MeshDistortMaterial
          color={getColor()}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={getDistort()} // Distort more when contradiction
          speed={status === "consistent" ? 1 : 3} // Rotate faster when auditing/contradiction
        />
      </Sphere>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={status === "auditing"} />
    </>
  );
}

export default function AuditSphere({ status }: { status: "auditing" | "consistent" | "contradiction" }) {
  return (
    <div className="w-full h-80 relative rounded-m">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <AuditSphereContent status={status} />
      </Canvas>
    </div>
  );
}
