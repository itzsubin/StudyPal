import { useRef } from 'react';
import styles from "./HomeStyles.module.css";
import A from "../../../assets/A.png";
import arrow from "../../../assets/arrow.png";
import { Brain, Target, TrendingUp, Users } from 'lucide-react';

function Home({ onStartClick, user }) {
  const containerRef = useRef(null);
  const aRef = useRef(null);
  const arrowRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current || !aRef.current || !arrowRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;


    aRef.current.style.transform = `perspective(1000px) rotateY(${x * 30 + 45}deg) rotateX(${-y * 30}deg)`;


    arrowRef.current.style.transform = `translate(${x * -50}px, ${y * -50}px) rotateZ(30deg) rotateY(190deg) rotateX(70deg)`;
  };

  return (
    <section id='home' className={styles.container} ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={() => {
      if (aRef.current) aRef.current.style.transform = `perspective(1000px) rotateY(45deg) rotateX(0deg)`;
      if (arrowRef.current) arrowRef.current.style.transform = `rotateZ(30deg) rotateY(190deg) rotateX(70deg)`;
    }}>
      <div className={styles.grade}>
        <img
          ref={aRef}
          src={A}
          alt="Grade decoration"
          className={styles.A}
          style={{ transition: 'transform 0.1s ease-out' }}
        />
      </div>

      <div className="relative z-10 text-center">
        {/* ... rest of your content ... */}
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-sm mb-8 md:mb-10 lg:mb-12">
          <span className="text-m font-bold text-gray-700">
            AI assists. The student decides.
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 md:mb-10 lg:mb-12 leading-tight text-gray-900">
          Your AI-powered
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            study companion
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-12 md:mb-14 lg:mb-16 max-w-3xl mx-auto leading-relaxed font-semibold">
          Upload your notes. Get flashcards. Study. Test yourself. Track progress. That's it.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-14 lg:mb-16">
          {!user && (
            <button
              onClick={onStartClick}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Start with StudyPal</span>
            </button>
          )}
          <button className="bg-white border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-xl text-lg font-bold hover:border-blue-600 hover:text-blue-600 hover:shadow-md transition-all duration-300">
            Begin your study plan
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-3.5 md:gap-4 max-w-4xl mx-auto">
          <div className="bg-white px-5 py-3 rounded-full shadow-md flex items-center space-x-2 hover:shadow-lg transition-shadow duration-300">
            <Brain className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-700 text-[15px]">AI-Powered</span>
          </div>

          <div className="bg-white px-5 py-3 rounded-full shadow-md flex items-center space-x-2 hover:shadow-lg transition-shadow duration-300">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-700 text-[15px]">Adaptive Learning</span>
          </div>

          <div className="bg-white px-5 py-3 rounded-full shadow-md flex items-center space-x-2 hover:shadow-lg transition-shadow duration-300">
            <Users className="w-5 h-5 text-pink-600" />
            <span className="font-semibold text-gray-700 text-[15px]">Collaborative</span>
          </div>

          <div className="bg-white px-5 py-3 rounded-full shadow-md flex items-center space-x-2 hover:shadow-lg transition-shadow duration-300">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-700 text-[15px]">Track Progress</span>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Home;