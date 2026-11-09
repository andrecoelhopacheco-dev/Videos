// Teste de estética "massinha" (claymation) em 3D real no Remotion: formas de primitivas com superfície irregular,
// textura de digital/marca de ferramenta, luz quente + luz fria, sombras suaves e movimento "stop motion" a 12 qps
// (cada pose segura 2–3 quadros, com um tremidinho a cada troca, como massinha mexida à mão).
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { theme } from "../../tema";

const z = theme.zero;
const travar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const STOP = 12; // quadros por segundo da animação "na mão"

// Textura de relevo: marcas de dedo e de espátula (vai no bumpMap de todo material de massinha).
const useRelevo = () =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d")!;
    g.fillStyle = "#808080";
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 900; i++) {
      const x = random(`x${i}`) * 512;
      const y = random(`y${i}`) * 512;
      const r = 6 + random(`r${i}`) * 26;
      g.strokeStyle = random(`c${i}`) > 0.5 ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
      g.lineWidth = 1 + random(`w${i}`) * 2.5;
      g.beginPath();
      g.arc(x, y, r, random(`a${i}`) * 6.28, random(`a${i}`) * 6.28 + 1 + random(`b${i}`) * 2);
      g.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 2);
    return t;
  }, []);

const Massa: React.FC<{ cor: string; relevo: THREE.Texture; brilho?: number }> = ({ cor, relevo, brilho = 0.92 }) => (
  <meshPhysicalMaterial color={cor} roughness={brilho} bumpMap={relevo} bumpScale={1.6} sheen={0.12}
    sheenColor="#ffffff" clearcoat={0} />
);

// Esfera "amassada": raio varia um pouco com a posição (nada de esfera perfeita de computador).
const useBolota = (semente: string, amp = 0.035) =>
  useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 64, 48);
    const p = geo.attributes.position;
    const k1 = 3 + random(semente) * 4;
    const k2 = 3 + random(semente + "b") * 4;
    for (let i = 0; i < p.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(p, i);
      const d = 1 + amp * Math.sin(v.x * k1 + 1.3) * Math.sin(v.y * k2) * Math.cos(v.z * (k1 + 1));
      p.setXYZ(i, v.x * d, v.y * d, v.z * d);
    }
    geo.computeVertexNormals();
    return geo;
  }, [semente, amp]);

type Rosto = { sobInt: number; sobExt: number; palpebra: number; boca: number; cor: number };
const NEUTRO: Rosto = { sobInt: 0, sobExt: 0, palpebra: 0.35, boca: 0, cor: 0 };
const BRAVO: Rosto = { sobInt: -0.09, sobExt: 0.06, palpebra: 0.55, boca: -1, cor: 1 };

