// import React, { useState } from "react";
import React from "react";

import AppLink from "@/components/AppLink";

export default function AppNavBar() {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <>
      <header style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 20px" }}>
        <nav style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          padding: "32px 0"
        }}>
          <AppLink href="/" style={{ 
            fontSize: "24px", 
            fontWeight: "bold", 
            textDecoration: "none",
            color: "inherit"
          }}>
            Desktop of Samuel
          </AppLink>
          
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", gap: "16px" }}>
              <AppLink href="/" style={{ textDecoration: "none", color: "inherit" }}>Home</AppLink>
              <AppLink href="/about" style={{ textDecoration: "none", color: "inherit" }}>About</AppLink>
              <AppLink href="/blog" style={{ textDecoration: "none", color: "inherit" }}>Blog</AppLink>
              <AppLink href="/work" style={{ textDecoration: "none", color: "inherit" }}>Work</AppLink>
            </div>
            
            <button 
              // onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                display: "none",
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer"
              }}
            >
              ☰
            </button>
          </div>
        </nav>
      </header>
      
      {/* {isMenuOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "40px",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <button 
              onClick={() => setIsMenuOpen(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer"
              }}
            >
              ✕
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <AppLink href="/" style={{ textDecoration: "none", color: "inherit", fontSize: "24px" }}>Home</AppLink>
              <AppLink href="/about" style={{ textDecoration: "none", color: "inherit", fontSize: "24px" }}>About</AppLink>
              <AppLink href="/blog" style={{ textDecoration: "none", color: "inherit", fontSize: "24px" }}>Blog</AppLink>
              <AppLink href="/work" style={{ textDecoration: "none", color: "inherit", fontSize: "24px" }}>Work</AppLink>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
} 