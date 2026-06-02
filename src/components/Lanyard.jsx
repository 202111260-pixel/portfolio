/* eslint-disable react/no-unknown-property */
"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture, Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

import cardGLB from "./card.glb";
import lanyard from "./lanyard.png";

import * as THREE from "three";
import "./Lanyard.css";

extend({ MeshLineGeometry, MeshLineMaterial });

/* ---- custom ID-badge face, drawn on a canvas (your identity) ---- */
const BADGE = {
  name1: "MOHAMMED",
  name2: "AL HAJRI",
  role: "FULL-STACK & AI ENGINEER",
  id: "202111260",
  place: "GCET · MUSCAT, OMAN",
  chips: ["REACT", "NODE", "AI"],
};

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* the portrait, loaded once and shared */
let _photo = null;
let _photoTried = false;
function ensurePhoto(onReady) {
  if (_photo || _photoTried) {
    onReady();
    return;
  }
  _photoTried = true;
  const img = new Image();
  img.onload = () => {
    _photo = img;
    onReady();
  };
  img.onerror = () => onReady();
  img.src = "/me.jpeg"; // EDIT: your photo (in /public)
}

function drawBadge(ctx, w, h) {
  const bg = "#1d1e16";
  const bone = "#e9e7dd";
  const dim = "rgba(233,231,221,0.55)";
  const olive = "#9a9c78";

  ctx.clearRect(0, 0, w, h);
  // background
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#23241b");
  g.addColorStop(1, "#15160f");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // accent bars
  ctx.fillStyle = bone;
  ctx.fillRect(0, 0, w, 12);
  ctx.fillRect(0, h - 12, w, 12);

  // header
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = dim;
  ctx.font = "500 16px 'JetBrains Mono', monospace";
  ctx.textAlign = "left";
  ctx.fillText("PORTFOLIO / 2026", 36, 52);
  ctx.textAlign = "right";
  ctx.fillText("ID · " + BADGE.id, w - 36, 52);
  ctx.textAlign = "left";

  // photo
  const px = 36;
  const py = 78;
  const pw = 178;
  const ph = 214;
  if (_photo) {
    const iw = _photo.naturalWidth || _photo.width;
    const ih = _photo.naturalHeight || _photo.height;
    const boxAR = pw / ph;
    let sw = iw * 0.64;
    let sh = sw / boxAR;
    if (sh > ih) {
      sh = ih;
      sw = sh * boxAR;
    }
    const sx = (iw - sw) / 2;
    const sy = ih * 0.12;
    ctx.save();
    roundRect(ctx, px, py, pw, ph, 12);
    ctx.clip();
    ctx.fillStyle = "#e9e7dd";
    ctx.fillRect(px, py, pw, ph);
    ctx.drawImage(_photo, sx, sy, sw, sh, px, py, pw, ph);
    ctx.restore();
  } else {
    ctx.fillStyle = "rgba(233,231,221,0.08)";
    roundRect(ctx, px, py, pw, ph, 12);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(233,231,221,0.35)";
  ctx.lineWidth = 2;
  roundRect(ctx, px, py, pw, ph, 12);
  ctx.stroke();

  // name + role (right of photo)
  const tx = 232;
  ctx.fillStyle = bone;
  ctx.font = "900 40px Archivo, sans-serif";
  ctx.fillText(BADGE.name1, tx, 132);
  ctx.fillText(BADGE.name2, tx, 176);

  ctx.fillStyle = olive;
  ctx.font = "600 16px 'Space Grotesk', sans-serif";
  ctx.fillText("FULL-STACK", tx, 212);
  ctx.fillText("& AI ENGINEER", tx, 234);

  // status
  ctx.fillStyle = "#7bbf63";
  ctx.beginPath();
  ctx.arc(tx + 5, 272, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = dim;
  ctx.font = "600 13px 'JetBrains Mono', monospace";
  ctx.fillText("OPEN TO WORK", tx + 18, 277);

  // divider
  ctx.strokeStyle = "rgba(233,231,221,0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(36, 330);
  ctx.lineTo(w - 36, 330);
  ctx.stroke();

  // skill chips
  let cx = 36;
  const cy = 360;
  ctx.font = "600 16px 'JetBrains Mono', monospace";
  BADGE.chips.forEach((ch) => {
    const tw = ctx.measureText(ch).width;
    const pad = 14;
    const cw = tw + pad * 2;
    ctx.strokeStyle = "rgba(233,231,221,0.3)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, cx, cy, cw, 36, 8);
    ctx.stroke();
    ctx.fillStyle = bone;
    ctx.fillText(ch, cx + pad, cy + 24);
    cx += cw + 10;
  });

  // barcode
  const by = h - 148;
  const bh = 68;
  let bx = 36;
  ctx.fillStyle = bone;
  while (bx < w - 36) {
    const bw = 2 + Math.random() * 5;
    ctx.fillRect(bx, by, bw, bh);
    bx += bw + 2 + Math.random() * 4;
  }
  ctx.fillStyle = dim;
  ctx.font = "500 14px 'JetBrains Mono', monospace";
  ctx.textAlign = "left";
  ctx.fillText(BADGE.place, 36, by + bh + 24);
  ctx.textAlign = "right";
  ctx.fillText("MOHAMMED-ALHAJRI", w - 36, by + bh + 24);
  ctx.textAlign = "left";
}

function makeBadgeTexture() {
  const w = 512;
  const h = 720;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  drawBadge(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = false;
  tex.anisotropy = 16;

  const redraw = () => {
    drawBadge(ctx, w, h);
    tex.needsUpdate = true;
  };
  // redraw once the photo and webfonts are ready
  ensurePhoto(redraw);
  if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(redraw);
  }
  return tex;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
}) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }) {
  const band = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef();
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();
  const segmentProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };
  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyard);
  const badgeMap = useMemo(() => makeBadgeTexture(), []);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = "chordal";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (
              e.target.releasePointerCapture(e.pointerId), drag(false)
            )}
            onPointerDown={(e) => (
              e.target.setPointerCapture(e.pointerId),
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            )}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={badgeMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.2}
                roughness={0.62}
                metalness={0.12}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#2c2d22"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={0.6}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(cardGLB);
