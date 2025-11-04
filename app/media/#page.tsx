import AppCardMusic from "@/components/AppCardMusic";
import AppCardCurrentlyPlaying from "@/components/AppCardCurrentlyPlaying";
import AppCardBook from "@/components/AppCardBook";
import AppCardFilms from "@/components/AppCardFilms";
import AppCardTopTracks from "@/components/AppCardTopTracks";
import AppLayout from "@/components/AppLayout";

export default function MediaPage() {
  return (
    <AppLayout>
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Media Test Page
        </h1>
        <p className="text-lg text-gray-600">
          Testing all API endpoints with fast refresh intervals for development
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Data refreshes every 10-120 seconds automatically
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AppCardCurrentlyPlaying />
        <AppCardMusic />
        <AppCardTopTracks />
        <AppCardBook />
        <AppCardFilms />
        {/* <AppCardResources /> */}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Refresh Intervals:</h2>
        <div className="text-sm space-y-1">
          <div>• Currently Playing: 10 seconds</div>
          <div>• Top Artists: 30 seconds</div>
          <div>• Top Tracks: 30 seconds</div>
          <div>• Books: 60 seconds</div>
          <div>• Films: 60 seconds</div>
          <div>• Career Resources: 2 minutes</div>
        </div>
      </div>
    </div></AppLayout>
  );
}