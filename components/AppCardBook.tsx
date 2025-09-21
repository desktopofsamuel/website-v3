"use client";

import useSWR from "swr";
import AppLink from "@/components/AppLink"
import fetcher from "@/lib/fetcher";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AppCardBase from "@/components/AppCardBase";

const AppCardBook = () => {
  const { data } = useSWR("/api/books", fetcher, {
    refreshInterval: 60000, // 60 seconds for testing
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 15000,
  });

  return (
    <>
      <AppCardBase title="📚 Recently reading">
        {!data ? (
          <>
            <Skeleton width="50%" /> <Skeleton />
            <Skeleton width="50%" /> <Skeleton />
            <Skeleton width="50%" /> <Skeleton />
            <Skeleton width="50%" /> <Skeleton />
          </>
        ) : (
          (data as any[])?.map((item: any, i: number) => (
            <div key={i} className="mb-2 rounded-2xl gap-2 grid">
              <div>
                <AppLink
                  href={item.link}
                  title={`Read more about ${item.name} on Oku`}
                  target="_blank"
                >
                  <div>
                    <h3 className="my-0 text-base font-bold leading-loose inline mr-2">
                      {item.name || <Skeleton />}
                    </h3>
                    <svg className="inline w-3 h-3 mb-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </AppLink>
                <p className="m-0 text-xs text-gray-500 uppercase">
                  {`by ${item.author}` || <Skeleton />}
                </p>
              </div>
            </div>
          ))
        )}
      </AppCardBase>
    </>
  );
};

export default AppCardBook;