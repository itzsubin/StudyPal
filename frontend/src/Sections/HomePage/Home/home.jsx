import styles from "./HomeStyles.module.css";
import A from "../../../assets/A.png";
import arrow from "../../../assets/arrow.png";
import { Brain, Target, TrendingUp, Users } from 'lucide-react';

function Home() {
  return (
    <section id='home' className={styles.container}>
      <div className={styles.grade}>
        <img
          src={A}
          alt="Grade decoration"
          className={styles.A}
        />
      </div>

      <div className="relative z-10 text-center">
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
          <button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
            <span>Start with StudyPal</span>
          </button>
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