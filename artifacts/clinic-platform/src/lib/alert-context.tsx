import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertOptions {
  title?: string;
  message: string;
  type?: AlertType;
  severity?: AlertType;
  confirmText?: string;
  onConfirm?: () => void;
}

export interface ConfirmOptions {
  title?: string;
  message: string;
  type?: AlertType;
  severity?: AlertType;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ActiveDialogState {
  isOpen: boolean;
  isConfirm: boolean;
  title: string;
  message: string;
  type: AlertType;
  confirmText: string;
  cancelText: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface AlertContextType {
  showAlert: (options: AlertOptions | string) => void;
  showConfirm: (options: ConfirmOptions) => void;
  closeAlert: () => void;
}

const AlertContext = createContext<AlertContextType>({
  showAlert: () => {},
  showConfirm: () => {},
  closeAlert: () => {},
});

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialog, setDialog] = useState<ActiveDialogState>({
    isOpen: false,
    isConfirm: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'OK',
    cancelText: 'Cancel',
  });

  const showAlert = useCallback((options: AlertOptions | string) => {
    if (typeof options === 'string') {
      setDialog({
        isOpen: true,
        isConfirm: false,
        title: 'Notice',
        message: options,
        type: 'info',
        confirmText: 'Understood',
        cancelText: 'Cancel',
      });
      return;
    }

    const alertType = options.severity || options.type || 'info';
    const defaultTitle =
      alertType === 'error'
        ? 'Attention Required'
        : alertType === 'warning'
        ? 'Please Note'
        : alertType === 'success'
        ? 'Success'
        : 'Notice';

    setDialog({
      isOpen: true,
      isConfirm: false,
      title: options.title || defaultTitle,
      message: options.message,
      type: alertType,
      confirmText: options.confirmText || 'OK',
      cancelText: 'Cancel',
      onConfirm: options.onConfirm,
    });
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions) => {
    const alertType = options.severity || options.type || 'warning';
    const defaultTitle =
      alertType === 'warning' || alertType === 'error'
        ? 'Confirm Action'
        : 'Confirmation Required';

    setDialog({
      isOpen: true,
      isConfirm: true,
      title: options.title || defaultTitle,
      message: options.message,
      type: alertType,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
    });
  }, []);

  const closeAlert = useCallback(() => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleConfirm = () => {
    const callback = dialog.onConfirm;
    closeAlert();
    if (callback) {
      callback();
    }
  };

  const handleCancel = () => {
    const callback = dialog.onCancel;
    closeAlert();
    if (callback) {
      callback();
    }
  };

  // Keyboard shortcut: Escape to close, Enter to confirm
  useEffect(() => {
    if (!dialog.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialog.isOpen, dialog.onConfirm, dialog.onCancel]);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm, closeAlert }}>
      {children}

      {/* CUSTOM BEAUTIFUL IN-APP ALERT / CONFIRM MODAL */}
      {dialog.isOpen && (
        <div
          id="custom-alert-overlay"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget && !dialog.isConfirm) {
              closeAlert();
            }
          }}
        >
          <div
            id="custom-alert-box"
            className="w-full max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-4 animate-scaleUp transition-all duration-200"
          >
            {/* Header: Icon & Close button */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                    dialog.type === 'error'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                      : dialog.type === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                      : dialog.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-primary/10 border-primary/30 text-primary'
                  }`}
                >
                  {dialog.type === 'error' && <AlertCircle className="h-6 w-6" />}
                  {dialog.type === 'warning' && <AlertTriangle className="h-6 w-6" />}
                  {dialog.type === 'success' && <CheckCircle2 className="h-6 w-6" />}
                  {dialog.type === 'info' && <Info className="h-6 w-6" />}
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {dialog.title}
                  </h3>
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                      dialog.type === 'error'
                        ? 'bg-rose-500/10 text-rose-600'
                        : dialog.type === 'warning'
                        ? 'bg-amber-500/10 text-amber-600'
                        : dialog.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {dialog.type.toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                id="custom-alert-close-btn"
                type="button"
                onClick={handleCancel}
                className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Message Body */}
            <div className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed whitespace-pre-line py-1">
              {dialog.message}
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
              {dialog.isConfirm && (
                <button
                  id="custom-alert-cancel-btn"
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-bold transition cursor-pointer"
                >
                  {dialog.cancelText}
                </button>
              )}

              <button
                id="custom-alert-confirm-btn"
                type="button"
                autoFocus
                onClick={handleConfirm}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-extrabold shadow-sm transition cursor-pointer ${
                  dialog.type === 'error'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : dialog.type === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : dialog.type === 'success'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
              >
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useCustomAlert = () => useContext(AlertContext);
