"use client";

import useSWR from 'swr';

interface FeedItem {
  id: string;
  fields: {
    EntryName: string;
    Description: string;
    Link?: string;
    CTA?: string;
    EntryDate: string;
    LastUpdateTime: string;
    Metadata?: string;
  };
}

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch feed data');
  return res.json();
});

function FeedSkeleton() {
  return (
    <div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="relative border-l-2 border-gray-200 pl-8 ml-4 pb-8 last:pb-2 animate-pulse">
          <div className="absolute left-[-5px] top-3 w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="flex flex-col space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FeedContent() {
  const { data: feedData, error, isLoading } = useSWR('/api/feed', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">Error loading feed: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!feedData || feedData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No feed items found.</p>
      </div>
    );
  }

  // Group items by year and month
  const groupedByYearMonth = (feedData || []).reduce((acc: { [key: string]: { [key: string]: FeedItem[] } }, item: FeedItem) => {
    const date = new Date(item.fields.EntryDate);
    const year = date.getFullYear().toString();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    
    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][month]) {
      acc[year][month] = [];
    }
    acc[year][month].push(item);
    return acc;
  }, {});

  // Sort years in descending order
  const sortedYears = Object.keys(groupedByYearMonth).sort((a, b) => parseInt(b) - parseInt(a));

  // Month colors for visual variety
  const monthColors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
    'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
    'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-rose-500'
  ];

  const getMonthColor = (month: string) => {
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();
    return monthColors[monthIndex] || 'bg-gray-500';
  };

  return (
    <div>
      {sortedYears.map((year, yearIndex) => (
        <div key={year} className={yearIndex > 0 ? 'mt-16' : ''}>
          {/* Year heading */}
          <div className="mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-800 tracking-wide">
              {year}
            </h2>
            </div>

          {/* Month groups */}
          {Object.keys(groupedByYearMonth[year])
            .sort((a, b) => new Date(`${b} 1, 2000`).getMonth() - new Date(`${a} 1, 2000`).getMonth())
            .map((month) => (
            <div key={`${year}-${month}`} className="mb-12">
              {/* Feed items for this month */}
              {groupedByYearMonth[year][month].map((item: FeedItem) => (
                <article
                  key={item.id}
                  className="relative border-l border-gray-200 pl-16 ml-8 pb-6 last:pb-2 group"
                >
                  {/* Month circle with year above */}
                  <div className="absolute left-[-16px] top-0 flex flex-col items-center">
                    <div className={`w-8 h-8 ${getMonthColor(month)} rounded-full flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-heading text-xs font-semibold">
                        {month}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-heading font-medium text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {item.fields.EntryName}
                        </h3>
                        
                        {item.fields.Description && (
                          <p className="text-gray-600 leading-relaxed mt-2 text-sm">
                            {item.fields.Description}
                          </p>
                        )}
                      </div>

                      {/* Minimal CTA */}
                      {item.fields.CTA && item.fields.Link && (
                        <a
                          href={item.fields.Link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-4 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 flex-shrink-0"
                          title={item.fields.CTA}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )}
                    </div>

                    <time className="text-xs text-gray-400 font-medium">
                      {new Date(item.fields.EntryDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}