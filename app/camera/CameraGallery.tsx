"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cameras, Camera, Photo } from "./data";
import { IoArrowBack, IoLocationSharp, IoCalendar, IoFilm, IoClose } from "react-icons/io5";

gsap.registerPlugin(useGSAP);

export default function CameraGallery() {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const photoStackRef = useRef<HTMLDivElement>(null);

  // Reset selected photo when camera changes (just in case)
  useEffect(() => {
    setSelectedPhoto(null);
  }, [selectedCamera]);

  const handleCameraSelect = (camera: Camera) => {
    // Animate out
    gsap.to(".camera-item", {
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 0.3,
      onComplete: () => {
        setSelectedCamera(camera);
        // Animate in happens in useGSAP effect dependent on selectedCamera
      }
    });
  };

  const handleBackToGallery = () => {
    // Animate out details
    gsap.to(".camera-detail-content", {
      opacity: 0,
      y: 20,
      duration: 0.3,
      onComplete: () => {
        setSelectedCamera(null);
      }
    });
  };

  const handlePhotoSelect = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  useGSAP(() => {
    if (!selectedCamera) {
      // Gallery View Animation
      gsap.fromTo(
        ".camera-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }
      );
    } else {
      // Camera Detail View Animation
      gsap.fromTo(
        ".camera-detail-content",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: "power2.out" }
      );
      
      // Animate photos in stack
      if (photoStackRef.current) {
        gsap.fromTo(
          ".photo-card",
          { opacity: 0, y: 50, rotation: () => Math.random() * 10 - 5 },
          { 
            opacity: 1, 
            y: 0, 
            rotation: (i) => (i % 2 === 0 ? 3 : -3) + (Math.random() * 2 - 1),
            stagger: 0.1, 
            duration: 0.6, 
            ease: "back.out(1.2)" 
          }
        );
      }
    }
  }, [selectedCamera]);

  return (
    <div ref={containerRef} className="min-h-screen py-10 relative">
      {!selectedCamera ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cameras.map((camera) => (
            <div
              key={camera.id}
              className="camera-item group cursor-pointer bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-1"
              onClick={() => handleCameraSelect(camera)}
            >
              <div className="aspect-video relative mb-4 overflow-hidden rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center">
                <Image
                  src={camera.image}
                  alt={camera.name}
                  width={400}
                  height={300}
                  className="object-contain w-full h-full p-4 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h2 className="text-2xl font-bold font-heading mb-1">{camera.name}</h2>
              <p className="text-sm text-gray-500 uppercase tracking-wide">{camera.brand} {camera.model}</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{camera.description}</p>
              <div className="mt-4 flex items-center text-sm font-medium text-primary">
                <span>View {camera.photos.length} photos</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="camera-detail-content relative">
          <button
            onClick={handleBackToGallery}
            className="flex items-center gap-2 text-lg font-medium mb-8 hover:opacity-70 transition-opacity"
          >
            <IoArrowBack /> Back to Collection
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Camera Info Side */}
            <div className="lg:col-span-1">
              <div className="sticky top-10">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="aspect-video relative mb-6 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                    <Image
                      src={selectedCamera.image}
                      alt={selectedCamera.name}
                      width={400}
                      height={300}
                      className="object-contain w-full h-full p-4"
                    />
                  </div>
                  <h1 className="text-3xl font-bold font-heading mb-2">{selectedCamera.name}</h1>
                  <p className="text-gray-500 mb-6">{selectedCamera.brand} {selectedCamera.model}</p>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
                    {selectedCamera.description}
                  </p>
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <IoFilm className="text-xl" />
                      <span>{selectedCamera.photos.length} photos in collection</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Stack Side */}
            <div className="lg:col-span-2" ref={photoStackRef}>
              <h2 className="text-xl font-bold mb-6 opacity-50 uppercase tracking-wider">Photo Stream</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
                {selectedCamera.photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="photo-card cursor-pointer group relative aspect-[4/5] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:z-10 hover:scale-105"
                    onClick={() => handlePhotoSelect(photo)}
                  >
                    <Image
                      src={photo.url}
                      alt={`Photo taken with ${selectedCamera.name}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                      <p className="font-medium truncate">{photo.location.name}</p>
                      <p className="text-xs opacity-80">{photo.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Overlay Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md"
             onClick={handleClosePhoto}
        >
          <button 
            className="absolute top-6 right-6 text-white text-4xl hover:opacity-70 transition-opacity z-50"
            onClick={handleClosePhoto}
          >
            <IoClose />
          </button>

          <div 
            className="relative w-full max-w-6xl h-full flex flex-col md:flex-row gap-8 items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image */}
            <div className="relative flex-1 w-full h-full max-h-[85vh] flex items-center justify-center">
               <Image
                  src={selectedPhoto.url}
                  alt="Selected photo"
                  width={1200}
                  height={1600}
                  className="max-w-full max-h-full object-contain rounded-sm shadow-2xl"
               />
            </div>

            {/* Metadata Panel */}
            <div className="w-full md:w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-white shrink-0">
               <div className="mb-6">
                  <h3 className="text-sm uppercase tracking-widest opacity-70 mb-1">Location</h3>
                  <div className="flex items-start gap-2 text-lg font-medium">
                    <IoLocationSharp className="mt-1 shrink-0" />
                    <span>{selectedPhoto.location.name}</span>
                  </div>
                  <div className="text-xs opacity-50 mt-1 font-mono">
                    {selectedPhoto.location.lat.toFixed(4)}, {selectedPhoto.location.lng.toFixed(4)}
                  </div>
               </div>

               <div className="mb-6">
                  <h3 className="text-sm uppercase tracking-widest opacity-70 mb-1">Date</h3>
                  <div className="flex items-center gap-2 text-lg font-medium">
                    <IoCalendar />
                    <span>{selectedPhoto.date}</span>
                  </div>
               </div>

               <div className="space-y-4 pt-6 border-t border-white/20">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest opacity-50 mb-1">Film Stock</h3>
                    <p className="font-medium text-lg">{selectedPhoto.filmStock}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-xs uppercase tracking-widest opacity-50 mb-1">ISO</h3>
                      <p className="font-mono">{selectedPhoto.iso}</p>
                    </div>
                    <div>
                      <h3 className="text-xs uppercase tracking-widest opacity-50 mb-1">Aperture</h3>
                      <p className="font-mono">{selectedPhoto.aperture}</p>
                    </div>
                    <div>
                      <h3 className="text-xs uppercase tracking-widest opacity-50 mb-1">Shutter</h3>
                      <p className="font-mono">{selectedPhoto.shutterSpeed}</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
