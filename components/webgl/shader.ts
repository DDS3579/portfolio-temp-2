export const VERT = `#version 300 es
precision highp float;
void main() {
  // One full-screen triangle, no buffers.
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export const FRAG = `#version 300 es
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uLight;      // 0..1, origin top-left
uniform float uIntensity; // 0..1 ignition ramp
out vec4 o;

float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y);
}
float fbm(vec2 p){
  float v=0.0, a=0.5;
  for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.02+vec2(3.1,1.7); a*=0.5; }
  return v;
}
float fog(vec2 uv){
  vec2 q = uv*vec2(uRes.x/uRes.y,1.0)*1.6;
  float t = uTime*0.03;
  return fbm(q + vec2(t, -t*0.6) + fbm(q*0.7 - t));
}

// Ray-march density: 2 octaves, no domain warp. ~5x cheaper than fog(), visually the same at ray scale.
float fogLite(vec2 uv){
  vec2 q = uv*vec2(uRes.x/uRes.y,1.0)*1.6 + vec2(uTime*0.03, -uTime*0.018);
  return noise(q)*0.62 + noise(q*2.03+vec2(3.1,1.7))*0.38;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes; uv.y = 1.0 - uv.y;
  float asp = uRes.x/uRes.y;
  vec2 d = uv - uLight; d.x *= asp;
  float dist = length(d);

  const vec3 BG   = vec3(0.0235,0.0275,0.0392);
  const vec3 COOL = vec3(0.251,0.408,0.627);
  const vec3 KEY  = vec3(0.910,0.690,0.294);
  const vec3 CORE = vec3(1.000,0.851,0.627);
  const vec3 EMBER= vec3(0.788,0.396,0.169);

  float f = fog(uv);
  vec3 col = BG + COOL*0.10*smoothstep(0.25,0.85,f);

  // god-rays: 14 jittered samples toward the light through the cheap density field
  float rays = 0.0; float decay = 1.0;
  vec2 stepv = (uLight - uv) / 14.0;
  vec2 p = uv + stepv * hash(gl_FragCoord.xy);
  for(int i=0;i<14;i++){
    p += stepv;
    float dens = smoothstep(0.35,0.8,fogLite(p));
    rays += (1.0 - dens*0.85) * decay;
    decay *= 0.92;
  }
  rays /= 14.0;
  float reach = exp(-dist*2.4);

  float glow = exp(-dist*7.5);
  vec3 warm = mix(EMBER, KEY, smoothstep(0.0,0.35,glow));
  warm = mix(warm, CORE, smoothstep(0.35,1.0,glow));
  col += warm * (glow*0.55 + rays*reach*0.32 * (0.5+f)) * uIntensity;
  // fog catches the light
  col += KEY * 0.10 * smoothstep(0.3,0.8,f) * reach * uIntensity;

  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.004; // dither, avoids banding
  o = vec4(col, 1.0);
}`;
