import { removeBackground, preload, Config } from "@imgly/background-removal";

export type BackgroundRemoverConfig = Partial<Config>;
export type ProgressCallback = (
  key: string,
  current: number,
  total: number
) => void;

const defaultConfig: Config = {
  debug: false,
  device: "cpu",
  model: "isnet_fp16",
  output: {
    format: "image/png",
    quality: 0.9,
  },
  progress: () => {},
};

/**
 * Preload the background removal model/assets.
 * @param config Optional config overrides.
 * @param onProgress Optional progress callback.
 */
export async function preloadBackgroundRemover(
  config?: BackgroundRemoverConfig,
  onProgress?: ProgressCallback
): Promise<void> {
  const mergedConfig: Config = {
    ...defaultConfig,
    ...config,
    progress: onProgress || config?.progress || defaultConfig.progress,
  };
  await preload(mergedConfig);
}

/**
 * Remove the background from an image file.
 * @param file The image file.
 * @param config Optional config overrides.
 * @param onProgress Optional progress callback.
 * @returns A Blob of the processed image.
 */
export async function removeImageBackground(
  file: File,
  config?: BackgroundRemoverConfig,
  onProgress?: ProgressCallback
): Promise<Blob> {
  const mergedConfig: Config = {
    ...defaultConfig,
    ...config,
    progress: onProgress || config?.progress || defaultConfig.progress,
  };
  return await removeBackground(file, mergedConfig);
}
