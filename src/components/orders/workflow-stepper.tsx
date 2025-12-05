'use client';

import { cn } from '@/lib/utils';
import { Check, Loader2, AlertCircle, Circle } from 'lucide-react';

export interface Step {
    id: string;
    label: string;
    description?: string;
}

interface WorkflowStepperProps {
    steps: Step[];
    currentStepIndex: number;
    status: 'idle' | 'running' | 'completed' | 'error';
    className?: string;
}

export function WorkflowStepper({
    steps,
    currentStepIndex,
    status,
    className
}: WorkflowStepperProps) {
    return (
        <div className={cn('space-y-4', className)}>
            {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isPending = index > currentStepIndex;
                const isError = isCurrent && status === 'error';

                return (
                    <div key={step.id} className="flex items-start gap-4">
                        {/* Step indicator */}
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                                    isCompleted && 'border-green-500 bg-green-500 text-white',
                                    isCurrent && !isError && 'border-blue-500 bg-blue-500 text-white',
                                    isCurrent && isError && 'border-red-500 bg-red-500 text-white',
                                    isPending && 'border-muted-foreground/30 text-muted-foreground/50'
                                )}
                            >
                                {isCompleted && <Check className="h-5 w-5" />}
                                {isCurrent && status === 'running' && (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                )}
                                {isCurrent && status === 'completed' && <Check className="h-5 w-5" />}
                                {isCurrent && status === 'error' && <AlertCircle className="h-5 w-5" />}
                                {isCurrent && status === 'idle' && <Circle className="h-5 w-5" />}
                                {isPending && <span className="text-sm font-medium">{index + 1}</span>}
                            </div>

                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        'mt-2 h-8 w-0.5 transition-all duration-300',
                                        isCompleted ? 'bg-green-500' : 'bg-muted-foreground/20'
                                    )}
                                />
                            )}
                        </div>

                        {/* Step content */}
                        <div className="flex-1 pt-1">
                            <h4
                                className={cn(
                                    'font-semibold transition-colors',
                                    isCompleted && 'text-green-600 dark:text-green-400',
                                    isCurrent && !isError && 'text-blue-600 dark:text-blue-400',
                                    isCurrent && isError && 'text-red-600 dark:text-red-400',
                                    isPending && 'text-muted-foreground/60'
                                )}
                            >
                                {step.label}
                            </h4>
                            {step.description && (
                                <p className={cn(
                                    'mt-1 text-sm',
                                    isPending ? 'text-muted-foreground/40' : 'text-muted-foreground'
                                )}>
                                    {step.description}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