const Rafa: React.FC<{ r: Rosto; relevo: THREE.Texture; respira: number }> = ({ r, relevo, respira }) => {
  const cabeca = useBolota("cabeca", 0.03);
  const bolota = useBolota("bolota", 0.06);
  const pele = new THREE.Color(z.pele).lerp(new THREE.Color("#C8402F"), r.cor * 0.75).getStyle();
  const cachos = useMemo(() => Array.from({ length: 70 }, (_, i) => {
    const t = random(`t${i}`) * Math.PI * 2;
    const f = random(`f${i}`) * 1.15;
    return [Math.cos(t) * Math.sin(f) * 0.62, 0.12 + Math.cos(f) * 0.66, Math.sin(t) * Math.sin(f) * 0.6 - 0.04,
      0.11 + random(`s${i}`) * 0.05] as const;
  }), []);
  return (
    <group position={[0, 0, 0]}>
      {/* pernas e tênis */}
      {[-0.26, 0.26].map((x) => (
        <group key={x}>
          <mesh castShadow position={[x, 0.55, 0]}><capsuleGeometry args={[0.2, 0.75, 8, 24]} /><Massa cor={z.calca} relevo={relevo} /></mesh>
          <mesh castShadow position={[x, 0.08, 0.1]} scale={[0.24, 0.12, 0.36]} geometry={bolota}><Massa cor={z.tenis} relevo={relevo} /></mesh>
        </group>
      ))}
      {/* tronco com camiseta */}
      <mesh castShadow position={[0, 1.5 + respira, 0]} scale={[1.18, 1, 0.78]}>
        <capsuleGeometry args={[0.48, 0.62, 12, 32]} /><Massa cor={z.camiseta} relevo={relevo} />
      </mesh>
      {/* braços */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh castShadow position={[s * 0.68, 1.45, 0]} rotation={[0, 0, s * 0.12]}>
            <capsuleGeometry args={[0.14, 0.75, 8, 20]} /><Massa cor={pele} relevo={relevo} />
          </mesh>
          <mesh castShadow position={[s * 0.62, 1.86, 0]} scale={[0.22, 0.2, 0.22]} geometry={bolota}><Massa cor={z.camiseta} relevo={relevo} /></mesh>
        </group>
      ))}
      {/* pescoço */}
      <mesh position={[0, 2.12, 0]}><cylinderGeometry args={[0.17, 0.2, 0.3, 24]} /><Massa cor={pele} relevo={relevo} /></mesh>
      {/* cabeça */}
      <group position={[0, 2.78 + respira, 0]}>
        <mesh castShadow geometry={cabeca} scale={[0.6, 0.68, 0.56]}><Massa cor={pele} relevo={relevo} /></mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.6, 0.0, -0.02]} scale={[0.08, 0.15, 0.11]} geometry={bolota}><Massa cor={pele} relevo={relevo} /></mesh>
        ))}
        {cachos.map(([x, y, w, rr], i) => (
          <mesh key={i} castShadow position={[x, y, w]} scale={rr} geometry={bolota}><Massa cor={z.cabelo} relevo={relevo} brilho={0.9} /></mesh>
        ))}
        {/* olhos grandes de massinha branca, pupila e pálpebra de pele (o "olhar pesado" da referência) */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.22, 0.06, 0.45]}>
            <mesh scale={[0.17, 0.15, 0.1]} geometry={bolota}><Massa cor={z.branco} relevo={relevo} brilho={0.45} /></mesh>
            <mesh position={[0, -0.01, 0.09]} scale={[0.055, 0.055, 0.03]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#141010" roughness={0.3} /></mesh>
            <mesh position={[0, 0.15 - r.palpebra * 0.18, 0.02]} scale={[0.19, 0.11, 0.12]} rotation={[0, 0, s * r.sobInt * 2]}>
              <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><Massa cor={pele} relevo={relevo} />
            </mesh>
            {/* sobrancelha */}
            <mesh castShadow position={[s * 0.02, 0.24 + (r.sobInt + r.sobExt) / 2, 0.08]}
              rotation={[0, 0, Math.PI / 2 + s * (r.sobExt - r.sobInt) * 2.4]}>
              <capsuleGeometry args={[0.045, 0.2, 6, 12]} /><Massa cor={z.cabelo} relevo={relevo} brilho={0.9} />
            </mesh>
          </group>
        ))}
        {/* nariz */}
        <mesh position={[0, -0.1, 0.55]} scale={[0.09, 0.14, 0.1]} geometry={bolota}><Massa cor={pele} relevo={relevo} /></mesh>
        {/* boca: arco de massinha escura (sorri, reta ou para baixo) */}
        <mesh position={[0, -0.33 + r.boca * 0.04, 0.5]} rotation={[0, 0, r.boca >= 0 ? Math.PI : 0]}>
          <torusGeometry args={[0.12, 0.025, 10, 24, Math.PI * (0.55 + Math.abs(r.boca) * 0.25)]} />
          <Massa cor="#3A1712" relevo={relevo} />
        </mesh>
      </group>
    </group>
  );
};

