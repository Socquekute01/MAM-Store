function Profile() {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Thông tin cá nhân</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-100">
            <div className="w-24 h-24 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              AD
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1 text-slate-900">Administrator</h3>
              <p className="text-slate-500">admin@mam.com</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Họ tên</label>
              <input
                type="text"
                defaultValue="Administrator"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                defaultValue="admin@mam.com"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại</label>
              <input
                type="tel"
                placeholder="+84 xxx xxx xxx"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <button className="w-full py-3 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg mt-6">
              Cập nhật thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
