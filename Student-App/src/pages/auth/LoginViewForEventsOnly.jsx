import React, { useState } from "react";
import { User, Camera, ChevronDown, LogIn, Loader2, X } from "lucide-react";
import api from "../../api/Instance";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginViewForEventsOnly() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    studentId: "",
    description: "",
    profileImage: null,
  });
  const [loginStudentId, setLoginStudentId] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [startButtonState, setStartButtonState] = useState("writing"); // writing, creating_user, Logging

  const { login } = useAuth();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 형식 체크
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("JPG, PNG, WebP 형식의 이미지만 업로드 가능합니다.");
        e.target.value = "";
        return;
      }

      setFormData({ ...formData, profileImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleImageRemove = () => {
    setFormData({ ...formData, profileImage: null });
    setImagePreview(null);
  };

  const handleGradeChange = (e) => {
    const grade = e.target.value;

    // 학번 불러오기
    api.get(`/users/studentId?grade=${grade}`).then((res) => {
      const studentId = res.data;
      setFormData({ ...formData, grade, studentId });
    });
  };

  const validateSignupForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    if (!formData.grade) {
      newErrors.grade = "학년을 선택해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLoginForm = () => {
    const newErrors = {};

    if (!loginStudentId.trim()) {
      newErrors.studentId = "학번을 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (validateSignupForm()) {
      setStartButtonState("creating_user");
      const body = new FormData();
      body.append("name", formData.name);
      body.append("studentId", formData.studentId);
      if (formData.description !== "")
        body.append("description", formData.description);
      if (formData.profileImage) body.append("image", formData.profileImage);
      api
        .post("/users", body, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
          setStartButtonState("Logging");
          login(Number(formData.studentId));
        });
    }
  };

  const handleLogin = () => {
    if (validateLoginForm()) {
      setStartButtonState("Logging");
      login(Number(loginStudentId));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  const renderSignUpButton = () => {
    switch (startButtonState) {
      case "writing":
        return (
          <button
            onClick={handleSignup}
            className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 transition shadow-lg hover:shadow-xl active:scale-98"
          >
            시작하기
          </button>
        );
      case "creating_user":
        return (
          <div className="flex items-center justify-center gap-2 w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 transition shadow-lg hover:shadow-xl active:scale-98">
            <Loader2 className="size-4 animate-spin" />
            유저 생성중...
          </div>
        );
      case "Logging":
        return (
          <div className="flex items-center justify-center gap-2 w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 transition shadow-lg hover:shadow-xl active:scale-98">
            <Loader2 className="size-4 animate-spin" />
            로그인중...
          </div>
        );
    }
  };

  const renderLoginButton = () => {
    switch (startButtonState) {
      case "writing":
        return (
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 transition shadow-lg hover:shadow-xl active:scale-98"
          >
            로그인
          </button>
        );
      case "Logging":
        return (
          <div className="flex items-center justify-center gap-2 w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 transition shadow-lg hover:shadow-xl active:scale-98">
            <Loader2 className="size-4 animate-spin" />
            로그인중...
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {isLogin ? "로그인" : "프로필 만들기"}
          </h1>
          <p className="text-gray-500 text-lg">
            {isLogin ? "학번으로 로그인하세요" : "나를 표현해보세요"}
          </p>
        </div>

        {isLogin ? (
          // 로그인 화면
          <div className="space-y-8">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
                <LogIn className="w-12 h-12 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                학번
              </label>
              <input
                type="text"
                value={loginStudentId}
                onChange={(e) => setLoginStudentId(e.target.value)}
                className={`w-full px-5 py-4 rounded-2xl border-2 ${
                  errors.studentId ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:border-black transition text-lg text-center tracking-wider`}
                placeholder="20129"
              />
              {errors.studentId && (
                <p className="text-red-500 text-sm mt-2 ml-1">
                  {errors.studentId}
                </p>
              )}
            </div>

            <>{renderLoginButton()}</>

            <div className="text-center pt-4">
              <p className="text-gray-500 text-sm">
                처음이신가요?{" "}
                <button
                  onClick={toggleMode}
                  className="text-black font-semibold hover:underline"
                >
                  프로필 만들기
                </button>
              </p>
            </div>
          </div>
        ) : (
          // 회원가입 화면
          <div className="space-y-8">
            {/* 프로필 이미지 */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                {imagePreview ? (
                  <>
                    <button
                      onClick={handleImageRemove}
                      className="absolute bottom-1 left-1 bg-red-500 text-white rounded-full p-2.5 cursor-pointer hover:bg-red-600 transition shadow-lg"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <label
                      htmlFor="profile-upload-change"
                      className="absolute bottom-1 right-1 bg-black text-white rounded-full p-2.5 cursor-pointer hover:bg-gray-800 transition shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                    </label>
                    <input
                      id="profile-upload-change"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </>
                ) : (
                  <>
                    <label
                      htmlFor="profile-upload-new"
                      className="absolute bottom-1 right-1 bg-black text-white rounded-full p-2.5 cursor-pointer hover:bg-gray-800 transition shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                    </label>
                    <input
                      id="profile-upload-new"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </>
                )}
              </div>
            </div>

            {/* 이름 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                이름
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full px-5 py-4 rounded-2xl border-2 ${
                  errors.name ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:border-black transition text-lg`}
                placeholder="이름 또는 별명"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-2 ml-1">{errors.name}</p>
              )}
            </div>

            {/* 학년 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                학년
              </label>
              <div className="relative">
                <select
                  value={formData.grade}
                  onChange={handleGradeChange}
                  className={`w-full px-5 py-4 rounded-2xl border-2 ${
                    errors.grade ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:border-black transition bg-white text-lg appearance-none cursor-pointer`}
                >
                  <option value="">학년 선택</option>
                  <option value="1">1학년</option>
                  <option value="2">2학년</option>
                  <option value="3">3학년</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.grade && (
                <p className="text-red-500 text-sm mt-2 ml-1">{errors.grade}</p>
              )}
            </div>

            {/* 학번 (자동 생성) */}
            {formData.studentId && (
              <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-600">
                    학번
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formData.studentId}
                  </span>
                </div>
              </div>
            )}

            {/* 상태 메시지 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                상태 메시지
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-black transition resize-none text-lg"
                rows="3"
                placeholder="자유롭게 작성해보세요..."
              />
            </div>

            {/* 제출 버튼 */}
            <>{renderSignUpButton()}</>

            <div className="text-center pt-4">
              <p className="text-gray-500 text-sm">
                이미 프로필이 있나요?{" "}
                <button
                  onClick={toggleMode}
                  className="text-black font-semibold hover:underline"
                >
                  로그인
                </button>
              </p>
            </div>
          </div>
        )}

        {/* 푸터 */}
        <p className="text-center text-gray-400 text-sm mt-8">
          {isLogin
            ? "학번을 잊어버렸다면 관리자에게 문의하세요"
            : "언제든지 프로필을 수정할 수 있어요"}
        </p>
      </div>
    </div>
  );
}
