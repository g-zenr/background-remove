import React, { useState, useRef, useCallback } from "react";
import { removeBackground, preload, Config } from "@imgly/background-removal";

interface ImageData {
  original: string;
  processed: string | null;
  name: string;
  status: "uploading" | "processing" | "completed" | "error";
  error?: string;
}

const BackgroundRemover: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [progress, setProgress] = useState<{
    key: string;
    current: number;
    total: number;
  } | null>(null);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const config: Config = {
    debug: true,
    device: "cpu",
    model: "isnet_fp16",
    output: {
      format: "image/png",
      quality: 0.9,
    },
    progress: (key, current, total) => setProgress({ key, current, total }),
  };

  const handlePreload = useCallback(async () => {
    try {
      await preload(config);
      setIsPreloaded(true);
    } catch (error) {
      console.error("Preload failed", error);
    }
  }, [config]);

  const processImage = useCallback(
    async (file: File) => {
      try {
        const originalUrl = URL.createObjectURL(file);
        const newImage: ImageData = {
          original: originalUrl,
          processed: null,
          name: file.name,
          status: "processing",
        };
        setImages([newImage]);
        const blob = await removeBackground(file, config);
        const processedUrl = URL.createObjectURL(blob);
        setImages([
          { ...newImage, processed: processedUrl, status: "completed" },
        ]);
      } catch {
        setImages((imgs) =>
          imgs.map((img) => ({
            ...img,
            status: "error",
            error: "Failed to remove background",
          }))
        );
      }
    },
    [config]
  );

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const file = Array.from(files).find((f) => f.type.startsWith("image/"));
      if (file) processImage(file);
    },
    [processImage]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
      if (e.target) e.target.value = "";
    },
    [handleFileSelect]
  );

  const clearImages = useCallback(() => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.original);
      if (img.processed) URL.revokeObjectURL(img.processed);
    });
    setImages([]);
  }, [images]);

  const percent = progress
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
        Background Remover
      </h1>
      <p className="text-lg sm:text-xl text-center text-gray-500 dark:text-gray-300 mb-8 max-w-2xl">
        Instantly remove backgrounds from images in your browser. No uploads, no
        servers. Drag & drop or select an image to get started.
      </p>
      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={handlePreload}
          disabled={isPreloaded}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-purple-600 focus:ring-2 focus:ring-blue-400 focus:outline-none transition disabled:opacity-50 text-base"
        >
          {isPreloaded ? "Assets Ready" : "Preload Assets"}
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold shadow-lg hover:from-green-500 hover:to-blue-600 focus:ring-2 focus:ring-green-400 focus:outline-none transition text-base"
        >
          Select Image
        </button>
        <button
          onClick={clearImages}
          disabled={images.length === 0}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold shadow-lg hover:from-red-500 hover:to-pink-600 focus:ring-2 focus:ring-red-400 focus:outline-none transition disabled:opacity-50 text-base"
        >
          Clear
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
      {/* Progress bar */}
      {progress && (
        <div className="w-full max-w-xl mb-6">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-300 mb-1">
            <span>Downloading {progress.key}...</span>
            <span>{percent}%</span>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 h-2 w-full rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}
      {/* Horizontal Grid: Before & After */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full flex flex-col md:flex-row justify-center items-stretch gap-8 transition-all duration-300 ${
          isDragOver
            ? "ring-4 ring-blue-400/60 bg-blue-100/40 dark:bg-blue-900/30"
            : ""
        }`}
        style={{ minHeight: 380 }}
      >
        {/* Before */}
        <div
          className={`relative flex-1 bg-white/70 dark:bg-white/10 backdrop-blur-xl border-2 border-dashed ${
            isDragOver
              ? "border-blue-400 animate-pulse"
              : "border-gray-200 dark:border-white/20"
          } rounded-3xl p-6 shadow-2xl flex flex-col transition-all duration-300 min-w-[280px] max-w-[420px] mx-auto`}
        >
          <h2 className="text-center text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200 tracking-tight">
            Before
          </h2>
          {images[0]?.original ? (
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <img
                src={images[0].original}
                alt="Original"
                className="w-full h-full object-contain rounded-xl shadow-lg border border-gray-100 dark:border-white/10"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-base select-none">
              <span className="mb-2">No image selected</span>
              <span className="text-xs text-gray-300">
                Drag & drop an image here
              </span>
            </div>
          )}
        </div>
        {/* After */}
        <div className="relative flex-1 bg-white/70 dark:bg-white/10 backdrop-blur-xl border-2 border-solid border-gray-200 dark:border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col transition-all duration-300 min-w-[280px] max-w-[420px] mx-auto">
          <h2 className="text-center text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200 tracking-tight">
            After
          </h2>
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            {images[0]?.status === "processing" && (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mb-2"></div>
                <span className="text-sm text-gray-400">Processing...</span>
              </div>
            )}
            {images[0]?.status === "completed" && images[0].processed ? (
              <img
                src={images[0].processed}
                alt="Processed"
                className="w-full h-full object-contain rounded-xl shadow-lg border border-gray-100 dark:border-white/10"
              />
            ) : (
              images[0]?.status !== "processing" && (
                <div className="text-gray-400 text-base select-none">
                  No result
                </div>
              )
            )}
          </div>
          {images[0]?.status === "completed" && images[0].processed && (
            <a
              href={images[0].processed}
              download={`${images[0].name.replace(/\.[^/.]+$/, "")}_no_bg.png`}
              className="mt-4 mx-auto text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 focus:ring-2 focus:ring-blue-400 focus:outline-none transition shadow-lg block text-center"
            >
              Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackgroundRemover;
