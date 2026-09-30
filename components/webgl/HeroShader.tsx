"use client";
import { useEffect, useRef } from "react";
import { clamp } from "@/lib/ease";
import { subscribe } from "@/lib/loop";
import { igniteRamp, scene } from "@/lib/scene";
import { FRAG, VERT } from "./shader";

type Nav = Navigator & { connection?: { saveData?: boolean } };

/** WebGL2 fog + god-rays lit from the root node. Fixed background layer, fades out as the hero scrolls away.
 *  Renders nothing (CSS gradient fallback shows) when unsupported, saving data, or too slow. */
export default function HeroShader() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if ((navigator as Nav).connection?.saveData) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindVertexArray(gl.createVertexArray());
    const u = {
      res: gl.getUniformLocation(prog, "uRes"),
      time: gl.getUniformLocation(prog, "uTime"),
      light: gl.getUniformLocation(prog, "uLight"),
      inten: gl.getUniformLocation(prog, "uIntensity"),
    };

    let scale = 0.6;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(2, Math.round(window.innerWidth * dpr * scale));
      canvas.height = Math.max(2, Math.round(window.innerHeight * dpr * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    size();
    window.addEventListener("resize", size);

    let visible = true;
    let stopped = false;
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting), { threshold: 0 });
    io.observe(canvas);

    const html = document.documentElement;
    const draw = (t: number, intensity: number) => {
      html.dataset.shader = "live";
      const lx = scene.lightX || window.innerWidth * 0.62;
      const ly = scene.lightY || window.innerHeight * 0.38;
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, t / 1000);
      gl.uniform2f(u.light, lx / window.innerWidth, ly / window.innerHeight);
      gl.uniform1f(u.inten, intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // Adaptive guard: first 30 frames avg > 24ms -> 0.4x; still slow -> stop and use the CSS gradient.
    let frames = 0;
    let acc = 0;
    let stage = 0;
    let off = () => {};

    const fadeTo = (v: number) => (canvas.style.opacity = String(v));
    canvas.style.opacity = "0";

    if (reduced) {
      // One static, lit frame.
      requestAnimationFrame(() => {
        draw(4000, 1);
        fadeTo(1);
      });
    } else {
      off = subscribe((dt, t) => {
        if (stopped) return;
        const fade = clamp(1 - window.scrollY / (window.innerHeight * 0.9));
        canvas.style.opacity = String(fade);
        if (!visible || fade <= 0.01) return;
        frames++;
        acc += dt * 1000;
        if (frames === 30) {
          const avg = acc / frames;
          frames = 0;
          acc = 0;
          if (avg > 24) {
            if (stage === 0) { stage = 1; scale = 0.4; size(); }
            else { stopped = true; canvas.style.opacity = "0"; delete html.dataset.shader; return; }
          }
        }
        draw(t, igniteRamp(t));
      }, 5);
    }

    return () => {
      off();
      delete html.dataset.shader;
      io.disconnect();
      window.removeEventListener("resize", size);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] h-dvh w-full"
      style={{ opacity: 0 }}
    />
  );
}
