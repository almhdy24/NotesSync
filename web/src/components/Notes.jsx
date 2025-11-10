import { useEffect, useState } from 'react';
import { apiClient } from '../api';
import { useAuth } from '../contexts/AuthContext';
import NoteItem from './NoteItem';
import NoteEditor from './NoteEditor';
import SearchBar from './SearchBar';
import SyncStatus from './SyncStatus';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [syncStatus, setSyncStatus] = useState('idle');
  const { user, logout } = useAuth();

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await apiClient.fetchNotes();
      if (data.success) {
        setNotes(data.notes);
        setFilteredNotes(data.notes);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
      alert('Failed to load notes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (noteData) => {
    setSyncStatus('saving');
    try {
      const result = await apiClient.addNote(noteData);
      if (result.success) {
        await loadNotes(); // Reload to get the latest data
        setShowEditor(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to add note:', error);
      alert('Failed to add note: ' + error.message);
      return false;
    } finally {
      setSyncStatus('idle');
    }
  };

  const handleUpdateNote = async (id, noteData) => {
    setSyncStatus('saving');
    try {
      const result = await apiClient.updateNote(id, noteData);
      if (result.success) {
        await loadNotes();
        setEditingNote(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update note:', error);
      alert('Failed to update note: ' + error.message);
      return false;
    } finally {
      setSyncStatus('idle');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    setSyncStatus('deleting');
    try {
      const result = await apiClient.deleteNote(id);
      if (result.success) {
        await loadNotes();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note: ' + error.message);
    } finally {
      setSyncStatus('idle');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredNotes(notes);
      return;
    }

    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredNotes(filtered);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  if (!user) {
    return null; // Will be handled by AuthProvider
  }

  return (
    <div className="container-fluid py-3 bg-light min-vh-100">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col">
          <h2 className="mb-0 text-primary">
            <i className="bi bi-journal-text me-2"></i>NoteSync
          </h2>
          <small className="text-muted">Your notes, synchronized everywhere</small>
        </div>
        <div className="col-auto">
          <div className="d-flex align-items-center gap-3">
            <SyncStatus status={syncStatus} />
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle me-1"></i>
                {user.email}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" onClick={logout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="row mb-4">
        <div className="col-md-8">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="col-md-4 text-end">
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingNote(null);
              setShowEditor(true);
            }}
          >
            <i className="bi bi-plus-lg me-1"></i> New Note
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading your notes...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-5">
          {searchQuery ? (
            <>
              <i className="bi bi-search display-1 text-muted"></i>
              <h4 className="text-muted mt-3">No notes found</h4>
              <p>Try adjusting your search terms</p>
            </>
          ) : (
            <>
              <i className="bi bi-journal-plus display-1 text-muted"></i>
              <h4 className="text-muted mt-3">No notes yet</h4>
              <p>Create your first note to get started</p>
              <button
                className="btn btn-primary mt-2"
                onClick={() => setShowEditor(true)}
              >
                Create Note
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="row g-3">
          {filteredNotes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Note Editor Modal */}
      {showEditor && (
        <NoteEditor
          note={editingNote}
          onSave={editingNote ? handleUpdateNote : handleAddNote}
          onClose={() => {
            setShowEditor(false);
            setEditingNote(null);
          }}
        />
      )}
    </div>
  );
}