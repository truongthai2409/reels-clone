import { Home, PlaySquare, ListVideo, History, Clock } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r p-4 space-y-4">
      <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
        <Home className="w-5 h-5" />
        <span className="text-sm font-medium">Trang chủ</span>
      </div>

      <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
        <PlaySquare className="w-5 h-5" />
        <span className="text-sm font-medium">Shorts</span>
      </div>

      <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
        <ListVideo className="w-5 h-5" />
        <span className="text-sm font-medium">Kênh đăng ký</span>
      </div>

      <hr className="my-2" />

      <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
        <History className="w-5 h-5" />
        <span className="text-sm font-medium">Video đã xem</span>
      </div>

      <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
        <Clock className="w-5 h-5" />
        <span className="text-sm font-medium">Xem sau</span>
      </div>
    </div>
  );
}
