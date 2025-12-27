import React from 'react';
import styles from "./WorkStyles.module.css";

function Work() {
  return (
<section id='work' className={styles.container}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-5 text-gray-900">
              How StudyPal works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps. No complexity.
            </p>
          </div>

          <div className="grid gap-12">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mb-6 mx-auto shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Upload Notes</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Drop a PDF or paste your notes. StudyPal reads it and gets ready to help you study.
              </p>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mb-6 mx-auto shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Study & Practice</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Study with flashcards and smart notes, take quizzes, and learn at your own pace. Mark what you know, review what you don't.
              </p>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-pink-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mb-6 mx-auto shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Track Progress</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                See what you've studied and what needs work. Stay motivated with simple, clear progress tracking.
              </p>
            </div>
          </div>
        </div>
</section>
  );
}

export default Work;
