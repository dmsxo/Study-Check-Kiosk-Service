import { useState } from "react";
import { X, Camera, UserRound, Loader2 } from "lucide-react";
import api from "../../api/AttendanceAPI";
import { useAuth } from "../../contexts/AuthContext";

const ProfileEditModal = ({ isOpen, onClose, initialData }) => {
  const { user, refetchUser } = useAuth();
  const [formData, setFormData] = useState({
    description: initialData?.description || "",
    profileURL: initialData?.profileURL || null,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    initialData?.profileURL || null
  );
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 형식 체크
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("JPG, PNG, WebP 형식만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 체크 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    if (previewImage && previewImage.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }

    // 미리보기용 로컬 URL 생성
    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewImage(localPreviewUrl);
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    setIsUploading(true);

    try {
      const body = new FormData();

      body.append("description", formData.description);
      if (selectedFile) body.append("image", selectedFile);
      else if (!previewImage) body.append("profileImageFilename", null);

      // 업데이트된 데이터 저장
      await api.patch(`/users/${user.studentId}`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await refetchUser();

      onClose();
    } catch (error) {
      alert("프로필 업데이트에 실패했습니다.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    // 로컬 미리보기 URL 해제
    if (previewImage && previewImage.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }

    setFormData({
      name: initialData?.name || "",
      description: initialData?.description || "",
      profileURL: initialData?.profileURL || null,
    });
    setPreviewImage(initialData?.profileURL || null);
    setSelectedFile(null);
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
            disabled={isUploading}
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
                className={`absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-colors ${
                  isUploading
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <Camera className="size-4" />
                <input
                  id="profile-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              {previewImage && (
                <button
                  type="button"
                  onClick={() => {
                    if (previewImage.startsWith("blob:")) {
                      URL.revokeObjectURL(previewImage);
                    }
                    setPreviewImage(null);
                    setSelectedFile(null);
                    setFormData({
                      description: formData.description,
                      profileURL: null,
                    });
                  }}
                  className={`absolute -bottom-1 -left-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors ${
                    isUploading
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  disabled={isUploading}
                  aria-label="프로필 사진 삭제"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {selectedFile
                ? `${selectedFile.name} 선택됨`
                : "클릭하여 사진 변경"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WebP (최대 5MB)
            </p>
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
              disabled={isUploading}
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
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUploading}
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  업로드 중...
                </>
              ) : (
                "저장"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileEditModal;
