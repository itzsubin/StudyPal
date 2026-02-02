import styles from "./infoStyles.module.css";
import { BookOpen, Brain, Clock, CopyCheck, FileText, Focus, Notebook, NotebookPen, NotebookText, NotebookTextIcon, TrendingUp, Upload } from 'lucide-react';

function Info() {
  return (
    <section id='info' className={styles.container}>
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16 md:mb-20 lg:mb-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 md:mb-8 text-gray-900">
            Study smarter, not harder
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to ace your exams in one place
          </p>
        </div>


        <div className="grid md:grid-cols-3 gap-10 md:gap-12 lg:gap-14">

          <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 p-8 md:p-10 rounded-3xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
              1
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-md">
              <Upload className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-5 text-gray-900">Create or Import</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Upload notes or PDFs and turn them into study material instantly.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <span>PDF upload or paste text</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <span>Automatic flashcard generation</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <span>Clean, structured output</span>
              </li>
            </ul>
          </div>

          <div className="relative bg-gradient-to-br from-purple-50 to-purple-100 p-8 md:p-10 rounded-3xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
              2
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-md">
              <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-5 text-gray-900">Flashcard Mode</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Learn with interactive flashcards designed for focus.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                <span>Flip to recall</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                <span>Know or review later</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                <span>See your progress</span>
              </li>
            </ul>
          </div>

          <div className="relative bg-gradient-to-br from-pink-50 to-pink-100 p-8 md:p-10 rounded-3xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-pink-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
              3
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-md">
              <Brain className="w-8 h-8 md:w-10 md:h-10 text-pink-600" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-5 text-gray-900">Smart Quizzes</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Test your understanding with quizzes generated from your notes.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
                <span>Multiple choice</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
                <span>Instant feedback</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
                <span>Review incorrect answers</span>
              </li>
            </ul>
          </div>

          <div className="relative bg-gradient-to-br from-indigo-50 to-cyan-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-cyan-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
              4
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-md">
              <NotebookText className="w-8 h-8 md:w-10 md:h-10 text-cyan-500" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-5 text-gray-900"> Smart Notes </h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Perfect for understanding before memorizing.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                <span>Summarized key ideas from your material</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                <span>Important concepts emphasized</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                <span>Easy revision before exams</span>
              </li>
            </ul>
          </div>

          <div className="relative bg-gradient-to-br from-teal-50 to-teal-100 p-8 md:p-10 rounded-3xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-teal-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
              5
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-md">
              <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-teal-600" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-5 text-gray-900">Track & Achieve</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              See what you've studied and what needs more practice.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                <span>What you've Studied</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                <span>What needs review</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                <span>Study streaks</span>
              </li>
            </ul>
          </div>

          <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
              6
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-md">
              <Clock className="w-8 h-8 md:w-10 md:h-10 text-orange-600" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-5 text-gray-900">Time-Based Sessions</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Study in focused sessions that fit your schedule.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                <span>10, 20, or 40-minute sessions</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                <span>Stay focused and productive</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                <span>Built-in break reminders</span>
              </li>
            </ul>

          </div>

        </div>
      </div>
    </section>
  );
}

export default Info;