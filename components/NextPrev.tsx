import { Work } from "contentlayer/generated";
import React from "react";
import AppLink from "@/components/AppLink";

const NextPrev = ({
  prevPost,
  nextPost,
}: {
  nextPost: Work;
  prevPost: Work;
}) => {
  return (
    <div className="my-16">
      {/* {prevPost && (
        <AppLink href={`/work/${prevPost.slug}`}>
          <button>Previous: {prevPost.title}</button>
        </AppLink>
      )} */}
      {nextPost && (
        <div className="border border-border px-8 py-6 rounded-md">
          <AppLink href={`/work/${nextPost.slug}`} className="no-underline">
            <div className="text-secondarytext text-sm mb-1">Read next →</div>
            <div className="text-lg font-bold">{nextPost.title}</div>
          </AppLink>
        </div>
      )}
    </div>
  );
};

export default NextPrev;
