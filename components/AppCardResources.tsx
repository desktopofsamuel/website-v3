"use client";

import useSWR from "swr";
import NextLink from "@/components/NextLink";
import fetcher from "@/lib/fetcher";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AppCardBase from "@/components/AppCardBase";

const AppCardResources = () => {
  const { data } = useSWR("/api/resources-career", fetcher, {
    refreshInterval: 120000, // 2 minutes for testing
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 30000,
  });

  return (
    <>
      <AppCardBase title="💼 Career resources">
        <div className="flex flex-col space-y-3">
          {!data ? (
            <>
              <Skeleton height="60px" />
              <Skeleton height="60px" />
              <Skeleton height="60px" />
            </>
          ) : (
            (data as any[])?.slice(0, 3).map((resource: any, i: number) => (
              <div key={i} className="p-3 rounded-md border border-gray-200 hover:bg-gray-50">
                <NextLink
                  href={resource.fields?.Link}
                  title={`View ${resource.fields?.Name}`}
                  target="_blank"
                >
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-base font-semibold leading-tight inline">
                        {resource.fields?.Name}
                      </h3>
                      <svg className="inline w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      {resource.fields?.Stage && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {resource.fields.Stage}
                        </span>
                      )}
                    </div>
                  </div>
                  {resource.fields?.Text && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {resource.fields.Text}
                    </p>
                  )}
                  {resource.fields?.Handle && (
                    <p className="text-xs text-gray-400 mt-1">
                      by {resource.fields.Handle}
                    </p>
                  )}
                </NextLink>
              </div>
            ))
          )}
        </div>
      </AppCardBase>
    </>
  );
};

export default AppCardResources;