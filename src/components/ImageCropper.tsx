"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { motion, AnimatePresence } from "framer-motion";
import { FiZoomIn, FiRotateCw, FiCheck, FiX } from "react-icons/fi";
import getCroppedImg from "@/lib/cropImage";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    try {
      const croppedBlob = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation
      );
      if (croppedBlob) {
        onCropComplete(croppedBlob);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 outline-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-blunotte/90 backdrop-blur-2xl"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-2xl aspect-square glass rounded-[3.5rem] border-oro/30 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10 bg-blunotte/20">
          <div className="space-y-1">
             <span className="text-oro font-black uppercase tracking-[0.3em] text-[10px]">Editor d&apos;Elite</span>
             <h2 className="text-2xl font-black uppercase tracking-tighter">Ritaglia <span className="text-gradient-oro">Foto</span></h2>
          </div>
          <button onClick={onCancel} className="p-3 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-all text-gray-400">
            <FiX size={20} />
          </button>
        </div>

        {/* Cropper area */}
        <div className="relative flex-grow bg-black/40">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
            objectFit="contain"
            classes={{
                containerClassName: "bg-transparent",
                mediaClassName: "cursor-move",
                cropAreaClassName: "border-2 border-oro shadow-[0_0_50px_rgba(255,215,0,0.3)] !rounded-2xl"
            }}
          />
        </div>

        {/* Controls */}
        <div className="p-10 bg-blunotte/30 backdrop-blur-xl border-t border-white/5 space-y-8 relative z-10">
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
               <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-white/40">
                  <span className="flex items-center gap-2"><FiZoomIn /> Ingrandimento</span>
                  <span>{Math.round(zoom * 100)}%</span>
               </div>
               <input
                 type="range"
                 value={zoom}
                 min={1}
                 max={3}
                 step={0.1}
                 aria-labelledby="Zoom"
                 onChange={(e) => onZoomChange(Number(e.target.value))}
                 className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-oro"
               />
            </div>

            <div className="space-y-3">
               <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-white/40">
                  <span className="flex items-center gap-2"><FiRotateCw /> Rotazione</span>
                  <span>{rotation}°</span>
               </div>
               <input
                 type="range"
                 value={rotation}
                 min={0}
                 max={360}
                 step={1}
                 aria-labelledby="Rotation"
                 onChange={(e) => setRotation(Number(e.target.value))}
                 className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-oro"
               />
            </div>
          </div>

          <div className="pt-4">
             <button
               onClick={handleDone}
               className="w-full py-5 bg-gradient-to-r from-oro to-ocra text-blunotte font-black rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_20px_40px_rgba(255,215,0,0.3)] transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm shadow-xl"
             >
               <FiCheck size={20} /> Applica Ritaglio
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
