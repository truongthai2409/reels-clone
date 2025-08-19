import React, { useState, useEffect, useRef } from "react";
import {
  Share2,
  MessageCircle,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Music2,
  ChevronUp,
  ChevronDown,
  Fullscreen,
  Volume2,
  Pause,
} from "lucide-react";
import Sidebar from "../../ui/sidebar";

const shortsData = [
  {
    id: 1,
    title: "Frontend Dev Tips 💻",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 123,
    comments: 45,
    shares: 12,
  },
  {
    id: 2,
    title: "React Animation 🔥",
    video: "https://www.w3schools.com/html/movie.mp4",
    likes: 432,
    comments: 67,
    shares: 20,
  },
  {
    id: 3,
    title: "UI Inspiration ✨",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 256,
    comments: 31,
    shares: 8,
  },
  {
    id: 4,
    title: "React Animation 🔥",
    video: "https://www.w3schools.com/html/movie.mp4",
    likes: 432,
    comments: 67,
    shares: 20,
  },
];


const Home: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [, setDirection] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Handle scroll to update current video index
  useEffect(() => {
    const handleScroll = () => {
      if (sliderRef.current) {
        const scrollTop = sliderRef.current.scrollTop;
        const videoHeight = sliderRef.current.clientHeight;
        const newIndex = Math.round(scrollTop / videoHeight);
        if (newIndex !== current && newIndex >= 0 && newIndex < shortsData.length) {
          setCurrent(newIndex);
        }
      }
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', handleScroll);
      return () => slider.removeEventListener('scroll', handleScroll);
    }
  }, [current]);

  const nextVideo = () => {
    if (current < shortsData.length - 1) {
      setDirection(1);
      setCurrent((prev) => prev + 1);
      // Scroll to the next video
      if (sliderRef.current) {
        const nextScrollTop = (current + 1) * sliderRef.current.clientHeight;
        sliderRef.current.scrollTo({ top: nextScrollTop, behavior: 'smooth' });
      }
    }
  };

  const prevVideo = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent((prev) => prev - 1);
      // Scroll to the previous video
      if (sliderRef.current) {
        const prevScrollTop = (current - 1) * sliderRef.current.clientHeight;
        sliderRef.current.scrollTo({ top: prevScrollTop, behavior: 'smooth' });
      }
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  // Handle key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key || event.code) {
        case "ArrowUp":
          prevVideo();
          break;
        case "ArrowDown":
          nextVideo();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "m":
        case "M":
          toggleMute();
          break;
        case " ":
        case "32":
          togglePlayPause();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [current]);

  // Touch swipe handlers (mobile)


  return (
    <>
      <div className="flex min-h-screen bg-white">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 relative">
          {/* Vertical slider container with scroll-snap */}
          <div 
            ref={sliderRef}
            className="h-screen overflow-y-auto scroll-smooth scrollbar-hide"
            style={{ scrollSnapType: 'y mandatory' }}
          >
            {shortsData.map((short, index) => (
              <div
                key={short.id}
                className="h-screen flex justify-center items-center relative"
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Center video card */}
                <div className="relative w-full max-w-[380px] md:w-[330px] h-full md:h-[90vh] md:rounded-xl overflow-hidden bg-black shadow-xl">
                  <video
                    ref={index === current ? videoRef : null}
                    src={short.video}
                    className="w-full h-full object-cover"
                    loop
                    autoPlay={index === current}
                    muted
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80" />
                  <div className="absolute top-3 left-3">
                    <div
                      onClick={togglePlayPause}
                      className="bg-white/30 backdrop-blur-sm rounded-full p-3 hover:bg-gray-200 transition-colors"
                    >
                      <Pause className="h-6 w-6 text-white/80" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-20">
                    <div
                      onClick={toggleMute}
                      className="bg-white/30 backdrop-blur-sm rounded-full p-3 hover:bg-gray-200 transition-colors"
                    >
                      <Volume2 className="h-6 w-6 text-white/80" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-20">
                    <div
                      onClick={toggleFullscreen}
                      className="bg-white/30 backdrop-blur-sm rounded-full p-3 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <Fullscreen className="h-6 w-6 text-white/80" />
                    </div>
                  </div>
                  <div className="absolute bottom-5 left-4 right-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-white/20" />
                      <span className="text-white text-sm font-medium">
                        @HilariousRemixLand
                      </span>
                      <button className="ml-2 px-3 py-1 rounded-full bg-white text-black text-xs font-semibold">
                        Đăng ký
                      </button>
                    </div>
                    <p className="text-white text-sm leading-5 line-clamp-2">
                      {short.title} #cocktail #bar
                    </p>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex flex-col items-center gap-5 text-gray-800 *:md:ml-6 md:relative md:mt-30 absolute right-2 bottom-20 ">
                  <button className="p-3 rounded-full hover:bg-gray-200 bg-gray-100">
                    <MoreVertical className="h-6 w-6" />
                  </button>

                  <button className="flex flex-col items-center p-2">
                    <div className="bg-gray-100 rounded-full p-3 hover:bg-gray-200 transition-colors">
                      <ThumbsUp className="h-6 w-6"/>
                    </div>
                    <span className="text-xs text-white md:text-black mt-2">
                      {short.likes}
                    </span>
                  </button>

                  <button className="flex flex-col items-center">
                    <div className="bg-gray-100 rounded-full p-3 hover:bg-gray-200 transition-colors">
                      <ThumbsDown className="h-6 w-6" />
                    </div>
                    <span className="text-xs text-white md:text-black mt-1">Không…</span>
                  </button>

                  <button className="flex flex-col items-center">
                    <div className="bg-gray-100 rounded-full p-3 hover:bg-gray-200 transition-colors">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <span className="text-xs mt-1 text-white md:text-black">
                      {short.comments}
                    </span>
                  </button>

                  <button className="flex flex-col items-center">
                    <div className="bg-gray-100 rounded-full p-3 hover:bg-gray-200 transition-colors">
                      <Share2 className="h-6 w-6" />
                    </div>
                    <span className="text-xs mt-1 text-white md:text-black">Chia sẻ</span>
                  </button>

                  <button className="flex flex-col items-center">
                    <div className="bg-gray-100 rounded-full p-3 hover:bg-gray-200 transition-colors">
                      <Music2 className="h-6 w-6" />
                    </div>
                    <span className="text-xs mt-1 text-white md:text-black">5</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation (hidden on mobile) */}
          <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col items-center gap-4">
            <button
              onClick={prevVideo}
              disabled={current === 0}
              className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
            <button
              onClick={nextVideo}
              disabled={current === shortsData.length - 1}
              className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;