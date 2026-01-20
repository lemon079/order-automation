'use client';

import { useState, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@repo/ui';
import { Button } from '@repo/ui';
import { WorkflowStepper, Step } from './workflow-stepper';
import { Progress } from '@repo/ui';
import { CheckCircle2, XCircle, Loader2, Sparkles } from 'lucide-react';

interface Order {
    id: string;
    customer: string;
    items: number;
    total: number;
    address: string;
}

interface OrderResolutionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orders: Order[];
}

const workflowSteps: Step[] = [
    { id: 'resolving', label: 'Resolving Orders', description: 'Analyzing order requirements...' },
    { id: 'warehouse', label: 'Checking Warehouse', description: 'Verifying inventory availability...' },
    { id: 'driver', label: 'Assigning Driver', description: 'Finding the best available driver...' },
    { id: 'dispatched', label: 'Order Dispatched', description: 'Order is on the way!' },
];

type WorkflowStatus = 'idle' | 'running' | 'completed' | 'error';

interface StepResult {
    step: string;
    message: string;
    timestamp: string;
}

export function OrderResolutionModal({
    open,
    onOpenChange,
    orders
}: OrderResolutionModalProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [status, setStatus] = useState<WorkflowStatus>('idle');
    const [stepResults, setStepResults] = useState<StepResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const progress = status === 'completed'
        ? 100
        : status === 'idle'
            ? 0
            : ((currentStepIndex + 1) / workflowSteps.length) * 100;

    const startResolution = useCallback(async () => {
        if (orders.length === 0) return;

        setIsProcessing(true);
        setStatus('running');
        setError(null);
        setStepResults([]);

        try {
            // Process first pending order
            const order = orders[0];

            const response = await fetch('/api/orders/resolve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: order.id,
                    orderDetails: {
                        customer: order.customer,
                        items: order.items,
                        total: order.total,
                        address: order.address,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to resolve order');
            }

            const data = await response.json();

            // Simulate step-by-step progress for UI
            for (let i = 0; i < workflowSteps.length; i++) {
                setCurrentStepIndex(i);

                // Wait a bit to show the animation
                await new Promise(resolve => setTimeout(resolve, 800));

                // Add step result if available
                const stepMessage = data.stepMessages?.find(
                    (m: StepResult) => m.step === workflowSteps[i].id ||
                        m.step === 'resolving' && i === 0 ||
                        m.step === 'checking_warehouse' && i === 1 ||
                        m.step === 'assigning_driver' && i === 2 ||
                        m.step === 'completed' && i === 3
                );

                if (stepMessage) {
                    setStepResults(prev => [...prev, stepMessage]);
                }
            }

            setStatus('completed');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setStatus('error');
        } finally {
            setIsProcessing(false);
        }
    }, [orders]);

    const resetModal = useCallback(() => {
        setCurrentStepIndex(-1);
        setStatus('idle');
        setStepResults([]);
        setError(null);
        setIsProcessing(false);
    }, []);

    const handleClose = useCallback(() => {
        resetModal();
        onOpenChange(false);
    }, [onOpenChange, resetModal]);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        AI Order Resolution
                    </DialogTitle>
                    <DialogDescription>
                        {status === 'idle' && `Resolve ${orders.length} pending order${orders.length !== 1 ? 's' : ''} automatically using AI`}
                        {status === 'running' && 'Processing your orders with AI automation...'}
                        {status === 'completed' && 'All orders have been successfully processed!'}
                        {status === 'error' && 'An error occurred during processing.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {/* Progress bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>

                    {/* Stepper */}
                    <WorkflowStepper
                        steps={workflowSteps.map((step, index) => ({
                            ...step,
                            description: stepResults.find(r =>
                                (r.step === 'resolving' && index === 0) ||
                                (r.step === 'checking_warehouse' && index === 1) ||
                                (r.step === 'assigning_driver' && index === 2) ||
                                (r.step === 'completed' && index === 3)
                            )?.message || step.description,
                        }))}
                        currentStepIndex={currentStepIndex}
                        status={status}
                    />

                    {/* Error message */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                            <XCircle className="h-5 w-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {/* Success message */}
                    {status === 'completed' && (
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                            <span className="text-sm">Order successfully dispatched! Driver is on the way.</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    {status === 'idle' && (
                        <>
                            <Button variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button onClick={startResolution} disabled={orders.length === 0}>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Start AI Resolution
                            </Button>
                        </>
                    )}

                    {status === 'running' && (
                        <Button disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </Button>
                    )}

                    {(status === 'completed' || status === 'error') && (
                        <>
                            <Button variant="outline" onClick={resetModal}>
                                Process Another
                            </Button>
                            <Button onClick={handleClose}>
                                Done
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
