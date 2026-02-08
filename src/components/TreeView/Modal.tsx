import React, { useEffect, useRef } from 'react';

interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  title,
  message,
  confirmLabel = 'Delete',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop-custom">
      <div className="modal d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">{title}</h5>
              <button type="button" className="btn-close" onClick={onCancel} />
            </div>
            <div className="modal-body pt-2">
              <p className="text-muted mb-0">{message}</p>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button type="button" className={`btn btn-sm btn-${confirmVariant}`} onClick={onConfirm}>
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface InputModalProps {
  show: boolean;
  title: string;
  placeholder?: string;
  confirmLabel?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export const InputModal: React.FC<InputModalProps> = ({
  show,
  title,
  placeholder = 'Enter name...',
  confirmLabel = 'Add',
  onConfirm,
  onCancel,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState('');

  useEffect(() => {
    if (show) {
      setValue('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [show]);

  const handleSubmit = () => {
    if (value.trim()) {
      onConfirm(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') onCancel();
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop-custom">
      <div className="modal d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">{title}</h5>
              <button type="button" className="btn-close" onClick={onCancel} />
            </div>
            <div className="modal-body">
              <input
                ref={inputRef}
                type="text"
                className="form-control"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleSubmit}
                disabled={!value.trim()}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
