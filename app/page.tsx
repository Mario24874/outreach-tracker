"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function AnimatedBeams() {
  const [mp, setMp] = useState({ x: "50%", y: "30%" });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMp({ x: `${e.clientX}px`, y: `${e.clientY}px` });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 55% 45% at 20% 15%, rgba(99,102,241,0.30), transparent 60%)",
            "radial-gradient(ellipse 45% 35% at 85% 25%, rgba(6,182,212,0.24), transparent 60%)",
            "radial-gradient(ellipse 65% 45% at 50% 105%, rgba(79,70,229,0.32), transparent 60%)",
          ].join(","),
          filter: "blur(10px)",
          animation: "mosAurora 18s ease-in-out infinite alternate",
        }}
      />
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.55 }}
        preserveAspectRatio="none"
        viewBox="0 0 1000 700"
      >
        <defs>
          {["#6366f1", "#06b6d4", "#818cf8", "#22d3ee", "#4f46e5", "#67e8f9"].map((c, i) => (
            <linearGradient key={i} id={`beam-${i}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor={c} stopOpacity="0.6" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          ))}
        </defs>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = 60 + i * 160;
          const dur = 6 + (i % 3) * 2.5;
          const delay = -i * 1.6;
          return (
            <line key={i} x1={x} y1="-200" x2={x + 80} y2="900" stroke={`url(#beam-${i})`} strokeWidth="1.4">
              <animate attributeName="y1" values="-300;700" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
              <animate attributeName="y2" values="-50;950" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
            </line>
          );
        })}
      </svg>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(rgba(148,163,184,0.05) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(148,163,184,0.05) 1px, transparent 1px)",
          ].join(","),
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 60% 60% at 50% 40%, #000 30%, transparent 90%)",
        }}
      />
      <div
        className="absolute inset-0 transition-all duration-100"
        style={{
          background: `radial-gradient(circle 380px at ${mp.x} ${mp.y}, rgba(99,102,241,0.18), transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}

function MOSLogo({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: size / 2, flexShrink: 0,
        background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 18px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
        color: "#fff", fontWeight: 800, fontSize: size * 0.42,
        letterSpacing: "-0.04em", position: "relative", overflow: "hidden",
      }}
    >
      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.12)", fontSize: size * 0.34, fontFamily: "monospace" }}>
        {"</>"}
      </span>
      <span style={{ position: "relative" }}>MM</span>
    </div>
  );
}

function Badge({ children, dot }: { children: React.ReactNode; dot?: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 999, background: "rgba(99,102,241,0.15)", color: "#a5b4fc", fontSize: 11, fontWeight: 600, letterSpacing: "0.01em", boxShadow: "inset 0 0 0 1px rgba(99,102,241,0.4), 0 0 18px rgba(99,102,241,0.4)", whiteSpace: "nowrap" }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 3, background: "#a5b4fc", boxShadow: "0 0 8px #a5b4fc" }} />}
      {children}
    </span>
  );
}

export default function LandingPage() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#020617", color: "#f8fafc", fontFamily: "Inter, sans-serif", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @keyframes mosHalo { 0%,100%{transform:scale(1);opacity:.9} 50%{transform:scale(1.1);opacity:1} }
        @keyframes mosAurora { 0%{transform:translate3d(0,0,0) scale(1)} 50%{transform:translate3d(-2%,2%,0) scale(1.05)} 100%{transform:translate3d(2%,-1%,0) scale(1.03)} }
      `}</style>

      <AnimatedBeams />

      {/* Nav */}
      <nav style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 56px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/mario-moreno.jpeg" alt="Mario Moreno" style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(99,102,241,0.5)", flexShrink: 0 }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em", color: "#f8fafc" }}>Mario Moreno</span>
            <span style={{ fontSize: 10, color: "#64748b", fontWeight: 500 }}>Tu proyecto, bajo control</span>
          </div>
        </div>
        <Link href="/login" style={{ padding: "7px 14px", height: 32, borderRadius: 10, fontWeight: 600, fontSize: 12, cursor: "pointer", background: "rgba(30,41,59,0.6)", color: "#f8fafc", border: "1px solid #334155", fontFamily: "inherit", display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
          Iniciar sesión
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 2, padding: "36px 56px 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 24 }}>

        <Badge dot>v1.0 · El portal está en línea</Badge>

        <h1 style={{ margin: 0, fontWeight: 700, fontSize: "clamp(38px, 5vw, 60px)", lineHeight: 1.04, letterSpacing: "-0.035em", maxWidth: 900, background: "linear-gradient(180deg, #f8fafc 0%, #94a3b8 130%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Tu espacio para seguir<br />cada detalle del proyecto.
        </h1>

        <p style={{ margin: 0, color: "#94a3b8", fontSize: 17, lineHeight: 1.55, maxWidth: 580, fontWeight: 400 }}>
          Un portal privado donde ves el avance, hablas conmigo por WhatsApp y guardas todo el historial en un solo lugar.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 22px", height: 46, borderRadius: 10, fontFamily: "inherit", fontWeight: 600, fontSize: 14, cursor: "pointer", background: "linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)", color: "#fff", border: "1px solid #4f46e5", boxShadow: "0 4px 14px -4px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.18)", textDecoration: "none" }}>
            Acceder a mi portal
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </Link>
          <a href="https://wa.me/584126504208" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 22px", height: 46, borderRadius: 10, fontFamily: "inherit", fontWeight: 600, fontSize: 14, cursor: "pointer", background: "rgba(30,41,59,0.6)", color: "#f8fafc", border: "1px solid #334155", textDecoration: "none" }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.6-5.8A8.5 8.5 0 1 1 8.2 19L3 21z"/></svg>
            Escribir a Mario
          </a>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4, color: "#64748b", fontSize: 12 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
            Acceso seguro con Clerk
          </span>
          <span>·</span>
          <span>mariomoreno.work</span>
        </div>
      </div>

      {/* Features */}
      <div style={{ position: "relative", zIndex: 2, padding: "70px 56px 56px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { title: "Estado en tiempo real", body: "Hitos, porcentaje de avance y última actualización siempre visibles.", icon: <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg> },
          { title: "WhatsApp directo", body: "Habla conmigo desde el mismo portal. Sin formularios, sin tickets.", icon: <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.6-5.8A8.5 8.5 0 1 1 8.2 19L3 21z"/></svg> },
          { title: "Historial completo", body: "Cada mensaje, archivo y solicitud queda guardado y buscable.", icon: <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M10 13h4M10 17h4"/></svg> },
        ].map((f, i) => (
          <div key={i} style={{ position: "relative", background: "rgba(15,23,42,0.5)", border: "1px solid #1e293b", borderRadius: 14, padding: 22, backdropFilter: "blur(6px)", boxShadow: "0 8px 24px -10px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(99,102,241,0.10)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              {f.icon}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: "#f8fafc" }}>{f.title}</div>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{f.body}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ position: "relative", zIndex: 2, padding: "24px 56px 32px", borderTop: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#64748b", fontSize: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/mario-moreno.jpeg" alt="Mario Moreno" style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover" }} />
          <span>Mario Moreno · mariomoreno.work</span>
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          <span>mariomoreno.work</span>
          <span>marioivanmorenopineda@gmail.com</span>
          <a href="https://wa.me/584126504208" target="_blank" rel="noopener noreferrer" style={{ color: "#64748b", textDecoration: "none" }}>WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
