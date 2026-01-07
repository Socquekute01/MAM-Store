import { adminApi } from '@/services/admin.api';
import { userAPI } from '@/services/user.api';
import { ArrowLeft, Check, Edit2, Folder, GripVertical, Image, Package, Plus, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Category, Product, ProductDetail, ProductImage, ProductType } from './admin.types';

function Products({ productView, setProductView }: ProductType) {
  // Product states
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [draggedImage, setDraggedImage] = useState<ProductImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //edit mode
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [editProductName, setEditProductName] = useState('');
  const [editProductDesc, setEditProductDesc] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (productView === 'products' && selectedCategory) {
      loadProducts(selectedCategory);
    }
  }, [productView, selectedCategory]);

  useEffect(() => {
    if (productView === 'detail' && selectedProduct) {
      loadProductDetail(selectedProduct);
    }
  }, [productView, selectedProduct]);

  const loadCategories = async () => {
    const data = await userAPI.getCategories();
    setCategories(data || []);
  };

  const loadProducts = async (categoryId: number) => {
    const data = await userAPI.getProducts(categoryId);
    setProducts(data);
  };

  const loadProductDetail = async (productId: number) => {
    const data = await userAPI.getProductDetail(productId);
    setProductDetail(data);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    const newCat = await adminApi.createCategory(newCategoryName);
    setCategories([newCat.data, ...categories]);
    setNewCategoryName('');
    setShowCategoryModal(false);
  };

  const handleCreateProduct = async () => {
    if (!newProductName.trim() || !selectedCategory) return;
    await adminApi.createProduct(selectedCategory, newProductName, newProductDesc);
    setNewProductName('');
    setNewProductDesc('');
    setShowProductModal(false);
    loadProducts(selectedCategory);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !selectedProduct) return;

    const uploaded = await adminApi.uploadImages(selectedProduct, files);
    setProductDetail((prev) =>
      prev
        ? {
            ...prev,
            images: [...prev.images, ...uploaded?.data],
          }
        : null,
    );
  };

  const handleSetThumbnail = async (imageId: number) => {
    await adminApi.setThumbnail(imageId);
    setProductDetail((prev) =>
      prev
        ? {
            ...prev,
            images: prev.images.map((img) => ({
              ...img,
              is_thumbnail: img.id == imageId ? 1 : 0,
            })),
          }
        : null,
    );
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Xóa ảnh này?')) return;
    await adminApi.deleteImage(imageId);
    setProductDetail((prev) =>
      prev
        ? {
            ...prev,
            images: prev.images.filter((img) => img.id !== imageId),
          }
        : null,
    );
  };

  const handleDragStart = (image: ProductImage) => {
    setDraggedImage(image);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetImage: ProductImage) => {
    if (!draggedImage || !productDetail || draggedImage.id == targetImage.id) return;

    const images = [...productDetail.images];
    const draggedIdx = images.findIndex((img) => img.id == draggedImage.id);
    const targetIdx = images.findIndex((img) => img.id == targetImage.id);

    images.splice(draggedIdx, 1);
    images.splice(targetIdx, 0, draggedImage);

    const imageOrders = images.map((img, idx) => ({ id: img.id, sort_order: idx }));

    setProductDetail({
      ...productDetail,
      images: images.map((img, idx) => ({ ...img, sort_order: idx })),
    });

    await adminApi.reorderImages(imageOrders);
    setDraggedImage(null);
  };
  // Category Edit & Delete
  const handleUpdateCategory = async (categoryId: number) => {
    if (!editCategoryName.trim()) return;
    await adminApi.updateCategory(categoryId, editCategoryName);
    setCategories(categories.map((cat) => (cat.id === categoryId ? { ...cat, name: editCategoryName } : cat)));
    setEditingCategory(null);
    setEditCategoryName('');
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Xóa danh mục này? Nếu còn thiết kế trong danh mục sẽ không thể xóa.')) return;
    const res = await adminApi.deleteCategory(categoryId);
    if (res.success) {
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    }
    else {
      alert(res.error || 'Xóa danh mục thất bại');
    }
  };

  // Product Edit & Delete
  const handleUpdateProduct = async (productId: number) => {
    if (!editProductName.trim()) return;
    await adminApi.updateProduct(productId, editProductName, editProductDesc);
    setProducts(
      products.map((p) => (p.id === productId ? { ...p, name: editProductName, description: editProductDesc } : p)),
    );
    setEditingProduct(null);
    setEditProductName('');
    setEditProductDesc('');
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    await adminApi.deleteProduct(productId);
    setProducts(products.filter((p) => p.id !== productId));
  };

  return (
    <>
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {productView === 'categories' && (
          <>
            <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Portfolio & Dự án</h2>
                <p className="text-sm text-slate-500 mt-1">{categories.length} danh mục</p>
              </div>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="px-4 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
              >
                <Plus size={18} />
                Thêm danh mục
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Folder size={48} className="text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700">Chưa có danh mục nào</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm">
                    Tạo danh mục đầu tiên để bắt đầu quản lý portfolio của bạn.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-300 transition-all"
                    >
                      {editingCategory === cat.id ? (
                        <div className="space-y-3">
                          <input
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdateCategory(cat.id)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-400"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateCategory(cat.id)}
                              className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={() => {
                                setEditingCategory(null);
                                setEditCategoryName('');
                              }}
                              className="flex-1 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-medium"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setProductView('products');
                            }}
                            className="flex items-center gap-4 mb-4 cursor-pointer"
                          >
                            <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                              <Folder className="text-white" size={28} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900 text-lg">{cat.name}</h3>
                              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <Package size={14} />
                                {cat.product_count || 0} sản phẩm
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 pt-3 border-t border-slate-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCategory(cat.id);
                                setEditCategoryName(cat.name);
                              }}
                              className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                            >
                              <Edit2 size={16} />
                              Sửa
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(cat.id);
                              }}
                              className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                            >
                              <Trash2 size={16} />
                              Xóa
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        {productView === 'products' && (
          <>
            <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setProductView('categories')}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {categories.find((c) => c.id == selectedCategory)?.name}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">{products.length} sản phẩm</p>
                </div>
              </div>
              <button
                onClick={() => setShowProductModal(true)}
                className="px-4 py-2.5 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
              >
                <Plus size={18} />
                Thêm sản phẩm
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Package size={48} className="text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700">Chưa có sản phẩm nào</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm">Thêm sản phẩm đầu tiên vào danh mục này.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all"
                    >
                      {editingProduct === product.id ? (
                        <div className="p-5 space-y-3">
                          <input
                            value={editProductName}
                            onChange={(e) => setEditProductName(e.target.value)}
                            placeholder="Tên sản phẩm"
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-400"
                            autoFocus
                          />
                          <textarea
                            value={editProductDesc}
                            onChange={(e) => setEditProductDesc(e.target.value)}
                            placeholder="Mô tả"
                            rows={3}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-400 resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateProduct(product.id)}
                              className="flex-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={() => {
                                setEditingProduct(null);
                                setEditProductName('');
                                setEditProductDesc('');
                              }}
                              className="flex-1 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-medium"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            onClick={() => {
                              setSelectedProduct(product.id);
                              setProductView('detail');
                            }}
                            className="cursor-pointer"
                          >
                            <div className="aspect-video bg-slate-100 overflow-hidden">
                              {product.thumbnail ? (
                                <img
                                  src={product.thumbnail}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Image className="text-slate-300" size={48} />
                                </div>
                              )}
                            </div>
                            <div className="p-5">
                              <h3 className="font-semibold text-slate-900 mb-2">{product.name}</h3>
                              <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                                {product.description}
                              </p>
                              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                  <Image size={14} />
                                  <span>{product.image_count} ảnh</span>
                                </div>
                                <span className="text-xs text-slate-400">
                                  {new Date(product.created_at).toLocaleDateString('vi-VN')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 px-5 pb-5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingProduct(product.id);
                                setEditProductName(product.name);
                                setEditProductDesc(product.description);
                              }}
                              className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                            >
                              <Edit2 size={16} />
                              Sửa
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProduct(product.id);
                              }}
                              className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                            >
                              <Trash2 size={16} />
                              Xóa
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {productView === 'detail' && productDetail && (
          <>
            <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setProductView('products')}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{productDetail.name}</h2>
                  <p className="text-sm text-slate-500 mt-1">{productDetail.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
                >
                  <Upload size={18} />
                  Upload ảnh
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {productDetail.images.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Image size={48} className="text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700">Chưa có ảnh nào</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm mb-4">Upload ảnh đầu tiên cho sản phẩm này.</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 shadow-md transition-all"
                  >
                    <Upload size={18} />
                    Chọn ảnh
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {productDetail.images.map((image) => (
                    <div
                      key={image.id}
                      draggable
                      onDragStart={() => handleDragStart(image)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(image)}
                      className="relative group bg-white border-2 border-slate-200 rounded-xl overflow-hidden cursor-move hover:border-blue-400 transition-all hover:shadow-lg"
                    >
                      {image.is_thumbnail == 1 && (
                        <div className="absolute top-2 left-2 z-10 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg font-medium">
                          <Check size={12} />
                          <span>Thumbnail</span>
                        </div>
                      )}

                      <div className="absolute top-2 right-2 z-10 bg-black/50 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical size={16} />
                      </div>

                      <div className="aspect-square bg-slate-100">
                        <img src={image.image_url} alt="" className="w-full h-full object-cover" />
                      </div>

                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3 gap-2">
                        {image.is_thumbnail == 0 && (
                          <button
                            onClick={() => handleSetThumbnail(image.id)}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-md transition-all"
                          >
                            Chọn Thumbnail
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {showCategoryModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCategoryModal(false)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Thêm danh mục mới</h3>
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
              placeholder="Tên danh mục (vd: Website Design)"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-4 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all font-medium text-slate-700"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateCategory}
                className="flex-1 px-4 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all font-medium shadow-md"
              >
                Tạo danh mục
              </button>
            </div>
          </div>
        </div>
      )}

      {showProductModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowProductModal(false)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Thêm sản phẩm mới</h3>
            <input
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="Tên sản phẩm"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              autoFocus
            />
            <textarea
              value={newProductDesc}
              onChange={(e) => setNewProductDesc(e.target.value)}
              placeholder="Mô tả sản phẩm"
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-4 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowProductModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all font-medium text-slate-700"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateProduct}
                className="flex-1 px-4 py-2.5 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl transition-all font-medium shadow-md"
              >
                Tạo sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Products;
