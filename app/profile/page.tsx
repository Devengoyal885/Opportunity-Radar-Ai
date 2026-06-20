'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useOpportunityStore } from '@/lib/store';
import { UserProfile, OpportunityCategory, EducationLevel, Opportunity } from '@/types';
import { User, Sparkles, Plus, X, Loader2, CheckCircle } from 'lucide-react';
import { OpportunityCard } from '@/components/dashboard/OpportunityCard';
import toast from 'react-hot-toast';

const SKILL_SUGGESTIONS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Machine Learning',
  'Deep Learning', 'Data Science', 'Computer Vision', 'NLP', 'Web Development',
  'Mobile Development', 'iOS', 'Android', 'Rust', 'Go', 'Java', 'C++',
  'Cloud (AWS/GCP/Azure)', 'DevOps', 'Blockchain', 'UI/UX Design', 'Product Management',
];

const INTEREST_SUGGESTIONS = [
  'AI/ML', 'Open Source', 'Startup', 'Research', 'Climate Tech', 'HealthTech',
  'FinTech', 'Education', 'Cybersecurity', 'Gaming', 'AR/VR', 'Web3',
  'Social Impact', 'Robotics', 'Quantum Computing', 'Space Tech',
];

const EDUCATION_LEVELS: { value: EducationLevel; label: string }[] = [
  { value: 'high-school', label: 'High School' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'graduate', label: 'Masters / Graduate' },
  { value: 'phd', label: 'PhD' },
  { value: 'bootcamp', label: 'Bootcamp Graduate' },
  { value: 'self-taught', label: 'Self-Taught' },
  { value: 'professional', label: 'Professional' },
];

const CATEGORIES: { value: OpportunityCategory; label: string; emoji: string }[] = [
  { value: 'hackathon', label: 'Hackathons', emoji: '⚡' },
  { value: 'internship', label: 'Internships', emoji: '💼' },
  { value: 'scholarship', label: 'Scholarships', emoji: '🎓' },
  { value: 'fellowship', label: 'Fellowships', emoji: '🌟' },
  { value: 'open-source', label: 'Open Source', emoji: '💻' },
  { value: 'startup', label: 'Startups', emoji: '🚀' },
  { value: 'grant', label: 'Grants', emoji: '💰' },
];

