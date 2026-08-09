"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Vanilla Three.js hero scene: a noise-displaced icosahedron with a
 * fresnel rim + a slow particle halo. Imperative so it stays fully under
 * our control and avoids R3F peer-dependency friction with React 19 / Next 16.
 *
 * Performance guards:
 *  - devicePixelRatio capped at 2
 *  - geometry detail & particle count scaled down on small screens
 *  - rAF paused when the tab is hidden or the canvas is off-screen
 *  - full GPU teardown on unmount (dispose geometry/material/renderer)
 *  - static single frame when prefers-reduced-motion is set
 */
export default function HeroScene({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isSmall,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const group = new THREE.Group();
    scene.add(group);

    // ── Displaced blob ────────────────────────────────────────────
    const detail = isSmall ? 24 : 48;
    const geometry = new THREE.IcosahedronGeometry(1.35, detail);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color("#c6f24e") },
      uColorB: { value: new THREE.Color("#6b5bff") },
      uColorC: { value: new THREE.Color("#08080c") },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform vec2  uMouse;
        varying float vNoise;
        varying vec3  vNormalW;
        varying vec3  vViewDir;

        // Ashima simplex noise 3D (public domain)
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
        float snoise(vec3 v){
          const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
          vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
          vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
          vec3 x1=x0-i1+1.0*C.xxx; vec3 x2=x0-i2+2.0*C.xxx; vec3 x3=x0-1.0+3.0*C.xxx;
          i=mod(i,289.0);
          vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
          float n_=1.0/7.0; vec3 ns=n_*D.wyz-D.xzx;
          vec4 j=p-49.0*floor(p*ns.z*ns.z);
          vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
          vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
          vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
          vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
          vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
          vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
          vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
          p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
          vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
          return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
        }

        void main(){
          float t = uTime * 0.32;
          float n = snoise(normal * 1.1 + vec3(t));
          n += 0.5 * snoise(normal * 2.4 + vec3(t * 1.4));
          float mouseAmp = 0.18 + length(uMouse) * 0.25;
          vNoise = n;
          vec3 displaced = position + normal * n * (0.32 + mouseAmp);
          vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
          vNormalW = normalize(normalMatrix * normal);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        varying float vNoise;
        varying vec3  vNormalW;
        varying vec3  vViewDir;

        void main(){
          float fres = pow(1.0 - max(dot(vNormalW, vViewDir), 0.0), 2.4);
          float mixv = smoothstep(-0.6, 0.8, vNoise);
          vec3 base = mix(uColorC, uColorB, mixv);
          base = mix(base, uColorA, fres);
          float glow = fres * 0.9 + smoothstep(0.4, 1.0, vNoise) * 0.25;
          vec3 col = base + uColorA * glow * 0.5;
          gl_FragColor = vec4(col, 0.92);
        }
      `,
    });

    const blob = new THREE.Mesh(geometry, material);
    group.add(blob);

    // ── Particle halo ─────────────────────────────────────────────
    const count = isSmall ? 600 : 1600;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      size: isSmall ? 0.02 : 0.016,
      color: new THREE.Color("#c6f24e"),
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(pGeo, pMat);
    group.add(points);

    // ── Resize ────────────────────────────────────────────────────
    // ResizeObserver handles the canvas getting real dimensions after mount
    // (it can briefly measure 0×0 before layout settles), which a one-shot
    // window-resize listener would miss.
    const resize = () => {
      const w = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      render();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("resize", resize);

    // ── Pointer parallax ──────────────────────────────────────────
    const mouse = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // ── Loop with visibility gating ───────────────────────────────
    let raf = 0;
    let inView = true;
    let elapsed = 0;
    let lastT: number | null = null;

    const render = () => {
      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;
      uniforms.uTime.value = elapsed;
      uniforms.uMouse.value.set(mouse.x, mouse.y);
      group.rotation.y += 0.0015;
      group.rotation.x = mouse.y * 0.25;
      group.rotation.z = mouse.x * 0.12;
      points.rotation.y -= 0.0008;
      camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.4 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    const loop = (t: number) => {
      if (lastT !== null) elapsed += (t - lastT) / 1000;
      lastT = t;
      render();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!raf && inView && !document.hidden) {
        lastT = null; // avoid a time jump after a pause
        raf = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    };

    const io = new IntersectionObserver(
      ([entry]) => { inView = entry.isIntersecting; inView ? start() : stop(); },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) {
      render(); // single static frame
    } else {
      start();
    }

    // ── Teardown ──────────────────────────────────────────────────
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      material.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
