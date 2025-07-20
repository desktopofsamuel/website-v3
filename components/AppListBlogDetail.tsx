import React from "react";
import AppLink from "@/components/AppLink";
import dayjs from "dayjs";

type AppListBlogDetailProps = {
  data: {
    slug: string;
    title: string;
    description: string;
    category: string;
    date: string;
    cover?: string;
  };
};

export default function AppListBlogDetail({ data }: AppListBlogDetailProps) {
  const post = data;

  return (
    <AppLink href={`/${post.slug}/`} style={{
      textDecoration: "none",
      color: "inherit",
      display: "block"
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "40px",
        margin: "40px 0",
        alignItems: "center",
        cursor: "pointer",
        transition: "transform 0.2s ease"
      }}>
        {post.cover && (
          <div style={{
            position: "relative",
            width: "fit-content"
          }}>
            <div style={{
              width: "100%",
              height: "300px",
              borderRadius: "8px",
              overflow: "hidden"
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
          </div>
        )}
        <div>
          <p style={{
            fontSize: "14px",
            color: "#666",
            margin: "0 0 8px 0",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            {post.category} - {dayjs(post.date).format("MMM DD, YYYY")}
          </p>
          <h3 style={{
            fontSize: "24px",
            fontWeight: "bold",
            margin: "0 0 16px 0",
            lineHeight: "1.3"
          }}>
            {post.title}
          </h3>
          <p style={{
            fontSize: "16px",
            color: "#666",
            margin: 0,
            lineHeight: "1.6",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {post.description}
          </p>
        </div>
      </div>
    </AppLink>
  );
} 