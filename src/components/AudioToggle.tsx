import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/audio';

export const AudioToggle: React.FC = () => {
  const [muted, setMuted] = useState(!sound.enabled);

  const toggle = () => {
    sound.enabled = !sound.enabled;
    setMuted(!sound.enabled);
    if (sound.enabled) {
      sound.playSelect();
    }
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-slate-400 hover:text-amber-400 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
      title={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
    >
      {muted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
      <span className="hidden sm:inline">{muted ? 'Muted' : 'Sound ON'}</span>
    </button>
  );
};
