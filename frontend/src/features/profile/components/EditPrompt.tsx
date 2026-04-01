import { useState } from 'react';
import { TOPICS, SUPPORTED_LANGUAGES } from '../../../constants';
import { extractError } from '../../../api/api';
import type { FieldConfig } from '../../../types';

interface Props {
  title: string;
  fields: FieldConfig[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
  onClose: () => void;
}

const INPUT_CLASS = 'bg-fray-input-bg border border-fray-border text-fray-text text-sm px-4 py-2.5 outline-none focus:border-fray-primary transition-colors duration-200 placeholder:text-fray-text-faint w-full';
const LABEL_CLASS = 'text-xs font-semibold uppercase tracking-widest text-fray-text-faint';

export default function EditPrompt({ title, fields, onSubmit, onClose }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, '']))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function setValue(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleTopic(topic: string) {
    const current = values['preferred_topics']
      ? values['preferred_topics'].split(',').filter(Boolean)
      : [];
    const lower = topic.toLowerCase();
    const next = current.includes(lower)
      ? current.filter((t) => t !== lower)
      : [...current, lower];
    setValue('preferred_topics', next.join(','));
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
      <div className="w-full max-w-sm bg-fray-glass border border-fray-border backdrop-blur-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-fray-text">{title}</h2>
          <button
            onClick={onClose}
            className="text-fray-text-faint hover:text-fray-text transition-colors duration-200 bg-transparent border-none cursor-pointer text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {fields.map((field) => (
            <label key={field.key} className="flex flex-col gap-1.5">
              <span className={LABEL_CLASS}>{field.label}</span>

              {(field.type === 'text' || field.type === 'password') && (
                <input
                  type={field.type}
                  value={values[field.key]}
                  onChange={(e) => setValue(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={INPUT_CLASS}
                />
              )}

              {field.type === 'topics' && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {TOPICS.map((topic) => {
                    const active = (values['preferred_topics'] ?? '')
                      .split(',')
                      .includes(topic.toLowerCase());
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 border transition-colors duration-200 ${
                          active
                            ? 'border-fray-primary text-fray-primary'
                            : 'border-fray-border text-fray-text-faint hover:border-fray-primary hover:text-fray-primary'
                        }`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
              )}

              {field.type === 'select' && (
                <select
                  value={values[field.key]}
                  onChange={(e) => setValue(field.key, e.target.value)}
                  className={INPUT_CLASS}
                >
                  <option value="" disabled>Select a language</option>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                  ))}
                </select>
              )}
            </label>
          ))}

          {error && <p className="text-xs text-fray-danger">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-fray-primary text-fray-ink text-sm font-semibold hover:bg-fray-primary-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Apply'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-fray-border text-fray-text-light text-sm font-semibold hover:border-fray-border-hover hover:text-fray-text transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
