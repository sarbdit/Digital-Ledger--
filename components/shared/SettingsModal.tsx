
import React, { useRef, useState } from 'react';
import Modal from './Modal';
import { useLanguage } from '../../contexts/LanguageContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentLogo: string | null;
    onSaveLogo: (logoData: string | null) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentLogo, onSaveLogo }) => {
    const { t } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(currentLogo);

    React.useEffect(() => {
        setPreview(currentLogo);
    }, [currentLogo, isOpen]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onSaveLogo(preview);
    }
    
    const handleRemove = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onSaveLogo(null);
    };

    const triggerFileSelect = () => fileInputRef.current?.click();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('settingsModal.title')}>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{t('settingsModal.companyLogo')}</h3>
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                            {preview ? (
                                <img src={preview} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                            ) : (
                                <span className="text-xs text-gray-500">{t('settingsModal.noLogo')}</span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                             <input
                                type="file"
                                accept="image/png, image/jpeg, image/svg+xml"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button
                                onClick={triggerFileSelect}
                                className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-bold py-2 px-4 rounded-lg text-sm"
                            >
                                {t('settingsModal.chooseLogo')}
                            </button>
                            {preview && (
                                <button
                                    onClick={handleRemove}
                                    className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 font-bold py-2 px-4 rounded-lg text-sm"
                                >
                                    {t('settingsModal.removeLogo')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t dark:border-gray-700">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                        {t('cancel')}
                    </button>
                    <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                        {t('settingsModal.saveChanges')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SettingsModal;
