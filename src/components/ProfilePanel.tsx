import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Upload, CheckCircle, AlertCircle, User, Camera, FileText, Loader2, Save, Edit2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebaseService';
import { useStore } from '../store/useStore';

export function ProfilePanel() {
  const { user, userData, setIsProfileOpen, setUserData: onUpdate } = useStore();
  const onClose = () => setIsProfileOpen(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [idCardData, setIdCardData] = useState<string | null>(userData?.idCardData || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Personal Details State
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({
    fullName: user?.displayName || '',
    phoneNumber: userData?.phoneNumber || '',
    dateOfBirth: userData?.dateOfBirth || '',
    address: userData?.address || '',
    emergencyContact: userData?.emergencyContact || ''
  });

  useEffect(() => {
    if (userData) {
      setPersonalDetails({
        fullName: userData.fullName || user?.displayName || '',
        phoneNumber: userData.phoneNumber || '',
        dateOfBirth: userData.dateOfBirth || '',
        address: userData.address || '',
        emergencyContact: userData.emergencyContact || ''
      });
    }
  }, [userData, user]);

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveDetails = async () => {
    setIsSavingDetails(true);
    setError(null);
    setSuccess(false);

    try {
      if (user?.uid) {
        const userRef = doc(db, 'users', user.uid);
        try {
          await updateDoc(userRef, {
            ...personalDetails,
            updatedAt: new Date().toISOString()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
          throw err;
        }
        
        onUpdate({ ...userData, ...personalDetails });
        setSuccess(true);
        setIsEditingDetails(false);
      } else {
        // Fallback if no user uid (e.g. guest mode)
        onUpdate({ ...userData, ...personalDetails });
        setSuccess(true);
        setIsEditingDetails(false);
      }
    } catch (err: any) {
      console.error('Error saving personal details:', err);
      setError('Failed to save personal details. Please try again.');
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      // Create object url and load into image to resize
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = async () => {
        URL.revokeObjectURL(imageUrl);
        
        // Calculate max dimensions
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        // Draw to canvas and compress
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Get highly compressed JPEG (0.6 quality)
        const base64String = canvas.toDataURL('image/jpeg', 0.6);

        if (user?.uid) {
          const userRef = doc(db, 'users', user.uid);
          try {
            await updateDoc(userRef, {
              idCardData: base64String,
              idCardUploadedAt: new Date().toISOString(),
              verificationStatus: 'pending'
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
            setIsUploading(false);
            return;
          }
          
          setIdCardData(base64String);
          setSuccess(true);
          onUpdate({ ...userData, idCardData: base64String, verificationStatus: 'pending' });
        } else {
          setIdCardData(base64String);
          setSuccess(true);
          onUpdate({ ...userData, idCardData: base64String, verificationStatus: 'pending' });
        }
        setIsUploading(false);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        setError('Failed to load image.');
        setIsUploading(false);
      };

      img.src = imageUrl;
    } catch (err: any) {
      console.error('Error uploading ID card:', err);
      setError('Failed to upload ID card. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 font-sans safe-top safe-bottom">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh] safe-left safe-right"
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-xs font-display font-bold text-zinc-100 uppercase tracking-wider">Student Profile</h3>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Identity Verification & Details</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
          {/* User Info Header */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-zinc-950 overflow-hidden">
                <img 
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'Student'}&background=random`}
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">{personalDetails.fullName || user?.displayName || 'Student User'}</h4>
              <p className="text-xs text-zinc-400 font-mono">{user?.email || 'student@neuralcore.edu'}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-[10px] text-indigo-300 font-mono uppercase tracking-wider">
                <CheckCircle size={10} />
                Student Access
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-300">Profile updated successfully.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Details Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <User size={14} className="text-indigo-400" />
                  Personal Details
                </h4>
                {!isEditingDetails ? (
                  <button 
                    onClick={() => setIsEditingDetails(true)}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    <Edit2 size={10} /> Edit
                  </button>
                ) : (
                  <button 
                    onClick={handleSaveDetails}
                    disabled={isSavingDetails}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono uppercase tracking-wider flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    {isSavingDetails ? <Loader2 size={10} className="animate-spin" /> : <Save size={10} />} 
                    Save
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={personalDetails.fullName}
                    onChange={handleDetailsChange}
                    disabled={!isEditingDetails}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    value={personalDetails.phoneNumber}
                    onChange={handleDetailsChange}
                    disabled={!isEditingDetails}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">Date of Birth</label>
                  <input 
                    type="date" 
                    name="dateOfBirth"
                    value={personalDetails.dateOfBirth}
                    onChange={handleDetailsChange}
                    disabled={!isEditingDetails}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 disabled:opacity-70 disabled:cursor-not-allowed transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">Emergency Contact</label>
                  <input 
                    type="tel" 
                    name="emergencyContact"
                    value={personalDetails.emergencyContact}
                    onChange={handleDetailsChange}
                    disabled={!isEditingDetails}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                    placeholder="Emergency contact number"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">Address</label>
                  <textarea 
                    name="address"
                    value={personalDetails.address}
                    onChange={handleDetailsChange}
                    disabled={!isEditingDetails}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 disabled:opacity-70 disabled:cursor-not-allowed transition-colors resize-none"
                    placeholder="Enter full address"
                  />
                </div>
              </div>
            </div>

            {/* ID Card Upload Section */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} className="text-indigo-400" />
                Student ID Card
              </h4>

              {idCardData ? (
                <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 aspect-[1.6]">
                  <img src={idCardData} alt="Student ID" className="w-full h-full object-contain" style={{ filter: 'none', mixBlendMode: 'normal' }} />
                  {userData?.verificationStatus && userData.verificationStatus !== 'pending' && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-[10px] text-white font-mono uppercase tracking-wider border border-white/10">
                      {userData.verificationStatus}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium flex items-center gap-2 transition-colors"
                    >
                      <Camera size={14} />
                      Update ID Card
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 transition-all cursor-pointer group aspect-[1.6]"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                    {isUploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                  </div>
                  <p className="text-sm font-medium text-zinc-300 mb-1">
                    {isUploading ? 'Uploading...' : 'Upload Student ID'}
                  </p>
                  <p className="text-xs text-zinc-500 text-center max-w-[200px]">
                    Click to browse. Supports JPG, PNG up to 5MB.
                  </p>
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/jpeg, image/png" 
                className="hidden" 
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
