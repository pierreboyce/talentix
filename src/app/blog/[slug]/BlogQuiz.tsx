'use client';

import { useState } from 'react';
import type { QuizQuestion } from '../data';

interface Props {
  questions: QuizQuestion[];
}

const FONT = "var(--font-fredoka), 'Fredoka', 'Inter', sans-serif";

function scoreLabel(correct: number, total: number) {
  const pct = correct / total;
  if (pct === 1) return { emoji: '🏆', text: "Perfect score — you've got this!" };
  if (pct >= 0.75) return { emoji: '🎉', text: 'Great work. Nearly there.' };
  if (pct >= 0.5) return { emoji: '💪', text: 'Good start — worth a re-read.' };
  return { emoji: '📚', text: 'Give the article another read and try again.' };
}

export default function BlogQuiz({ questions }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [hovered, setHovered] = useState<string | null>(null);

  const totalAnswered = Object.keys(answers).length;
  const totalCorrect = Object.entries(answers).filter(
    ([qi, ai]) => questions[Number(qi)].correctIndex === Number(ai)
  ).length;
  const allDone = totalAnswered === questions.length;
  const score = scoreLabel(totalCorrect, questions.length);

  return (
    <section style={{ marginTop: '2.5rem' }} aria-label="Post quiz">
      <style dangerouslySetInnerHTML={{ __html: `
        .quiz-opt:not(:disabled):hover {
          background: #ede9fe !important;
          border-color: #c4b5fd !important;
          color: #4c1d95 !important;
        }
      `}} />

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #fde047 0%, #fbbf24 50%, #f59e0b 100%)',
        borderRadius: '18px 18px 0 0',
        padding: '16px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '6px',
      }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#111827', fontFamily: FONT }}>
          Quick quiz 🧠
        </h2>
        <span style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 700, fontFamily: FONT }}>
          {totalAnswered} / {questions.length} answered
        </span>
      </div>

      {/* Body */}
      <div style={{
        background: 'rgba(255,255,255,0.97)',
        border: '1px solid #ede9fe',
        borderTop: 'none',
        borderRadius: '0 0 18px 18px',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '26px',
      }}>
        {questions.map((q, qi) => {
          const selectedIdx = answers[qi];
          const isAnswered = selectedIdx !== undefined;

          return (
            <div key={qi}>
              {/* Question */}
              <p style={{
                margin: '0 0 12px',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#111827',
                lineHeight: 1.55,
                fontFamily: FONT,
              }}>
                {qi + 1}. {q.question}
              </p>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options.map((option, oi) => {
                  const isCorrect = q.correctIndex === oi;
                  const isSelected = selectedIdx === oi;

                  let bg = '#f9fafb';
                  let border = '#e5e7eb';
                  let color = '#374151';
                  let icon = '';

                  if (isAnswered) {
                    if (isCorrect) {
                      bg = '#dcfce7'; border = '#86efac'; color = '#166534'; icon = ' ✓';
                    } else if (isSelected) {
                      bg = '#fee2e2'; border = '#fca5a5'; color = '#991b1b'; icon = ' ✗';
                    }
                  }

                  return (
                    <button
                      key={oi}
                      className="quiz-opt"
                      onClick={() => !isAnswered && setAnswers(prev => ({ ...prev, [qi]: oi }))}
                      disabled={isAnswered}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '11px 16px',
                        borderRadius: '10px',
                        border: `1.5px solid ${border}`,
                        background: bg,
                        color: color,
                        fontSize: '0.95rem',
                        fontWeight: isAnswered && isCorrect ? 700 : 500,
                        fontFamily: FONT,
                        cursor: isAnswered ? 'default' : 'pointer',
                        lineHeight: 1.45,
                        transition: 'background 0.15s ease, border-color 0.15s ease',
                      }}
                    >
                      {option}{icon}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {isAnswered && (
                <div style={{
                  marginTop: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: selectedIdx === q.correctIndex ? '#f0fdf4' : '#fefce8',
                  border: `1px solid ${selectedIdx === q.correctIndex ? '#bbf7d0' : '#fde68a'}`,
                  fontSize: '0.88rem',
                  color: '#374151',
                  lineHeight: 1.6,
                  fontFamily: FONT,
                }}>
                  💡 {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        {/* Score */}
        {allDone && (
          <div style={{
            background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
            borderRadius: '14px',
            border: '1.5px solid #c4b5fd',
            padding: '18px 20px',
            textAlign: 'center',
          }}>
            <p style={{ margin: '0 0 6px', fontSize: '2.2rem', lineHeight: 1 }}>{score.emoji}</p>
            <p style={{ margin: '0 0 4px', fontSize: '1.35rem', fontWeight: 900, color: '#111827', fontFamily: FONT }}>
              {totalCorrect} / {questions.length} correct
            </p>
            <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem', fontFamily: FONT }}>
              {score.text}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
