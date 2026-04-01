import { useState } from 'react';
import { SUPPORTED_LANGUAGES } from '../../../constants';
import { extractError } from '../../../api/api';
import type { FieldConfig } from '../../../types';
import TopicToggler from '../../../components/TopicToggler';
import PromptCard from '../../../components/PromptCard';
import { formInput, formLabel, formError, btnPrimary, btnSecondary } from '../../../styles/common';

interface Props {
  title: string;
  fields: FieldConfig[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
  onClose: () => void;
}

export default function EditPrompt({ title, fields, onSubmit, onClose }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, '']))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function setValue(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (err: unknown) {
      setError(extractError(err, 'Something went wrong. Please try again.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-fray-overlay px-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <PromptCard title={title} onClose={onClose}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {fields.map((field) =>
            field.type === 'topics' ? (
              <div key={field.key} className="flex flex-col gap-1.5">
                <span className={formLabel}>{field.label}</span>
                <TopicToggler
                  value={values['preferred_topics'] ?? ''}
                  onChange={(v) => setValue('preferred_topics', v)}
                />
              </div>
            ) : (
              <label key={field.key} className="flex flex-col gap-1.5">
                <span className={formLabel}>{field.label}</span>

                {(field.type === 'text' || field.type === 'password') && (
                  <input
                    type={field.type}
                    value={values[field.key]}
                    onChange={(e) => setValue(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className={formInput}
                  />
                )}

                {field.type === 'select' && (
                  <select
                    value={values[field.key]}
                    onChange={(e) => setValue(field.key, e.target.value)}
                    className={formInput}
                  >
                    <option value="" disabled>Select a language</option>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                    ))}
                  </select>
                )}
              </label>
            )
          )}

          {error && <p className={formError}>{error}</p>}

          <div className="flex gap-3 mt-2">
            <button type="submit" disabled={loading} className={`flex-1 ${btnPrimary}`}>
              {loading ? 'Saving...' : 'Apply'}
            </button>
            <button type="button" onClick={onClose} className={`flex-1 ${btnSecondary}`}>
              Cancel
            </button>
          </div>
        </form>
      </PromptCard>
    </div>
  );
}
