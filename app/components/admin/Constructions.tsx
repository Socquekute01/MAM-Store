import { adminApi } from '@/services/admin.api';
import { Building2, Calendar, Pencil, Plus, Trash2, Upload, Video, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Construction } from './admin.types';

function Constructions() {
  const [constructions, setConstructions] = useState<Construction[]>([]);
  const [showConstructionModal, setShowConstructionModal] = useState(false);
  const [editingConstruction, setEditingConstruction] = useState<Construction | null>(null);
  const [constructionForm, setConstructionForm] = useState({
    image: '',
    completedDate: '',
    title: '',
    videoUrl: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const constructionImageInputRef = useRef<HTMLInputElement>(null);

  // ==================== THÊM VÀO PHẦN EFFECTS ====================
  useEffect(() => {
    loadConstructions();
  }, []);

  // ==================== THÊM VÀO PHẦN HANDLERS ====================
  const loadConstructions = async () => {
    const data = await adminApi.getConstructions();
    setConstructions(data);
  };

  const handleConstructionImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ảnh tối đa 5MB');
      return;
    }

    try {
      setUploadingImage(true);

      // preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // upload
      const { image_url } = await adminApi.uploadImage(file);

      // 🔑 LƯU PATH, KHÔNG LƯU URL
      setConstructionForm((prev) => ({
        ...prev,
        image: image_url,
      }));
    } catch (err) {
      console.error(err);
      alert('Upload ảnh thất bại');
    } finally {
      setUploadingImage(false);
    }
  };
  const handleRemoveImage = () => {
    setConstructionForm({ ...constructionForm, image: '' });
    setImagePreview('');
    if (constructionImageInputRef.current) {
      constructionImageInputRef.current.value = '';
    }
  };

  const handleConstructionSubmit = async () => {
    if (!constructionForm.image || !constructionForm.completedDate || !constructionForm.title) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      if (editingConstruction) {
        await adminApi.updateConstruction(editingConstruction.id, constructionForm);
      } else {
        await adminApi.createConstruction(constructionForm);
      }

      setShowConstructionModal(false);
      setEditingConstruction(null);
      setConstructionForm({ image: '', completedDate: '', title: '', videoUrl: '' });
      loadConstructions();
      setImagePreview('');
      setConstructions(await adminApi.getConstructions());
    } catch (error) {
      console.error('Error saving construction:', error);
    }
  };

  const handleEditConstruction = (construction: Construction) => {
    setEditingConstruction(construction);
    setConstructionForm({
      image: construction.image,
      completedDate: construction.completed_date,
      title: construction.title,
      videoUrl: construction.video_url || '',
    });
    setImagePreview(construction.image);
    setShowConstructionModal(true);
  };

  const handleDeleteConstruction = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa công trình này?')) return;

    try {
      await adminApi.deleteConstruction(id);
      loadConstructions();
    } catch (error) {
      console.error('Error deleting construction:', error);
    }
  };
  return (
    <>
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Công trình đã hoàn thành</h2>
            <p className="text-sm text-slate-500 mt-1">{constructions.length} công trình</p>
          </div>
          <button
            onClick={() => {
              setEditingConstruction(null);
              setConstructionForm({ image: '', completedDate: '', title: '', videoUrl: '' });
              setImagePreview('');
              setShowConstructionModal(true);
            }}
            className="px-4 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={18} />
            Thêm công trình
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {constructions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Building2 size={48} className="text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">Chưa có công trình nào</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                Thêm công trình đầu tiên để showcase dự án của bạn.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {constructions.map((construction) => (
                <div
                  key={construction.id}
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    <img
                      src={construction.image}
                      alt={construction.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {construction.video_url && (
                      <div className="absolute top-3 right-3 bg-black/70 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium">
                        <Video size={14} />
                        Video
                      </div>
                    )}

                    {/* Action Buttons - Show on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEditConstruction(construction)}
                        className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg transition-all"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteConstruction(construction.id)}
                        className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 text-lg mb-3 line-clamp-2 min-h-14">
                      {construction.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-slate-500 pt-3 border-t border-slate-100">
                      <Calendar size={16} />
                      <span>Hoàn thành: {new Date(construction.completed_date).toLocaleDateString('vi-VN')}</span>
                    </div>

                    {construction.video_url && (
                      <a
                        href={construction.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Video size={16} />
                        Xem video
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showConstructionModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowConstructionModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingConstruction ? 'Chỉnh sửa công trình' : 'Thêm công trình mới'}
            </h3>

            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ảnh công trình <span className="text-red-500">*</span>
                </label>

                {!imagePreview ? (
                  <div
                    onClick={() => constructionImageInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                  >
                    <input
                      ref={constructionImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleConstructionImageSelect}
                      className="hidden"
                    />
                    {uploadingImage ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-blue-500"></div>
                        <p className="text-sm text-slate-500">Đang upload...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <Upload className="text-blue-600" size={28} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Click để chọn ảnh</p>
                          <p className="text-xs text-slate-500 mt-1">PNG, JPG tối đa 5MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden border-2 border-slate-200 group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={18} />
                    </button>
                    <button
                      onClick={() => constructionImageInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="text-white text-center">
                        <Upload size={32} className="mx-auto mb-2" />
                        <p className="text-sm font-medium">Thay đổi ảnh</p>
                      </div>
                    </button>
                    <input
                      ref={constructionImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleConstructionImageSelect}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  value={constructionForm.title}
                  onChange={(e) => setConstructionForm({ ...constructionForm, title: e.target.value })}
                  placeholder="Tên công trình"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ngày hoàn thành <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={constructionForm.completedDate}
                  onChange={(e) => setConstructionForm({ ...constructionForm, completedDate: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">URL Video (không bắt buộc)</label>
                <input
                  value={constructionForm.videoUrl}
                  onChange={(e) => setConstructionForm({ ...constructionForm, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowConstructionModal(false);
                  setImagePreview('');
                }}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all font-medium text-slate-700"
              >
                Hủy
              </button>
              <button
                onClick={handleConstructionSubmit}
                disabled={uploadingImage}
                className="flex-1 px-4 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingConstruction ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Constructions;
