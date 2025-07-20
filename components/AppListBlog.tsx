import React from "react";
import AppLink from "@/components/AppLink";

type AppListBlogProps = {
  data: {
    slug: string;
    title: string;
    excerpt: string;
    cover?: string;
  };
  small?: boolean;
};

export default function AppListBlog({ data, small = false }: AppListBlogProps) {
  const post = data;

  return (
    <AppLink href={`/${post.slug}/`} style={{
      textDecoration: "none",
      color: "inherit",
      display: "block"
    }}>
      <div style={{
        margin: "16px 0",
        cursor: "pointer",
        transition: "transform 0.2s ease"
      }}>
        {post.cover && (
          <div style={{
            width: "100%",
            height: small ? "200px" : "300px",
            borderRadius: "8px",
            overflow: "hidden",
            marginBottom: "16px"
          }}>
            <img 
              src={post.cover} 
              alt={post.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          </div>
        )}
        <h3 style={{
          fontFamily: "var(--font-space-grotesk)",
          fontSize: small ? "20px" : "24px",
          fontWeight: "bold",
          margin: "0 0 16px 0",
          lineHeight: "1.3"
        }}>
          {post.title}
        </h3>
        <p style={{
          fontFamily: "var(--font-instrument-sans)",
          fontWeight: "500",
          fontSize: small ? "14px" : "16px",
          color: "#666",
          margin: 0,
          lineHeight: "1.6",
          display: "-webkit-box",
          WebkitLineClamp: small ? 2 : 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}>
          {post.excerpt}
        </p>
      </div>
    </AppLink>
  );
} 