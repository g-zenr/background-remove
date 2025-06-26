# Background Removal Demo

A React 19 + Tailwind 4 demo application showcasing the `@imgly/background-removal` package for removing backgrounds from images directly in the browser.

## Features

- 🖼️ **Drag & Drop Interface**: Easy image upload with drag and drop functionality
- 🚀 **Real-time Processing**: Remove backgrounds instantly in the browser
- 📊 **Progress Tracking**: Visual progress indicators for asset downloads
- 💾 **Asset Preloading**: Option to preload neural network models for faster processing
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS 4
- 📥 **Download Results**: Download processed images with transparent backgrounds

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

1. Clone or download this project
2. Install dependencies:

```bash
npm install
```

## Usage

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

3. **Optional**: Click "Preload Assets" to download the neural network models upfront (recommended for better user experience)

4. Upload images by either:

   - Clicking "Select Images" and choosing files
   - Dragging and dropping images onto the drop zone

5. Wait for processing to complete

6. Download the processed images with removed backgrounds

## How It Works

This demo uses the `@imgly/background-removal` package which:

- Runs entirely in the browser using WebAssembly and ONNX models
- Processes images locally without sending data to external servers
- Uses neural networks to accurately detect and remove backgrounds
- Supports multiple image formats (PNG, JPEG, WebP)

## Configuration

The background removal is configured with the following settings:

```typescript
const config: Config = {
  debug: true, // Enable console logging
  device: "cpu", // Use CPU for processing
  model: "isnet_fp16", // Use the medium-sized model
  output: {
    format: "image/png", // Output as PNG with transparency
    quality: 0.8, // 80% quality
    type: "foreground", // Return foreground only
  },
  progress: (key, current, total) => {
    // Track download progress
  },
};
```

## Browser Requirements

The application requires browsers that support:

- SharedArrayBuffer (requires specific headers)
- WebAssembly
- Modern JavaScript features

The Vite configuration automatically sets the required CORS headers:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

## Performance Notes

- First run will download ~80MB of neural network models
- Subsequent runs use cached models for faster processing
- Processing time depends on image size and device performance
- GPU acceleration is available but defaults to CPU for compatibility

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technologies Used

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **@imgly/background-removal** - Background removal library
- **ONNX Runtime Web** - Neural network inference

## License

This project is for demonstration purposes. The `@imgly/background-removal` package is licensed under AGPL. See the package documentation for licensing details.

## Support

For issues with the background removal library, visit the [@imgly/background-removal GitHub repository](https://github.com/imgly/background-removal-js).
