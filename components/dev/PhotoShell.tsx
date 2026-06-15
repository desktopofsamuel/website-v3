"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  generateFullMdx,
  generateGridMdx,
  suggestCover,
  type PhotoFrontmatter,
  type PhotoGridItem,
} from "@/lib/photo-mdx-generator";

type StaticImage = {
  filename: string;
  path: string;
};

type PhotoFile = {
  filename: string;
  title: string;
  path?: string;
  imageCount: number;
};

type DragPayload = {
  type: "static-image";
  path: string;
};

type ReorderPayload = {
  type: "reorder";
  index: number;
};

function createGridItem(path: string, colSpan: 1 | 2 = 1): PhotoGridItem {
  return { src: path, colSpan };
}

function withImageRevision(src: string, revisions: Record<string, number>): string {
  const revision = revisions[src];
  return revision ? `${src}?v=${revision}` : src;
}

function parseDragPayload(data: string): DragPayload | ReorderPayload | null {
  try {
    return JSON.parse(data) as DragPayload | ReorderPayload;
  } catch {
    return null;
  }
}

export default function PhotoShell() {
  const [images, setImages] = useState<StaticImage[]>([]);
  const [photoFiles, setPhotoFiles] = useState<PhotoFile[]>([]);
  const [filter, setFilter] = useState("okinawa");
  const [gridItems, setGridItems] = useState<PhotoGridItem[]>([]);
  const [intro, setIntro] = useState("");
  const [frontmatter, setFrontmatter] = useState<PhotoFrontmatter>({
    title: "Okinawa Sunshine",
    date: "2025-09-04",
    path: "okinawa",
    cover: "/static/okinawa-015.jpg",
  });
  const [selectedFile, setSelectedFile] = useState("2025-Okinawa.mdx");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageRevisions, setImageRevisions] = useState<Record<string, number>>({});
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [canvasDragOver, setCanvasDragOver] = useState(false);

  const filteredImages = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return images;
    return images.filter((image) =>
      image.filename.toLowerCase().includes(query),
    );
  }, [images, filter]);

  const gridMdx = useMemo(() => generateGridMdx(gridItems), [gridItems]);
  const fullMdx = useMemo(
    () => generateFullMdx(frontmatter, intro, gridItems),
    [frontmatter, intro, gridItems],
  );

  const loadStaticImages = useCallback(async (prefix = "") => {
    const params = prefix ? `?prefix=${encodeURIComponent(prefix)}` : "";
    const res = await fetch(`/api/dev/static-images${params}`);
    if (!res.ok) return [];
    const data = (await res.json()) as { images: StaticImage[] };
    return data.images;
  }, []);

  const loadPhotoFiles = useCallback(async () => {
    const res = await fetch("/api/dev/photo-mdx");
    if (!res.ok) return [];
    const data = (await res.json()) as { files: PhotoFile[] };
    return data.files;
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      setLoading(true);
      const [staticImages, files] = await Promise.all([
        loadStaticImages(""),
        loadPhotoFiles(),
      ]);

      if (!mounted) return;
      setImages(staticImages);
      setPhotoFiles(files);
      setLoading(false);
    }

    void init();
    return () => {
      mounted = false;
    };
  }, [loadStaticImages, loadPhotoFiles]);

  const addImage = useCallback((path: string, colSpan: 1 | 2 = 1) => {
    setGridItems((items) => [...items, createGridItem(path, colSpan)]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setGridItems((items) => items.filter((_, i) => i !== index));
  }, []);

  const toggleColSpan = useCallback((index: number) => {
    setGridItems((items) =>
      items.map((item, i) =>
        i === index
          ? { ...item, colSpan: item.colSpan === 2 ? 1 : 2 }
          : item,
      ),
    );
  }, []);

  const rotateImage = useCallback(async (index: number, degrees: 90 | -90) => {
    const item = gridItems[index];
    if (!item) return;

    const direction = degrees === 90 ? "clockwise" : "counter-clockwise";
    setStatus(`Rotating ${item.src.replace("/static/", "")} ${direction}...`);

    const res = await fetch("/api/dev/rotate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: item.src, degrees }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setStatus(data.error ?? "Failed to rotate image file");
      return;
    }

    setImageRevisions((current) => ({
      ...current,
      [item.src]: (current[item.src] ?? 0) + 1,
    }));
    setStatus(
      `Saved ${direction} rotation to disk: ${item.src.replace("/static/", "")}`,
    );
  }, [gridItems]);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    setGridItems((items) => {
      if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return items;
      const next = [...items];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const loadOkinawaTestSet = useCallback(async () => {
    const okinawaImages = await loadStaticImages("okinawa");
    setImages((current) => {
      const merged = new Map(current.map((image) => [image.path, image]));
      for (const image of okinawaImages) {
        merged.set(image.path, image);
      }
      return Array.from(merged.values()).sort((a, b) =>
        a.filename.localeCompare(b.filename, undefined, {
          numeric: true,
          sensitivity: "base",
        }),
      );
    });
    setGridItems(
      okinawaImages.map((image, index) =>
        createGridItem(image.path, index === 0 ? 2 : 1),
      ),
    );
    setFrontmatter((current) => ({
      ...current,
      cover: suggestCover(
        okinawaImages.map((image, index) =>
          createGridItem(image.path, index === 0 ? 2 : 1),
        ),
      ),
    }));
    setStatus(`Loaded ${okinawaImages.length} Okinawa images`);
  }, [loadStaticImages]);

  const loadSelectedFile = useCallback(async () => {
    if (!selectedFile) return;

    const res = await fetch(
      `/api/dev/photo-mdx?file=${encodeURIComponent(selectedFile)}`,
    );
    if (!res.ok) {
      setStatus(`Failed to load ${selectedFile}`);
      return;
    }

    const data = (await res.json()) as {
      frontmatter: PhotoFrontmatter;
      intro: string;
      gridItems: PhotoGridItem[];
    };

    setFrontmatter(data.frontmatter);
    setIntro(data.intro);
    setGridItems(data.gridItems);
    setStatus(`Loaded ${selectedFile}`);
  }, [selectedFile]);

  const copyText = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(`Copied ${label}`);
    } catch {
      setStatus(`Failed to copy ${label}`);
    }
  }, []);

  const applyToFile = useCallback(async () => {
    if (!selectedFile) {
      setStatus("Select a photo MDX file first");
      return;
    }

    const res = await fetch("/api/dev/photo-mdx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: selectedFile,
        frontmatter,
        intro,
        gridItems,
      }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setStatus(data.error ?? "Failed to write file");
      return;
    }

    setStatus(`Applied to ${selectedFile}`);
    const files = await loadPhotoFiles();
    setPhotoFiles(files);
  }, [selectedFile, frontmatter, intro, gridItems, loadPhotoFiles]);

  useEffect(() => {
    if (gridItems.length === 0) return;
    setFrontmatter((current) => {
      if (current.cover) return current;
      return { ...current, cover: suggestCover(gridItems) };
    });
  }, [gridItems]);

  const handleCanvasDrop = useCallback(
    (event: React.DragEvent, targetIndex?: number) => {
      event.preventDefault();
      setCanvasDragOver(false);
      setDragOverIndex(null);

      const payload = parseDragPayload(event.dataTransfer.getData("text/plain"));
      if (!payload) return;

      if (payload.type === "static-image") {
        const item = createGridItem(payload.path);
        if (targetIndex === undefined) {
          addImage(payload.path);
        } else {
          setGridItems((items) => {
            const next = [...items];
            next.splice(targetIndex, 0, item);
            return next;
          });
        }
        return;
      }

      if (payload.type === "reorder" && targetIndex !== undefined) {
        moveItem(payload.index, targetIndex);
      }
    },
    [addImage, moveItem],
  );

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 py-12 text-center text-muted-foreground">
        Loading photo dev shell...
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-heading mb-2">Photo Dev Shell</h1>
        <p className="text-muted-foreground">
          Drag images from <code className="text-sm">public/static/</code> into
          the layout canvas. Rotate writes directly to the image file on disk.
        </p>
        {status && (
          <p className="mt-2 text-sm font-mono text-emerald-600 dark:text-emerald-400">
            {status}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_360px] gap-4 min-h-[70vh]">
        {/* Image browser */}
        <section className="rounded-xl border border-border bg-card/50 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold text-sm uppercase tracking-wide">
              Static Images
            </h2>
            <button
              type="button"
              onClick={() => void loadOkinawaTestSet()}
              className="text-xs px-2 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90"
            >
              Load Okinawa
            </button>
          </div>
          <input
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Filter by filename..."
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[60vh] pr-1">
            {filteredImages.map((image) => (
              <button
                key={image.path}
                type="button"
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData(
                    "text/plain",
                    JSON.stringify({
                      type: "static-image",
                      path: image.path,
                    } satisfies DragPayload),
                  );
                  event.dataTransfer.effectAllowed = "copy";
                }}
                onClick={() => addImage(image.path)}
                className="group relative aspect-square overflow-hidden rounded-md border border-border bg-muted hover:ring-2 hover:ring-primary/50 cursor-grab active:cursor-grabbing"
                title={`${image.filename} — click or drag to add`}
              >
                <Image
                  src={withImageRevision(image.path, imageRevisions)}
                  alt={image.filename}
                  fill
                  sizes="140px"
                  className="object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-black/60 px-1 py-0.5 text-[10px] text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.filename}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Layout canvas */}
        <section className="rounded-xl border border-border bg-card/50 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm uppercase tracking-wide">
              Layout Canvas
            </h2>
            <span className="text-xs text-muted-foreground">
              {gridItems.length} image{gridItems.length === 1 ? "" : "s"}
            </span>
          </div>

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setCanvasDragOver(true);
            }}
            onDragLeave={() => setCanvasDragOver(false)}
            onDrop={(event) => handleCanvasDrop(event)}
            className={`min-h-[300px] rounded-lg border-2 border-dashed p-3 transition-colors ${
              canvasDragOver
                ? "border-primary bg-primary/5"
                : "border-border bg-background/50"
            }`}
          >
            {gridItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-16">
                Drop images here or click thumbnails in the browser
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {gridItems.map((item, index) => (
                  <div
                    key={`${item.src}-${index}`}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData(
                        "text/plain",
                        JSON.stringify({
                          type: "reorder",
                          index,
                        } satisfies ReorderPayload),
                      );
                      event.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragOverIndex(index);
                    }}
                    onDragLeave={() => setDragOverIndex(null)}
                    onDrop={(event) => {
                      event.stopPropagation();
                      handleCanvasDrop(event, index);
                    }}
                    className={`relative rounded-lg border overflow-hidden bg-muted ${
                      item.colSpan === 2 ? "col-span-2" : "col-span-1"
                    } ${
                      dragOverIndex === index
                        ? "ring-2 ring-primary"
                        : "border-border"
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden flex items-center justify-center">
                      <Image
                        src={withImageRevision(item.src, imageRevisions)}
                        alt=""
                        fill
                        sizes="(max-width: 1280px) 50vw, 400px"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-1 p-2 bg-background/90 backdrop-blur text-xs">
                      <button
                        type="button"
                        onClick={() => void rotateImage(index, -90)}
                        className="px-2 py-1 rounded border border-border hover:bg-muted"
                        title="Save 90° counter-clockwise rotation to image file on disk"
                      >
                        ↺ Save CCW
                      </button>
                      <button
                        type="button"
                        onClick={() => void rotateImage(index, 90)}
                        className="px-2 py-1 rounded border border-border hover:bg-muted"
                        title="Save 90° clockwise rotation to image file on disk"
                      >
                        ↻ Save CW
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleColSpan(index)}
                        className="px-2 py-1 rounded border border-border hover:bg-muted"
                        title="Toggle full width"
                      >
                        {item.colSpan === 2 ? "Full" : "Half"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="px-2 py-1 rounded border border-border hover:bg-destructive/10 text-destructive"
                      >
                        Remove
                      </button>
                      <span className="ml-auto truncate text-muted-foreground font-mono">
                        {item.src.replace("/static/", "")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Frontmatter + output */}
        <section className="rounded-xl border border-border bg-card/50 p-4 flex flex-col gap-3">
          <h2 className="font-semibold text-sm uppercase tracking-wide">
            Frontmatter & Output
          </h2>

          <div className="space-y-2">
            <label className="block text-xs text-muted-foreground">Title</label>
            <input
              value={frontmatter.title}
              onChange={(event) =>
                setFrontmatter((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Path
              </label>
              <input
                value={frontmatter.path ?? ""}
                onChange={(event) =>
                  setFrontmatter((current) => ({
                    ...current,
                    path: event.target.value,
                  }))
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Date
              </label>
              <input
                type="date"
                value={frontmatter.date}
                onChange={(event) =>
                  setFrontmatter((current) => ({
                    ...current,
                    date: event.target.value,
                  }))
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Cover
            </label>
            <input
              value={frontmatter.cover ?? ""}
              onChange={(event) =>
                setFrontmatter((current) => ({
                  ...current,
                  cover: event.target.value,
                }))
              }
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Intro prose
            </label>
            <textarea
              value={intro}
              onChange={(event) => setIntro(event.target.value)}
              rows={3}
              placeholder="Optional paragraph above the gallery..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-y"
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Apply to file
            </label>
            <div className="flex gap-2">
              <select
                value={selectedFile}
                onChange={(event) => setSelectedFile(event.target.value)}
                className="flex-1 rounded-md border border-border bg-background px-2 py-2 text-sm"
              >
                {photoFiles.map((file) => (
                  <option key={file.filename} value={file.filename}>
                    {file.filename}
                    {file.title ? ` — ${file.title}` : ""}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => void loadSelectedFile()}
                className="px-2 py-1 rounded-md border border-border text-xs hover:bg-muted"
              >
                Load
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void copyText(gridMdx, "grid MDX")}
              className="px-3 py-1.5 rounded-md border border-border text-xs hover:bg-muted"
            >
              Copy Grid
            </button>
            <button
              type="button"
              onClick={() => void copyText(fullMdx, "full MDX")}
              className="px-3 py-1.5 rounded-md border border-border text-xs hover:bg-muted"
            >
              Copy Full MDX
            </button>
            <button
              type="button"
              onClick={() => void applyToFile()}
              className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs hover:opacity-90"
            >
              Apply to file
            </button>
          </div>

          <div className="flex-1 min-h-[200px]">
            <label className="block text-xs text-muted-foreground mb-1">
              Live MDX preview
            </label>
            <pre className="h-full max-h-[40vh] overflow-auto rounded-md border border-border bg-background p-3 text-[11px] leading-relaxed font-mono whitespace-pre-wrap">
              {fullMdx}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
