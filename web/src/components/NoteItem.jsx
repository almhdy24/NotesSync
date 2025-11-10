import { useState } from 'react';

export default function NoteItem({ note, onDelete, onEdit }) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
      <div
        className={`card h-100 shadow-sm border-0 transition-all ${
          isHovered ? 'shadow' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: 'pointer' }}
        onClick={() => onEdit(note)}
      >
        <div className="card-body">
          <h6 className="card-title text-truncate" title={note.title}>
            {note.title || 'Untitled Note'}
          </h6>
          <p className="card-text text-muted small line-clamp-3">
            {truncateContent(note.content || 'No content')}
          </p>
        </div>
        <div className="card-footer bg-transparent border-0 pt-0">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              <i className="bi bi-clock me-1"></i>
              {formatDate(note.updated_at || note.created_at)}
            </small>
            <div className="btn-group" onClick={(e) => e.stopPropagation()}>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => onEdit(note)}
                title="Edit note"
              >
                <i className="bi bi-pencil"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDelete(note.id)}
                title="Delete note"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}