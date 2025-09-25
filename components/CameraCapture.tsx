"use client";
import { useEffect, useRef, useState } from "react";
import CustomDropdown from "./CustomDropdown";
import { getTranslations } from "@/lib/translations";
import { LANGUAGE_OPTIONS } from "@/lib/constants";

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  onBatchCapture: (dataUrls: string[]) => void;
  preferredLanguage: string;
  onLanguageChange: (language: string) => void;
  loading?: boolean;
  onLoadingComplete?: () => void;
}

export default function CameraCapture({ onCapture, onBatchCapture, preferredLanguage, onLanguageChange, loading }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [batchProcessing, setBatchProcessing] = useState<number>(0);

  const t = getTranslations(preferredLanguage);

  // Reset batch processing when loading completes
  useEffect(() => {
    if (!loading && batchProcessing > 0) {
      setBatchProcessing(0);
    }
  }, [loading, batchProcessing]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setError(t.cameraNotAvailable);
          return;
        }
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
            setStreaming(true);
          } catch (playError) {
            // Handle autoplay policy restrictions
            console.log("Autoplay blocked, waiting for user interaction");
            setStreaming(true);
          }
        }
      } catch (e: any) {
        setError(e?.message || t.cameraError);
      }
    }
    start();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function capture() {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    const w = v.videoWidth;
    const h = v.videoHeight;
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, w, h);
    const dataUrl = c.toDataURL("image/jpeg", 0.9);
    setCaptured(dataUrl);
    onCapture(dataUrl);
  }

  function compressImage(file: File): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1920px on longest side)
        let { width, height } = img;
        const maxDimension = 1920;

        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);

        // Start with decent quality and reduce if needed
        let quality = 0.8;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Keep reducing quality until under 800KB
        while (dataUrl.length * 0.75 / 1024 > 800 && quality > 0.3) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        console.log(`Compressed image: ${Math.round(dataUrl.length * 0.75 / 1024)}KB at quality ${quality.toFixed(1)}`);
        resolve(dataUrl);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Handle multiple files with compression
    const fileArray = Array.from(files);
    const dataUrls: string[] = [];
    let processedCount = 0;

    fileArray.forEach(async (file, index) => {
      try {
        // Compress large images
        const dataUrl = await compressImage(file);
        dataUrls[index] = dataUrl;
        processedCount++;

        // When all files are processed
        if (processedCount === fileArray.length) {
          if (dataUrls.length === 1) {
            // Single file - use existing flow
            setCaptured(dataUrls[0]);
            onCapture(dataUrls[0]);
          } else {
            // Multiple files - trigger batch processing
            setBatchProcessing(dataUrls.length);
            onBatchCapture(dataUrls);
          }
          // Clear the input to allow re-selecting the same file
          e.target.value = '';
        }
      } catch (err) {
        console.error('Error compressing image:', err);
        // Fallback to original file reading
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = String(reader.result);
          dataUrls[index] = dataUrl;
          processedCount++;

          if (processedCount === fileArray.length) {
            if (dataUrls.length === 1) {
              setCaptured(dataUrls[0]);
              onCapture(dataUrls[0]);
            } else {
              setBatchProcessing(dataUrls.length);
              onBatchCapture(dataUrls);
            }
            // Clear the input to allow re-selecting the same file
            e.target.value = '';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
      {/* Green Header */}
      <div className="bg-green-600 text-white py-3 px-4 z-20">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Carte</h1>
          <div className="flex items-center gap-2 text-xs">
            <span>{t.translateTo}</span>
            <CustomDropdown
              value={preferredLanguage}
              onChange={onLanguageChange}
              options={LANGUAGE_OPTIONS}
              className="min-w-28"
            />
          </div>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />

        {error && (
          <div className="absolute top-4 left-4 right-4 bg-red-600 text-white text-sm p-3 rounded-lg z-10">
            {error}
          </div>
        )}
      </div>

      {/* Capture Button - Centered */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={capture}
          disabled={!streaming}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center disabled:opacity-50 hover:scale-105 transition-transform shadow-lg"
        >
          <div className="w-16 h-16 bg-white rounded-full border-4 border-gray-300"></div>
        </button>
      </div>

      {/* Gallery Button - Bottom Left */}
      <div className="absolute bottom-8 left-8">
        <label className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm16 2H4v8l4-4 4 4 4-4 4 4V6zm-5 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onFileChange}
          />
        </label>
      </div>

      {/* Status Text */}
      <div className="absolute bottom-32 left-0 right-0 text-center">
        <div className="text-white/80 text-sm bg-black/50 px-4 py-2 rounded-lg mx-auto inline-block">
          {streaming ? t.pointCameraAtMenu : t.initializingCamera}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white text-lg font-medium">
              {batchProcessing > 1 ? `${t.analyzingMenu} (${batchProcessing} pages)` : t.analyzingMenu}
            </div>
            <div className="text-white/70 text-sm mt-1">{t.thisWillTakeAMoment}</div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}


