import { CheckCircle, Brain } from 'lucide-react';
import styles from "./VisualStyles.module.css";
import logo from "../../../assets/logovisual.png";
import { GraduationTassel } from "./GraduationTassel";

function Visual() {
  return (
    <section className={styles.container}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-12 lg:p-16 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built for students who want to focus
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                No distractions. No overwhelming features. No bloat. Just the tools you need to study effectively and retain what matters.
              </p>

              <ul>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Upload notes → get flashcards</div>
                  </div>
                </li>
                <li className={styles.description1}>
                  Transform any document into study material in seconds
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Study with interactive cards</div>
                  </div>
                </li>

                <li className={styles.description2}>
                  Flip flashcards for recall or read smart notes for clarity
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-pink-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Test yourself with quizzes</div>
                  </div>
                </li>
                <li className={styles.description3}>
                  Practice with instant feedback on what you know
                </li>

              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">
                    Track your learning progress
                  </div>
                </div>
              </li>
              <li className={styles.description4}>
                See exactly where you are and what needs attention
              </li>

                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className=" font-semibold text-gray-900 mb-1">Stay focused with a clean design</div>
                  </div>
                </li>
                <li className={styles.description5}>
                  No ads, no clutter, no distractions
                </li>

              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 h-96 flex items-center justify-center border border-gray-100">
              <div className="text-center">
                <img className="w-80 h-33 mx-auto -mb-7 -rotate-4"
                  src={logo}
                  alt="my logo"
                />
                <p className="text-gray-400 font-medium">Clean. Simple. Effective.</p>
              </div>
              <div className={styles.thread}
              >
                <GraduationTassel />
              </div>
            </div>
          </div>
        </div>
        </div>
    </section>
  );
}

export default Visual;