const Kitnet: React.FC<{ relevo: THREE.Texture }> = ({ relevo }) => (
  <group>
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[14, 14]} /><Massa cor="#5B4A3E" relevo={relevo} /></mesh>
    <mesh receiveShadow position={[0, 3, -2.2]}><planeGeometry args={[14, 7]} /><Massa cor={z.parede} relevo={relevo} /></mesh>
    {/* janela com luzes da cidade */}
    <mesh position={[-1.9, 3.3, -2.18]}><planeGeometry args={[1.6, 1.8]} /><meshBasicMaterial color="#1A2742" /></mesh>
    {Array.from({ length: 16 }, (_, i) => (
      <mesh key={i} position={[-2.55 + (i % 4) * 0.42, 2.7 + Math.floor(i / 4) * 0.38, -2.17]}>
        <planeGeometry args={[0.1, 0.14]} /><meshBasicMaterial color={i % 3 ? "#F6C778" : "#9CC8F5"} />
      </mesh>
    ))}
    {[-2.4, -2.0, -1.6, -1.2].map((x) => (
      <mesh key={x} castShadow position={[x, 3.3, -2.1]}><boxGeometry args={[0.06, 1.8, 0.06]} /><Massa cor="#1B2232" relevo={relevo} /></mesh>
    ))}
    {/* mofo no canto */}
    <mesh position={[2.6, 5.4, -2.17]} scale={[1.6, 0.8, 1]}><circleGeometry args={[1, 32]} /><meshStandardMaterial color="#26303D" transparent opacity={0.6} /></mesh>
    {/* cama */}
    <mesh castShadow receiveShadow position={[-2.8, 0.35, -0.6]}><boxGeometry args={[2.4, 0.7, 1.6]} /><Massa cor="#55688C" relevo={relevo} /></mesh>
    <mesh castShadow position={[-3.4, 0.8, -0.6]} scale={[0.5, 0.18, 0.6]}><sphereGeometry args={[1, 24, 16]} /><Massa cor="#C9D2E0" relevo={relevo} /></mesh>
    {/* fogão de 2 bocas com panela e botijão */}
    <mesh castShadow receiveShadow position={[2.8, 0.6, -1.4]}><boxGeometry args={[1.6, 1.2, 1]} /><Massa cor="#8C96A8" relevo={relevo} /></mesh>
    <mesh castShadow position={[2.6, 1.45, -1.4]}><cylinderGeometry args={[0.32, 0.3, 0.42, 32]} /><Massa cor="#6D7686" relevo={relevo} brilho={0.5} /></mesh>
    <mesh castShadow position={[3.9, 0.45, -1.2]}><capsuleGeometry args={[0.3, 0.35, 8, 24]} /><Massa cor={z.botijao} relevo={relevo} /></mesh>
  </group>
);

const Camera: React.FC<{ pos: [number, number, number]; alvo: [number, number, number] }> = ({ pos, alvo }) => {
  const { camera } = useThree();
  camera.position.set(...pos);
  camera.lookAt(...alvo);
  camera.updateProjectionMatrix();
  return null;
};

export const TesteArgila: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const q = Math.floor((frame / fps) * STOP); // quadro "de stop motion"
  const tq = (q / STOP) * fps; // tempo segurado
  const tremor = (k: string) => (random(`${k}${q}`) - 0.5) * 0.012;
  const m = interpolate(tq, [42, 50], [0, 1], travar);
  const r: Rosto = {
    sobInt: NEUTRO.sobInt + (BRAVO.sobInt - NEUTRO.sobInt) * m,
    sobExt: NEUTRO.sobExt + (BRAVO.sobExt - NEUTRO.sobExt) * m,
    palpebra: NEUTRO.palpebra + (BRAVO.palpebra - NEUTRO.palpebra) * m,
    boca: NEUTRO.boca + (BRAVO.boca - NEUTRO.boca) * m,
    cor: m,
  };
  const relevo = useRelevo();
  const camZ = interpolate(tq, [0, 90], [8.5, 5.2], travar);
  const camY = interpolate(tq, [0, 90], [2.6, 2.75], travar);
  return (
    <ThreeCanvas width={width} height={height} shadows camera={{ fov: 32, position: [0.4, camY, camZ] }}
      style={{ background: "#0E1626" }}>
      <Camera pos={[0.5, camY, camZ]} alvo={[0, 2.35, 0]} />
      <color attach="background" args={["#0E1626"]} />
      <fog attach="fog" args={["#141C2B", 9, 18]} />
      <hemisphereLight args={["#9CB8E8", "#3A2A20", 0.55]} />
      <directionalLight castShadow position={[-3, 6, 4]} intensity={2.4} color="#FFD9A8"
        shadow-mapSize={[2048, 2048]} shadow-radius={6} shadow-bias={-0.0005} />
      <pointLight position={[-1.9, 3.3, -1.2]} intensity={6} distance={6} color="#8FB6FF" />
      <pointLight position={[2.5, 4.5, 2]} intensity={3} distance={9} color="#F6C778" />
      <group position={[tremor("x"), tremor("y"), 0]} rotation={[0, -0.12 + tremor("r"), 0]}>
        <Kitnet relevo={relevo} />
        <Rafa r={r} relevo={relevo} respira={Math.sin(tq / 9) * 0.015} />
      </group>
    </ThreeCanvas>
  );
};
