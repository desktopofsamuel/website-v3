import AppLayout from "@/components/AppLayout";
import { allTags } from "@/lib/content";
import { Link } from "@/components/AppLink";

type TagProps = {
  name: string;
  path: string;
  count: number;
}

async function getTags() {
  const tags = allTags
    .sort((a, b) => b.count - a.count)
    .filter(tag => tag.count > 1);
  return tags;
}

export default async function TagListPage() {
  const tags = await getTags();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Tags</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tags.map((tag: TagProps, i: number) => (
            <div key={i} className="flex justify-between items-center">
              <Link href={tag.path} className="text-gray-900 hover:text-blue-600">
                {tag.name}
              </Link>
              <span className="text-sm text-gray-500">({tag.count})</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
