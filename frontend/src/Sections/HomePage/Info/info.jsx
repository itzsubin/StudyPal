import styles from "./infoStyles.module.css";
import { BookOpen, Brain, Clock, CopyCheck, FileText, Focus, Notebook, NotebookPen, NotebookText, NotebookTextIcon, TrendingUp, Upload } from 'lucide-react';
import CardSwap, { Card } from '../../Common/CardSwap';

function Info() {
  return (
    <section id='info' className={styles.container}>
      <div className="max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          {/* Left Column: Text Content */}
          <div className="text-left space-y-8 pl-4 lg:pl-0 z-10 lg:order-first">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-tight drop-shadow-sm">
              Study smarter,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 animate-gradient">
                not harder.
              </span>
            </h2>
            <p className="text-xl font-bold md:text-2xl text-gray-600 max-w-lg leading-relaxed">
              Everything you need to ace your exams in one place. Transform your notes into interactive study materials instantly.
            </p>

          </div>
          <div className="relative h-[650px] w-full flex items-center justify-center right-[40px]">
            <div className="absolute top-1/2 pr-20 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-blue-200/50 to-purple-200/50 rounded-full blur-3xl -z-10"></div>

            <CardSwap
              width={500}
              height={460}
              cardDistance={40}
              verticalDistance={60}
              skewAmount={6}
              delay={3000}
              easing="elastic"
              pauseOnHover={true}
            >
              {[
                {
                  id: 1,
                  gradient: "from-blue-50 to-blue-100",
                  iconBg: "bg-blue-600",
                  iconText: "text-blue-600",
                  Icon: Upload,
                  title: "Create or Import",
                  desc: "Upload notes or PDFs and turn them into study material instantly.",
                  points: ["PDF upload or paste text", "Automatic flashcard generation", "Clean, structured output"]
                },
                {
                  id: 2,
                  gradient: "from-purple-50 to-purple-100",
                  iconBg: "bg-purple-600",
                  iconText: "text-purple-600",
                  Icon: BookOpen,
                  title: "Flashcard Mode",
                  desc: "Learn with interactive flashcards designed for focus.",
                  points: ["Flip to recall", "Know or review later", "See your progress"]
                },
                {
                  id: 3,
                  gradient: "from-pink-50 to-pink-100",
                  iconBg: "bg-pink-600",
                  iconText: "text-pink-600",
                  Icon: Brain,
                  title: "Smart Quizzes",
                  desc: "Test your understanding with quizzes generated from your notes.",
                  points: ["Multiple choice", "Instant feedback", "Review incorrect answers"]
                },
                {
                  id: 4,
                  gradient: "from-indigo-50 to-cyan-200",
                  iconBg: "bg-cyan-500",
                  iconText: "text-cyan-500",
                  Icon: NotebookText,
                  title: "Smart Notes",
                  desc: "Perfect for understanding before memorizing.",
                  points: ["Summarized key ideas", "Important concepts emphasized", "Easy revision before exams"]
                },
                {
                  id: 5,
                  gradient: "from-teal-50 to-teal-100",
                  iconBg: "bg-teal-600",
                  iconText: "text-teal-600",
                  Icon: TrendingUp,
                  title: "Track & Achieve",
                  desc: "See what you've studied and what needs more practice.",
                  points: ["What you've Studied", "What needs review", "Study streaks"]
                },
                {
                  id: 6,
                  gradient: "from-orange-50 to-orange-100",
                  iconBg: "bg-orange-600",
                  iconText: "text-orange-600",
                  Icon: Clock,
                  title: "Time-Based Sessions",
                  desc: "Study in focused sessions that fit your schedule.",
                  points: ["10, 20, or 40-minute sessions", "Stay focused and productive", "Built-in break reminders"]
                }
              ].map((card, index) => (
                <Card key={card.id} customClass={`bg-gradient-to-br ${card.gradient} p-8 rounded-3xl shadow-xl border-radius-rounded w-full h-full border-none`}>
                  <div className={`absolute -top-4 -left-4 w-12 h-12 ${card.iconBg} text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg`}>
                    {card.id}
                  </div>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
                    <card.Icon className={`w-8 h-8 ${card.iconText}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{card.title}</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                    {card.desc}
                  </p>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    {card.points.map((point, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <div className={`w-1.5 h-1.5 ${card.iconBg} rounded-full`}></div>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Info;