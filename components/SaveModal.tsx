
import React, { useState } from 'react';
import { Folder } from '../types';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  onSave: (title: string, folderId: string) => void;
  onCreateFolder: (name: string) => string; // Returns new folder ID
}

export const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose, folders, onSave, onCreateFolder }) => {
  const [title, setTitle] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) {
        alert("Dê um nome para o arquivo.");
        return;
    }

    let targetFolderId = selectedFolderId;

    if (isCreatingFolder) {
        if (!newFolderName.trim()) {
            alert("Dê um nome para a pasta.");
            return;
        }
        targetFolderId = onCreateFolder(newFolderName);
    } else if (!targetFolderId) {
        alert("Selecione uma pasta ou crie uma nova.");
        return;
    }

    onSave(title, targetFolderId);
    // Reset fields
    setTitle('');
    setNewFolderName('');
    setIsCreatingFolder(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1C1F26] border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-2xl font-black text-white mb-6">Salvar Conteúdo</h2>

        <div className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nome do Arquivo</label>
                <input 
                    className="w-full bg-[#0F1115] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#E6FF57]"
                    placeholder="Ex: Resumo de História..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Onde salvar?</label>
                
                {!isCreatingFolder ? (
                    <div className="space-y-2">
                        {folders.length > 0 && (
                            <select 
                                className="w-full bg-[#0F1115] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#E6FF57] appearance-none"
                                value={selectedFolderId}
                                onChange={(e) => setSelectedFolderId(e.target.value)}
                            >
                                <option value="" disabled>Selecione uma pasta...</option>
                                {folders.map(f => (
                                    <option key={f.id} value={f.id}>{f.name}</option>
                                ))}
                            </select>
                        )}
                        
                        <button 
                            onClick={() => setIsCreatingFolder(true)}
                            className="text-sm font-bold text-[#E6FF57] hover:underline flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Criar nova pasta
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2 animate-in slide-in-from-left-4">
                        <input 
                            className="w-full bg-[#0F1115] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#E6FF57]"
                            placeholder="Nome da nova pasta..."
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                        />
                         <button 
                            onClick={() => setIsCreatingFolder(false)}
                            className="text-xs font-bold text-gray-500 hover:text-white"
                        >
                            Cancelar criação
                        </button>
                    </div>
                )}
            </div>
        </div>

        <button 
            onClick={handleSave}
            className="w-full mt-8 py-4 bg-[#E6FF57] text-black font-black rounded-xl hover:scale-[1.02] transition-transform shadow-lg"
        >
            SALVAR
        </button>
      </div>
    </div>
  );
};
