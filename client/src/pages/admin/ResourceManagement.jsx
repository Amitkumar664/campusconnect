import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
  CheckCircle,
  AlertCircle,
  Search,
  Check,
  Ban
} from 'lucide-react';
import { resourceAPI } from '../../services/api';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'laboratory',
    building: '',
    floor: '',
    capacity: 40,
    amenities: '',
    description: '',
    isActive: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const loadResources = async () => {
    try {
      const res = await resourceAPI.getAll();
      if (res.data.success) {
        setResources(res.data.resources);
        setFilteredResources(res.data.resources);
      }
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      setFilteredResources(
        resources.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.code.toLowerCase().includes(q) ||
            r.building.toLowerCase().includes(q)
        )
      );
    } else {
      setFilteredResources(resources);
    }
  }, [search, resources]);

  const openCreateModal = () => {
    setEditingResource(null);
    setFormData({
      name: '',
      code: '',
      type: 'laboratory',
      building: '',
      floor: '',
      capacity: 50,
      amenities: '',
      description: '',
      isActive: true
    });
    setModalOpen(true);
  };

  const openEditModal = (res) => {
    setEditingResource(res);
    setFormData({
      name: res.name,
      code: res.code,
      type: res.type,
      building: res.building,
      floor: res.floor,
      capacity: res.capacity,
      amenities: (res.amenities || []).join(', '),
      description: res.description || '',
      isActive: res.isActive
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      if (editingResource) {
        const res = await resourceAPI.update(editingResource._id, formData);
        if (res.data.success) {
          setFeedback({ type: 'success', text: 'Resource updated successfully!' });
        }
      } else {
        const res = await resourceAPI.create(formData);
        if (res.data.success) {
          setFeedback({ type: 'success', text: 'New campus resource provisioned successfully!' });
        }
      }
      setModalOpen(false);
      await loadResources();
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.response?.data?.message || 'Operation failed.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (resource) => {
    try {
      await resourceAPI.update(resource._id, { isActive: !resource.isActive });
      await loadResources();
    } catch (error) {
      alert('Could not update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      const res = await resourceAPI.delete(id);
      if (res.data.success) {
        setFeedback({ type: 'success', text: 'Resource removed.' });
        await loadResources();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete resource');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-campus-text">
            Campus Resource Management
          </h1>
          <p className="text-sm text-campus-textMuted mt-1">
            Provision smart lecture halls, advanced computer laboratories, and specialized facilities.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={openCreateModal}>
          Add New Resource
        </Button>
      </div>

      {feedback.text && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Search Bar */}
      <Input
        placeholder="Filter resources by name, code, or building..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={Search}
      />

      {/* Resource Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-sm text-campus-textMuted flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-campus-primary border-t-transparent rounded-full animate-spin" />
          Loading campus inventory...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res._id}
              className={`bg-campus-card rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                res.isActive ? 'border-campus-border hover:border-campus-borderGlow' : 'border-zinc-800 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-white/5 text-campus-primary font-bold">
                    {res.code}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-campus-amber font-semibold bg-campus-amber/10 px-2 py-0.5 rounded-lg border border-campus-amber/20">
                    <Users className="w-3.5 h-3.5" />
                    <span>{res.capacity} seats</span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-base text-campus-text mt-3">
                  {res.name}
                </h3>
                <p className="text-xs text-campus-textMuted capitalize mt-0.5">
                  Type: {res.type}
                </p>

                <div className="flex items-center gap-2 text-xs text-campus-textMuted mt-2">
                  <MapPin className="w-3.5 h-3.5 text-campus-textSubtle flex-shrink-0" />
                  <span>{res.building}, {res.floor}</span>
                </div>

                {res.amenities && res.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {res.amenities.map((a, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-campus-surface border border-campus-border/60 text-campus-textMuted"
                      >
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-campus-border/60 flex items-center justify-between">
                <button
                  onClick={() => handleToggleStatus(res)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                    res.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                  }`}
                >
                  {res.isActive ? 'Active' : 'Deactivated'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(res)}
                    className="p-1.5 rounded-lg text-campus-textSubtle hover:text-campus-text hover:bg-white/5"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(res._id)}
                    className="p-1.5 rounded-lg text-campus-textSubtle hover:text-campus-danger hover:bg-rose-500/10"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingResource ? 'Edit Campus Facility' : 'Provision New Facility'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Resource Name"
            name="name"
            placeholder="e.g. Alan Turing Advanced Computing Lab"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Resource Code (Unique)"
              name="code"
              placeholder="e.g. LAB-CS-101"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />

            <Input
              label="Type"
              name="type"
              type="select"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { label: 'Laboratory', value: 'laboratory' },
                { label: 'Classroom', value: 'classroom' },
                { label: 'Seminar Hall', value: 'seminar_hall' },
                { label: 'Conference Room', value: 'conference_room' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Building"
              name="building"
              placeholder="e.g. Turing Block"
              value={formData.building}
              onChange={(e) => setFormData({ ...formData, building: e.target.value })}
              required
            />
            <Input
              label="Floor"
              name="floor"
              placeholder="e.g. 2nd Floor"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              required
            />
            <Input
              label="Capacity (Seats)"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              required
            />
          </div>

          <Input
            label="Amenities / Hardware (comma-separated)"
            name="amenities"
            placeholder="e.g. 60 GPU PCs, Dual Projectors, Gigabit LAN, AC"
            value={formData.amenities}
            onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
          />

          <Input
            label="Description / Purpose"
            name="description"
            type="textarea"
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {editingResource ? 'Update Facility' : 'Create Facility'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ResourceManagement;

