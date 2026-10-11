import ConstellationMount from "@/components/constellation/ConstellationMount";
import ShaderMount from "@/components/webgl/ShaderMount";

/** Fixed depth layers: grid (z0), hero shader (z1), constellation (z10). Grain is a separate top layer. */
export default function Backdrop() {
  return (
    <>
      <div className="bg-grid" aria-hidden />
      <ShaderMount />
      <ConstellationMount />
      <div className="bg-grain" aria-hidden />
    </>
  );
}
