"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, RoundedBox } from "@react-three/drei";
import type { Board, Outcome, Player } from "@/lib/game";
import { PALETTE } from "./palette";
import { BEECH, createWoodTexture } from "./wood-texture";

const PITCH = 1.08; // distance between cell centres
const BOARD_SIZE = PITCH * 3 + 0.36;
const BOARD_TOP = 0.3;
const GROOVE_WIDTH = 0.08;
const GROOVE_DEPTH = 0.06;

export const cellPosition = (i: number): [number, number] => [
  ((i % 3) - 1) * PITCH,
  (Math.floor(i / 3) - 1) * PITCH,
];

type SceneProps = {
  board: Board;
  outcome: Outcome;
  round: number;
  /** Cell under the pointer or keyboard focus, shown as a ghost piece. */
  preview: number | null;
  /** Cell holding keyboard focus, outlined on the board. */
  focused: number | null;
  reducedMotion: boolean;
  onPreview: (index: number | null) => void;
  onPlay: (index: number) => void;
};

export default function Scene(props: SceneProps) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 2]}
      camera={{ fov: 32, position: [0, 9, 6.5] }}
      gl={{ antialias: true }}
      aria-hidden
    >
      <World {...props} />
    </Canvas>
  );
}

function World({ board, outcome, round, preview, focused, reducedMotion, onPreview, onPlay }: SceneProps) {
  const playing = outcome.kind === "playing";
  const winLine = outcome.kind === "win" ? outcome.line : null;

  return (
    <>
      <CameraRig reducedMotion={reducedMotion} />
      <hemisphereLight args={["#fff4e0", "#3b2414", 0.9]} />
      <directionalLight
        position={[-4.5, 9, 4]}
        intensity={2.4}
        color="#fff1dc"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={5}
      />
      {/* Soft occlusion where the board meets the desk. */}
      <ContactShadows position={[0, 0.002, 0]} scale={9} blur={2.5} opacity={0.5} far={1.2} resolution={512} color="#1a0c04" />
      {/* Soft window light baked into reflections so the lacquer catches a highlight. */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[-3, 5, 3]} scale={[6, 3, 1]} color="#fff3e2" />
        <Lightformer form="rect" intensity={1.2} position={[4, 3, -2]} scale={[4, 2, 1]} color="#ffd9a8" />
      </Environment>

      <Desk />
      <WoodBoard />

      {board.map((cell, i) =>
        cell ? (
          <Piece
            key={`${round}-${i}`}
            player={cell}
            index={i}
            winning={!!winLine?.includes(i)}
            reducedMotion={reducedMotion}
          />
        ) : null,
      )}

      {playing && preview !== null && board[preview] === null && (
        <Piece key={`ghost-${preview}`} player={outcome.next} index={preview} ghost reducedMotion />
      )}

      {outcome.kind === "win" && (
        <WinStrike
          key={`strike-${round}`}
          line={outcome.line}
          player={outcome.winner}
          reducedMotion={reducedMotion}
        />
      )}

      {focused !== null && <FocusRing index={focused} />}

      {board.map((cell, i) => (
        <CellTarget
          key={i}
          index={i}
          enabled={playing && cell === null}
          onPreview={onPreview}
          onPlay={onPlay}
        />
      ))}
    </>
  );
}

/** Frames the board for the viewport shape and drifts slightly with the pointer. */
function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const target = useRef(new THREE.Vector3());
  const base = useRef(new THREE.Vector3());
  const lastSize = useRef("");

  useFrame((state, delta) => {
    const { size, pointer } = state;
    const camera = state.camera as THREE.PerspectiveCamera;
    const key = `${size.width}x${size.height}`;
    const resized = key !== lastSize.current;
    if (resized) {
      lastSize.current = key;
      const { width: w, height: h } = size;
      const wide = w >= 1024;
      // Space the DOM overlay leaves free for the board (must track the layout in game.tsx).
      const top = wide ? 190 : w >= 640 ? 170 : 124;
      const bottom = wide ? 60 : w >= 640 ? 360 : 290;
      const right = wide ? Math.min(460, w * 0.34) : 0;
      const freeW = w - right;
      const freeH = Math.max(h - top - bottom, h * 0.35);
      // Distance that fits the board (plus a margin) inside the free area, by width and by height.
      const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const fitW = (BOARD_SIZE * 1.15) / (2 * tanHalf * (freeW / h));
      const fitH = (BOARD_SIZE * 0.95) / (2 * tanHalf * (freeH / h));
      const distance = Math.max(fitW, fitH, 9);
      target.current.set(0, 0, 0);
      base.current.set(0, distance * 0.82, distance * 0.58);
      // Slide the rendered frame so the board centres in the free area, not the viewport.
      const freeCx = freeW / 2;
      const freeCy = top + freeH / 2;
      camera.setViewOffset(w, h, w / 2 - freeCx, h / 2 - freeCy, w, h);
      camera.updateProjectionMatrix();
    }
    if (reducedMotion || resized) {
      camera.position.copy(base.current);
    } else {
      // Drift a little toward the pointer, like leaning over the table.
      const k = 1 - Math.exp(-delta * 2.5);
      camera.position.x += (base.current.x + pointer.x * 0.35 - camera.position.x) * k;
      camera.position.z += (base.current.z - pointer.y * 0.2 - camera.position.z) * k;
      camera.position.y = base.current.y;
    }
    camera.lookAt(target.current);
  });

  return null;
}

