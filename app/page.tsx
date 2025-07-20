import AppLink from "@/components/AppLink";

export default function AppRouterTestPage() {
  return (
    <div style={{ 
      maxWidth: "1080px", 
      margin: "0 auto", 
      padding: "32px 20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <h1 style={{ 
        fontSize: "48px", 
        fontWeight: "bold", 
        marginBottom: "16px",
        marginTop: 0
      }}>
        App Router Test Page
      </h1>
      
      <p style={{ 
        fontSize: "18px", 
        marginBottom: "24px",
        lineHeight: "1.6"
      }}>
        This page is using the Next.js 15 App Router. If you can see this, 
        the App Router is working correctly!
      </p>

      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ 
          fontSize: "24px", 
          fontWeight: "bold", 
          marginBottom: "8px",
          marginTop: 0
        }}>
          What's different in App Router:
        </h2>
        <ul style={{ 
          fontSize: "16px", 
          lineHeight: "1.6",
          margin: 0,
          paddingLeft: "20px"
        }}>
          <li>Server Components by default</li>
          <li>Built-in layouts and nested routing</li>
          <li>Streaming and Suspense</li>
          <li>Improved performance and SEO</li>
        </ul>
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <AppLink href="/test" style={{
          display: "inline-block",
          background: "#0070f3",
          color: "white",
          padding: "12px 24px",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "bold"
        }}>
          Go to Pages Router Test
        </AppLink>
        
        <AppLink href="/blog" style={{
          display: "inline-block",
          background: "#28a745",
          color: "white",
          padding: "12px 24px",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "bold"
        }}>
          View Article Page
        </AppLink>
      </div>
    </div>
  );
} 