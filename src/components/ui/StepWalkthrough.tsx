'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Step } from '@/data/system-details';
import { ChevronLeft, ChevronRight, Play, RotateCcw } from 'lucide-react';

interface StepWalkthroughProps {
  steps: Step[];
  onStepChange?: (step: Step) => void;
}

export function StepWalkthrough({ steps, onStepChange }: StepWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const goToStep = (index: number) => {
    setCurrentStep(index);
    onStepChange?.(steps[index]);
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const reset = () => {
    goToStep(0);
  };

  const step = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => goToStep(i)}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              backgroundColor: i === currentStep ? 'var(--accent)' : i < currentStep ? 'var(--accent-light)' : 'var(--surface)',
              color: i === currentStep ? '#ffffff' : i < currentStep ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${i === currentStep ? 'var(--accent)' : 'var(--border)'}`,
            }}
            aria-label={`Go to step ${s.number}`}
            aria-current={i === currentStep ? 'step' : undefined}
          >
            <span className="font-bold">{s.number}</span>
            <span className="hidden sm:inline">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Current step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl p-6"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#ffffff',
              }}
            >
              {step.number}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>
                {step.title}
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {step.description}
              </p>
              {step.highlightNodes.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {step.highlightNodes.map((node) => (
                    <span
                      key={node}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono"
                      style={{
                        backgroundColor: 'var(--accent-light)',
                        color: 'var(--accent)',
                      }}
                    >
                      {node}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={reset}
          disabled={currentStep === 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all disabled:opacity-30"
          style={{ color: 'var(--muted)' }}
          aria-label="Reset to first step"
        >
          <RotateCcw size={14} />
          Reset
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            disabled={currentStep === 0}
            className="p-2 rounded-lg transition-all disabled:opacity-30"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
            aria-label="Previous step"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-sm font-mono px-3" style={{ color: 'var(--muted)' }}>
            {currentStep + 1} / {steps.length}
          </span>

          <button
            onClick={next}
            disabled={currentStep === steps.length - 1}
            className="p-2 rounded-lg transition-all disabled:opacity-30"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#ffffff',
            }}
            aria-label="Next step"
          >
            {currentStep === steps.length - 1 ? (
              <Play size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
