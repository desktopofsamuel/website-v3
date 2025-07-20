import AppLayout from "@/components/AppLayout";

export default async function NotFound(){
  return (
    <>
    <AppLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-lg">The page you are looking for does not exist.</p>
      </div>
    </AppLayout>
    </>
  )
}