function Desk() {
  const map = useMemo(() => {
    const t = createWoodTexture({
      base: PALETTE.walnut,
      grain: PALETTE.walnutGrain,
      spacing: 9,
      waviness: 3,
      seed: 7,
    });
    t.repeat.set(2, 5);
    return t;
  }, []);
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial map={map} roughness={0.62} />
    </mesh>
  );
}

function WoodBoard() {
  const map = useMemo(() => createWoodTexture(BEECH), []);
  // The playing surface is cut into raised tiles, so the grooves between them are real
  // channels whose walls catch the key light.
  const floorY = BOARD_TOP - GROOVE_DEPTH;
  const tile = PITCH - GROOVE_WIDTH;
  const inner = (PITCH * 3) / 2 + GROOVE_WIDTH / 2; // inner edge of the rim
  const outer = BOARD_SIZE / 2;
  const rimW = outer - inner;
  const rims: [number, number, number, number][] = [
    // [x, z, sizeX, sizeZ]
    [0, -(inner + rimW / 2), BOARD_SIZE, rimW],
    [0, inner + rimW / 2, BOARD_SIZE, rimW],
    [-(inner + rimW / 2), 0, rimW, inner * 2],
    [inner + rimW / 2, 0, rimW, inner * 2],
  ];
  const wood = <meshStandardMaterial map={map} roughness={0.5} />;
  return (
    <group>
      <RoundedBox
        args={[BOARD_SIZE, floorY, BOARD_SIZE]}
        radius={0.1}
        smoothness={4}
        position={[0, floorY / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial map={map} color={PALETTE.groove} roughness={0.85} />
      </RoundedBox>
      {Array.from({ length: 9 }, (_, i) => {
        const [x, z] = cellPosition(i);
        return (
          <RoundedBox
            key={i}
            args={[tile, GROOVE_DEPTH + 0.02, tile]}
            radius={0.012}
            smoothness={2}
            position={[x, floorY + (GROOVE_DEPTH - 0.02) / 2, z]}
            castShadow
            receiveShadow
          >
            {wood}
          </RoundedBox>
        );
      })}
      {rims.map(([x, z, sx, sz], i) => (
        <mesh key={i} position={[x, floorY + GROOVE_DEPTH / 2 - 0.01, z]} castShadow receiveShadow>
          <boxGeometry args={[sx, GROOVE_DEPTH + 0.02, sz]} />
          {wood}
        </mesh>
      ))}
    </group>
  );
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

function Piece({
  player,
  index,
  winning = false,
  ghost = false,
  reducedMotion,
}: {
  player: Player;
  index: number;
  winning?: boolean;
  ghost?: boolean;
  reducedMotion: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const [x, z] = cellPosition(index);
  const restY = BOARD_TOP;
  // Drop state: height and vertical speed, simulated per frame with a damped bounce.
  const instant = reducedMotion || ghost;
  const startY = instant ? restY : restY + 2.4;
  const sim = useRef({ y: startY, v: 0, settled: instant, tilt: instant ? 0 : 0.35 });
  const win = useRef({ t: 0 });
  const yaw = useMemo(() => ((index * 37) % 11) / 11 - 0.5, [index]) * 0.25;

  useFrame((_, rawDelta) => {
    const g = ref.current;
    if (!g) return;
    const delta = Math.min(rawDelta, 1 / 30);
    const s = sim.current;
    if (!s.settled) {
      s.v -= 22 * delta;
      s.y += s.v * delta;
      if (s.y <= restY) {
        s.y = restY;
        s.v = -s.v * 0.32;
        if (Math.abs(s.v) < 0.6) {
          s.v = 0;
          s.settled = true;
        }
      }
      s.tilt *= Math.exp(-delta * 6);
    }
    let lift = 0;
    let spin = 0;
    if (winning && s.settled) {
      win.current.t = Math.min(win.current.t + delta / 0.9, 1);
      const p = win.current.t;
      lift = reducedMotion ? 0.12 : Math.sin(Math.PI * p) * 0.55 + (p >= 1 ? 0.12 : 0.12 * p);
      spin = reducedMotion ? 0 : easeOutCubic(p) * Math.PI * 2;
    }
    g.position.set(x, s.y + lift, z);
    g.rotation.set(s.tilt, yaw + spin, s.tilt * 0.6);
  });

  const color = player === "X" ? PALETTE.cobalt : PALETTE.vermilion;
  const material = (
    <meshPhysicalMaterial
      color={color}
      roughness={0.32}
      clearcoat={1}
      clearcoatRoughness={0.12}
      transparent={ghost}
      opacity={ghost ? 0.38 : 1}
      depthWrite={!ghost}
      emissive={winning ? color : "#000000"}
      emissiveIntensity={winning ? 0.18 : 0}
    />
  );

  return (
    <group ref={ref} position={[x, startY, z]}>
      {player === "X" ? (
        <>
          {[Math.PI / 4, -Math.PI / 4].map((r) => (
            <RoundedBox
              key={r}
              args={[0.86, 0.24, 0.24]}
              radius={0.08}
              smoothness={4}
              position={[0, 0.12, 0]}
              rotation-y={r}
              castShadow={!ghost}
            >
              {material}
            </RoundedBox>
          ))}
        </>
      ) : (
        <mesh position={[0, 0.12, 0]} rotation-x={Math.PI / 2} castShadow={!ghost}>
          <torusGeometry args={[0.3, 0.12, 24, 64]} />
          {material}
        </mesh>
      )}
    </group>
  );
}

/** A painted stroke through the winning three, drawn out from the first square. */
function WinStrike({
  line,
  player,
  reducedMotion,
}: {
  line: readonly [number, number, number];
  player: Player;
  reducedMotion: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const progress = useRef(reducedMotion ? 1 : 0);
  const [ax, az] = cellPosition(line[0]);
  const [cx, cz] = cellPosition(line[2]);
  const length = Math.hypot(cx - ax, cz - az) + 0.35;
  const angle = -Math.atan2(cz - az, cx - ax);

  useFrame((_, delta) => {
    if (!ref.current) return;
    // Wait for the last piece to land, then draw the stroke out.
    progress.current = Math.min(progress.current + delta / 0.55, 1.6);
    const p = Math.max(0, Math.min((progress.current - 0.35) / 0.65, 1));
    const s = reducedMotion ? 1 : easeOutCubic(p);
    ref.current.scale.set(Math.max(s, 0.0001), 1, 1);
  });

  return (
    <group position={[(ax + cx) / 2, BOARD_TOP + 0.006, (az + cz) / 2]} rotation-y={angle}>
      {/* Anchor the scale at the first square so the stroke grows from there. */}
      <group ref={ref} position={[-length / 2, 0, 0]} scale={[reducedMotion ? 1 : 0.0001, 1, 1]}>
        <RoundedBox args={[length, 0.02, 0.16]} radius={0.008} smoothness={2} position={[length / 2, 0, 0]} receiveShadow>
          <meshPhysicalMaterial
            color={player === "X" ? PALETTE.cobalt : PALETTE.vermilion}
            roughness={0.32}
            clearcoat={1}
            clearcoatRoughness={0.12}
          />
        </RoundedBox>
      </group>
    </group>
  );
}

/** Chalk-white square outline marking the keyboard-focused cell. */
function FocusRing({ index }: { index: number }) {
  const [x, z] = cellPosition(index);
  const r = PITCH * 0.47;
  return (
    <mesh position={[x, BOARD_TOP + 0.004, z]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
      <ringGeometry args={[r * Math.SQRT2 - 0.06, r * Math.SQRT2, 4, 1]} />
      <meshBasicMaterial color="#fffaf0" toneMapped={false} />
    </mesh>
  );
}

function CellTarget({
  index,
  enabled,
  onPreview,
  onPlay,
}: {
  index: number;
  enabled: boolean;
  onPreview: (index: number | null) => void;
  onPlay: (index: number) => void;
}) {
  const [x, z] = cellPosition(index);
  const setCursor = (c: string) => (document.body.style.cursor = c);
  return (
    <mesh
      position={[x, BOARD_TOP + 0.02, z]}
      rotation-x={-Math.PI / 2}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        if (!enabled) return;
        setCursor("pointer");
        onPreview(index);
      }}
      onPointerOut={() => {
        setCursor("");
        onPreview(null);
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (!enabled) return;
        onPlay(index);
        setCursor("");
        onPreview(null);
      }}
    >
      <planeGeometry args={[PITCH * 0.96, PITCH * 0.96]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
