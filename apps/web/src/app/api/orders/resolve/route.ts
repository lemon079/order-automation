import { NextRequest, NextResponse } from 'next/server';
import { executeOrderResolution } from '@/lib/langgraph';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, orderDetails } = body;

        if (!orderId || !orderDetails) {
            return NextResponse.json(
                { error: 'Missing orderId or orderDetails' },
                { status: 400 }
            );
        }

        // Execute the LangGraph workflow
        const result = await executeOrderResolution(orderId, orderDetails);

        // Check for errors in the workflow
        if (result.error) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error,
                    stepMessages: result.stepMessages
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            orderId: result.orderId,
            currentStep: result.currentStep,
            stepMessages: result.stepMessages,
            warehouseResult: result.warehouseResult,
            driverResult: result.driverResult,
            dispatchConfirmed: result.dispatchConfirmed,
            estimatedDeliveryTime: result.estimatedDeliveryTime,
        });
    } catch (error) {
        console.error('Order resolution error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error'
            },
            { status: 500 }
        );
    }
}
