import React, { useState } from 'react';
import { Camera, Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';

export default function SnapshotTool({ username, onSnapshot }) {
  const [capturing, setCapturing] = useState(false);

  const takeSnapshot = async () => {
    if (capturing) return;
    
    setCapturing(true);
    console.log('Snapshot: Starting merged capture');
    
    // Give UI a moment to show capturing state
    setTimeout(async () => {
      try {
        // 1. Get the 3D Canvas
        const threeCanvas = document.querySelector('canvas');
        if (!threeCanvas) throw new Error('3D Canvas not found');

        // 2. Capture the UI Overlay
        const uiContainer = document.querySelector('.overlay-container');
        if (!uiContainer) throw new Error('UI Container not found');

        console.log('Snapshot: Capturing UI...');
        const uiCanvas = await html2canvas(uiContainer, {
          backgroundColor: null,
          useCORS: true,
          scale: 2,
          ignoreElements: (element) => element.classList.contains('no-capture')
        });

        // 3. Create a Merge Canvas
        const mergeCanvas = document.createElement('canvas');
        mergeCanvas.width = threeCanvas.width;
        mergeCanvas.height = threeCanvas.height;
        const ctx = mergeCanvas.getContext('2d');

        // 4. Draw 3D content
        ctx.drawImage(threeCanvas, 0, 0);

        // 5. Draw UI content (scaled to fit)
        ctx.drawImage(uiCanvas, 0, 0, mergeCanvas.width, mergeCanvas.height);

        console.log('Snapshot: Merge complete');
        const dataUrl = mergeCanvas.toDataURL('image/png');
        
        onSnapshot(dataUrl);
      } catch (err) {
        console.error('Snapshot: Failed', err);
        alert('Capture Error: ' + err.message);
      } finally {
        setCapturing(false);
      }
    }, 600);
  };

  return (
    <button 
      onClick={takeSnapshot} 
      disabled={capturing}
      className="glass-panel no-capture"
      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
    >
      <Camera size={20} />
      {capturing ? 'Capturing...' : 'Snapshot'}
    </button>
  );
}
