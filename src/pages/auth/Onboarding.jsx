import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const goals = ['Get internships 💼', 'Build my network 🤝', 'Develop leadership 👑', 'Earn rewards 🎁', 'Learn marketing 📣', 'Make real impact 🌍'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState([]);

  const toggleGoal = (goal) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const finish = () => {
    login({
      ...user,
      goals: selectedGoals,
      isNew: false,
      points: 50,
      streak: 1,
      badges: ['Newcomer'],
      tasksCompleted: 0,
      level: 'Bronze',
      rank: Math.floor(Math.random() * 200) + 100
    });
    navigate('/ambassador/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-violet-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg border border-indigo-100 text-center">

        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-7xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Welcome to AstralIQ,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600">
                {user?.name?.split(' ')[0]}!
              </span>
            </h2>
            <p className="text-gray-400 mb-4">You just joined the most intelligent ambassador platform ever built.</p>
            <div className="inline-block bg-indigo-50 text-indigo-600 font-bold px-5 py-2.5 rounded-full text-sm mb-8">
              🎁 +50 Welcome Points Added!
            </div>
            <br />
            <button
              onClick={() => setStep(2)}
              className="px-10 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-indigo-200"
            >
              Let's Set You Up →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">What are your goals?</h2>
            <p className="text-gray-400 text-sm mb-8">Select all that apply — your AI Coach will personalize tasks for you.</p>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {goals.map(goal => (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all ${
                    selectedGoals.includes(goal)
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(3)}
              disabled={selectedGoals.length === 0}
              className="px-10 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-40 shadow-lg shadow-indigo-200"
            >
              Continue →
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="relative inline-block mb-6">
              <div className="text-8xl animate-bounce">🏅</div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-white animate-ping" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
              You earned the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600">
                Newcomer Badge! 🎖️
              </span>
            </h2>
            <p className="text-gray-400 mb-2 text-sm">Your profile is set. Your goals are locked in. Your AI Coach is ready.</p>
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-4 mb-8 text-sm">
              <div className="font-bold text-gray-700 mb-2">Your Starting Stats</div>
              <div className="flex justify-around text-indigo-600 font-semibold">
                <div><div className="text-2xl">50</div><div className="text-xs text-gray-400">Points</div></div>
                <div><div className="text-2xl">🥉</div><div className="text-xs text-gray-400">Bronze</div></div>
                <div><div className="text-2xl">1</div><div className="text-xs text-gray-400">Day Streak</div></div>
              </div>
            </div>
            <button
              onClick={finish}
              className="px-10 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-indigo-200 text-lg"
            >
              Enter AstralIQ 🚀
            </button>
          </div>
        )}

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-10">
          {[1,2,3].map(s => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === s ? 'w-8 bg-indigo-500' : step > s ? 'w-2 bg-indigo-300' : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}