export default function ProfilePage() {
  const { userProfile, setUserProfile, setOpportunities } = useOpportunityStore();
  const [profile, setProfile] = useState<UserProfile>(
    userProfile || {
      skills: [],
      interests: [],
      educationLevel: 'undergraduate',
      careerGoals: '',
      preferredCategories: [],
      location: '',
    }
  );
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<{ opportunities: Parameters<typeof setOpportunities>[0] } | null>(null);
  const [saved, setSaved] = useState(false);

  const addSkill = (skill: string) => {
    if (!profile.skills.includes(skill)) {
      setProfile({ ...profile, skills: [...profile.skills, skill] });
    }
    setSkillInput('');
  };

  const addInterest = (interest: string) => {
    if (!profile.interests.includes(interest)) {
      setProfile({ ...profile, interests: [...profile.interests, interest] });
    }
    setInterestInput('');
  };

  const removeSkill = (s: string) => setProfile({ ...profile, skills: profile.skills.filter((x) => x !== s) });
  const removeInterest = (i: string) => setProfile({ ...profile, interests: profile.interests.filter((x) => x !== i) });

  const toggleCategory = (cat: OpportunityCategory) => {
    const next = profile.preferredCategories.includes(cat)
      ? profile.preferredCategories.filter((c) => c !== cat)
      : [...profile.preferredCategories, cat];
    setProfile({ ...profile, preferredCategories: next });
  };

  const handleSave = () => {
    setUserProfile(profile);
    setSaved(true);
    toast.success('✅ Profile saved!');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleFindMatches = async () => {
    setUserProfile(profile);
    setIsMatching(true);
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });
      const data = await res.json();
      setMatchResult(data);
      setOpportunities(data.opportunities);
      toast.success(`🎯 Found ${data.topMatches?.length || 0} top matches for you!`);
    } catch {
      toast.error('AI matching failed. Please try again.');
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="orb orb-purple" />
      <Sidebar />

      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <Header title="My Profile" subtitle="Configure your profile for AI-powered opportunity matching" />

        <main style={{ padding: '32px', maxWidth: '900px' }}>
          {/* Profile header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #6366F1, #22D3EE)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={28} color="white" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>
                Profile Setup
              </h2>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
                The more you tell us, the better we can match you
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Education Level */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Education Level
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {EDUCATION_LEVELS.map((lvl) => (
                  <motion.button
                    key={lvl.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfile({ ...profile, educationLevel: lvl.value })}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor:
                        profile.educationLevel === lvl.value
                          ? 'rgba(99,102,241,0.6)'
                          : 'rgba(255,255,255,0.08)',
                      background:
                        profile.educationLevel === lvl.value
                          ? 'rgba(99,102,241,0.2)'
                          : 'transparent',
                      color:
                        profile.educationLevel === lvl.value
                          ? '#818CF8'
                          : 'var(--text-muted)',
                    }}
                  >
                    {lvl.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Skills
              </h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Add a skill (e.g., Python, React)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && skillInput.trim()) addSkill(skillInput.trim()); }}
                  className="input-field"
                />
                <button
                  onClick={() => skillInput.trim() && addSkill(skillInput.trim())}
                  className="btn-primary"
                  style={{ flexShrink: 0 }}
                >
                  <Plus size={14} />
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {profile.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: 'rgba(99,102,241,0.15)',
                      color: '#818CF8',
                      border: '1px solid rgba(99,102,241,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                    }}
                    onClick={() => removeSkill(skill)}
                  >
                    {skill} <X size={10} />
                  </motion.span>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Suggestions:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {SKILL_SUGGESTIONS.filter((s) => !profile.skills.includes(s)).slice(0, 12).map((s) => (
                  <button
                    key={s}
                    onClick={() => addSkill(s)}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Interests
              </h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Add an interest (e.g., AI, Open Source)"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && interestInput.trim()) addInterest(interestInput.trim()); }}
                  className="input-field"
                />
                <button onClick={() => interestInput.trim() && addInterest(interestInput.trim())} className="btn-primary" style={{ flexShrink: 0 }}>
                  <Plus size={14} />
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {profile.interests.map((interest) => (
                  <motion.span
                    key={interest}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: 'rgba(34,211,238,0.12)',
                      color: '#22D3EE',
                      border: '1px solid rgba(34,211,238,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                    }}
                    onClick={() => removeInterest(interest)}
                  >
                    {interest} <X size={10} />
                  </motion.span>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {INTEREST_SUGGESTIONS.filter((s) => !profile.interests.includes(s)).map((s) => (
                  <button
                    key={s}
                    onClick={() => addInterest(s)}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Career Goals */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Career Goals
              </h3>
              <textarea
                rows={4}
                placeholder="Describe your career goals, e.g., 'I want to become an ML engineer at a top tech company. I'm interested in computer vision and NLP research...'"
                value={profile.careerGoals}
                onChange={(e) => setProfile({ ...profile, careerGoals: e.target.value })}
                className="input-field"
                style={{ resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>

            {/* Preferred Categories */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Preferred Opportunity Types
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {CATEGORIES.map((cat) => {
                  const active = profile.preferredCategories.includes(cat.value);
                  return (
                    <motion.button
                      key={cat.value}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleCategory(cat.value)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: active ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.08)',
                        background: active ? 'rgba(99,102,241,0.2)' : 'transparent',
                        color: active ? '#818CF8' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {cat.emoji} {cat.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                {saved ? <CheckCircle size={16} color="#4ADE80" /> : null}
                {saved ? 'Saved!' : 'Save Profile'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFindMatches}
                disabled={isMatching || (profile.skills.length === 0 && profile.interests.length === 0)}
                className="btn-primary"
                style={{ flex: 2 }}
              >
                {isMatching ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    AI Matching...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Find My Matches
                  </>
                )}
              </motion.button>
            </div>

            {/* Match results preview */}
            {matchResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  🎯 Your Top Matches
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                  {matchResult.opportunities.slice(0, 6).map((opp: Opportunity) => (
                    <OpportunityCard key={opp.id} opportunity={opp} showMatchScore />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
