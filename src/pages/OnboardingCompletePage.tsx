import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Play,
  FileText,
  GraduationCap,
  Check,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useDomains } from "../hooks/useDomains";

export default function OnboardingCompletePage() {
  const { user } = useAuth();
  const { domains } = useDomains();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const userDomains = domains.filter((d) => user?.interests.includes(d.name));

  const features = [
    {
      icon: Play,
      label: "AI-Curated Videos",
      desc: "Personalized for your interests",
      color: "#10B981",
    },
    {
      icon: BookOpen,
      label: "Smart Courses",
      desc: `Tailored for ${user?.branch || "your branch"}`,
      color: "#14B8A6",
    },
    {
      icon: FileText,
      label: "Notes & PYQs",
      desc: `Year ${user?.year || 1} materials`,
      color: "#F59E0B",
    },
  ];

  return (
    <div className="min-h-screen bg-[rgb(var(--bg-base))] flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[rgb(var(--color-primary))] opacity-[0.03] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[rgb(var(--color-accent))] opacity-[0.03] blur-3xl" />
      </div>

      <div
        className={`w-full max-w-lg relative transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center w-16 h-16 bg-[rgb(var(--color-primary))] mb-4">
            <Check className="w-8 h-8 text-white" strokeWidth={2.5} />
            <div className="absolute inset-0 bg-[rgb(var(--color-primary))] animate-ping opacity-20" />
          </div>
          <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))] tracking-tight">
            You're all set, {user?.name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-sm text-[rgb(var(--text-secondary))] mt-1">
            Your personalized learning experience is ready
          </p>
        </div>

        {/* Profile Summary Card */}
        <div className="border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] p-5 mb-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[rgb(var(--color-primary))] flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[rgb(var(--text-primary))] truncate">
                {user?.name}
              </p>
              <p className="text-[10px] text-[rgb(var(--text-tertiary))] uppercase tracking-wider">
                {user?.branch || "Student"} · Year {user?.year || 1}
              </p>
            </div>
          </div>

          {/* Selected Interests */}
          {userDomains.length > 0 && (
            <div>
              <p className="text-[10px] text-[rgb(var(--text-secondary))] uppercase tracking-wider font-semibold mb-2">
                Your Interests
              </p>
              <div className="flex flex-wrap gap-1.5">
                {userDomains.map((domain) => (
                  <span
                    key={domain.id}
                    className="px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider"
                    style={{
                      borderColor: `${domain.color}40`,
                      color: domain.color,
                      backgroundColor: `${domain.color}08`,
                    }}
                  >
                    {domain.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* What's Next */}
        <div className="border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles
              className="w-3.5 h-3.5 text-[rgb(var(--color-primary))]"
              strokeWidth={2}
            />
            <h2 className="text-xs font-bold text-[rgb(var(--text-primary))] tracking-tight">
              What's waiting for you
            </h2>
          </div>
          <div className="space-y-2.5">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 p-2.5 bg-[rgb(var(--bg-base))] border border-[rgb(var(--border-secondary))]"
              >
                <div
                  className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${f.color}15` }}
                >
                  <f.icon
                    className="w-4 h-4"
                    style={{ color: f.color }}
                    strokeWidth={2}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[rgb(var(--text-primary))]">
                    {f.label}
                  </p>
                  <p className="text-[10px] text-[rgb(var(--text-tertiary))]">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/")}
          className="w-full py-3 bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
        >
          Start Learning
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </button>

        <div className="mt-4 text-center">
          <p className="text-[9px] text-[rgb(var(--text-tertiary))] uppercase tracking-wider font-medium">
            Powered by AI · College Core
          </p>
        </div>
      </div>
    </div>
  );
}
