import { useState, useEffect } from 'react';

export default function NoteEditor({ note, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      alert('Note must have either title or content');
      return;
    }

    setSaving(true);
    const noteData = {
      title: title.trim(),
      content: content.trim(),
    };

    const success = note
      ? await onSave(note.id, noteData)
      : await onSave(noteData);

    if (success) {
      onClose();
    }
    setSaving(false);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {note ? 'Edit Note' : 'Create New Note'}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={saving}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="noteTitle" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="noteTitle"
                  placeholder="Note title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="noteContent" className="form-label">
                  Content
                </label>
                <textarea
                  className="form-control"
                  id="noteContent"
                  rows="10"
                  placeholder="Write your note here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={saving}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving || (!title.trim() && !content.trim())}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    {note ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <i className={`bi bi-${note ? 'check' : 'plus'}-lg me-1`}></i>
                    {note ? 'Update Note' : 'Create Note'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}