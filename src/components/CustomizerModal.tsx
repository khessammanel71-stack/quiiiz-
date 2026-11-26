import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Heart, Brain, Laugh, RefreshCw } from 'lucide-react';
import { UserConfig, RelationshipType, HumorStyle } from '../types';
import { generateShareableUrl, getRelationshipLabel, saveUserConfig } from '../utils/storage';
import { sound } from '../utils/audio';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: UserConfig;
  onSave: (updated: UserConfig) => void;
  onRestart: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  onRestart,
}) => {
  const [formData, setFormData] = useState<UserConfig>(config);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    sound.playSelect();
    const url = generateShareableUrl(formData);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSaveAndApply = () => {
    sound.playSelect();
    saveUserConfig(formData);
    onSave(formData);
    onClose();
  };

  const handleSaveAndRestart = () => {
    sound.playSelect();
    saveUserConfig(formData);
    onSave(formData);
    onClose();
    onRestart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">Personalize The Experiment</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize his nickname, jokes, and letter, then copy the private link to send him!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 py-4 text-sm">
          {/* Nickname input */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-amber-400/90 mb-1">
              1. His Nickname (or Pet Name)
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              placeholder="e.g. Leo, Alex, Handsome Overthinker, Professor..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors font-medium"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              This will appear dynamically on the terminal, fake reports, and birthday reveal!
            </p>
          </div>

          {/* Relationship */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-amber-400/90 mb-1.5">
              2. Your Relationship With Him
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'boyfriend', label: 'Boyfriend ❤️', icon: Heart },
                { id: 'crush', label: 'Crush 🤭', icon: Sparkles },
                { id: 'special', label: 'Someone Special ✨', icon: Heart },
                { id: 'complicated', label: 'Something Complicated 😂', icon: Laugh },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    sound.playKeyClick();
                    setFormData({
                      ...formData,
                      relationship: item.id as RelationshipType,
                      relationshipLabel: getRelationshipLabel(item.id),
                    });
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-left border transition-all ${
                    formData.relationship === item.id
                      ? 'bg-amber-500/15 border-amber-500 text-amber-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0 text-amber-400" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Humor Style */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-amber-400/90 mb-1.5">
              3. His Humor Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'sarcastic', label: '🧠 Sarcastic & Philosophical' },
                { id: 'memes', label: '🤡 Memes & Chaotic Humor' },
                { id: 'dark', label: '💀 Savage & Dark Roasts' },
                { id: 'all', label: '🔥 All Of Them. No Mercy.' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    sound.playKeyClick();
                    setFormData({ ...formData, humorStyle: item.id as HumorStyle });
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition-all ${
                    formData.humorStyle === item.id
                      ? 'bg-amber-500/15 border-amber-500 text-amber-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sender Sign-off */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-amber-400/90 mb-1">
              Your Name / Sign-off
            </label>
            <input
              type="text"
              value={formData.senderName}
              onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
              placeholder="e.g. Manel, Your Favorite Person, etc."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Heartfelt Letter */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-amber-400/90 mb-1">
              Secret Birthday Letter (Revealed at the end)
            </label>
            <textarea
              rows={4}
              value={formData.personalMessage}
              onChange={(e) => setFormData({ ...formData, personalMessage: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors text-xs leading-relaxed"
            />
          </div>

          {/* Copy Shareable URL Box */}
          <div className="p-3 bg-slate-950/80 border border-amber-500/30 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-amber-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Secret Link For Him
              </span>
              <span className="text-[11px] text-slate-400">Loads his name automatically!</span>
            </div>
            <button
              onClick={handleCopyLink}
              type="button"
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span>Copied to Clipboard! Send it to him ❤️</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link To Send Him</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800 gap-3">
          <button
            onClick={handleSaveAndRestart}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Apply & Restart</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndApply}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
