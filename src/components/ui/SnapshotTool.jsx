import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function SnapshotTool({ username }) {
  const [capturing, setCapturing] = useState(false);

  const takeSnapshot = async () => {
    setCapturing(true);
    // Give UI a moment to update if needed
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(document.body, {
          backgroundColor: '#05070a',
          useCORS: true,
          scale: 2
        });
        
        const link = document.createElement('a');
        link.download = `${username}-galaxy.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error('Failed to take snapshot', err);
      } finally {
        setCapturing(false);
      }
    }, 100);
  };

  return (
    <button 
      onClick={takeSnapshot} 
      disabled={capturing}
      className="glass-panel"
      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
    >
      <Camera size={20} />
      {capturing ? 'Capturing...' : 'Snapshot'}
    </button>
  );
}
