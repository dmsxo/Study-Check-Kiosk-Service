import { useState } from 'react';
import { X, Camera, UserRound } from 'lucide-react';

const ProfileEditModal = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState({
    description: initialData?.description || '',
    profileImage: initialData?.profileImage || null,
  });
  const [previewImage, setPreviewImage] = useState(
    initialData?.profileImage || null
  );

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. 파일 형식 체크
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('JPG, PNG, WebP 형식만 업로드 가능합니다.');
      return;
    }

    // 2. 파일 크기 체크 (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Canvas로 리사이징
        const canvas = document.createElement('canvas');
        const maxWidth = 500;
        const maxHeight = 500;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Base64로 변환 (압축)
        const resizedImage = canvas.toDataURL('image/jpeg', 0.8);
        setPreviewImage(resizedImage);
        setFormData({ ...formData, profileImage: resizedImage });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      description: initialData?.description || '',
      profileImage: initialData?.profileImage || null,
    });
    setPreviewImage(initialData?.profileImage || null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">프로필 수정</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="닫기"
          >
            <X className="size-6" />
          </button>
        </div>

        <div>
          {/* Profile Image */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="size-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="프로필 미리보기"
                    className="size-full object-cover"
                  />
                ) : (
                  <UserRound className="size-12 text-gray-400" />
                )}
              </div>
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors"
              >
                <Camera className="size-4" />
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">클릭하여 사진 변경</p>
          </div>

          {/* Description Input */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              상태 메시지
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="상태 메시지를 입력하세요"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {formData.description.length}/100
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileEditModal;
