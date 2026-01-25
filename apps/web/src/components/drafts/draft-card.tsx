'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, Badge, Button, Separator } from '@repo/ui';
import { OrderDraft } from '@repo/shared';
import { Phone, MessageCircle, MapPin, Flag, Package, ArrowRight } from 'lucide-react';
import { ReviewDialog } from './review-dialog';
import { formatDistanceToNow } from 'date-fns';

interface DraftCardProps {
    draft: OrderDraft;
}

export function DraftCard({ draft }: DraftCardProps) {
    const [reviewOpen, setReviewOpen] = useState(false);

    const SourceIcon = draft.source === 'whatsapp' ? MessageCircle : Phone;

    // Determine confidence badge color
    let confidenceColor = "bg-red-100 text-red-700 border-red-200";
    if (draft.confidence_score > 0.8) confidenceColor = "bg-green-100 text-green-700 border-green-200";
    else if (draft.confidence_score > 0.5) confidenceColor = "bg-yellow-100 text-yellow-700 border-yellow-200";

    const customerName = draft.customer_name || 'Unknown Customer';
    const pickup = draft.pickup_address;
    const dropoff = draft.dropoff_address;
    const items = draft.items || [];

    return (
        <>
            <Card className="group hover:shadow-lg transition-all duration-200 border-muted-foreground/10 overflow-hidden flex flex-col h-full">
                {/* Header */}
                <div className="p-4 pb-3 flex items-start justify-between bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl shadow-sm ${draft.source === 'whatsapp' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                            <SourceIcon className="h-4 w-4" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm leading-tight text-foreground/90">
                                {customerName}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">
                                {formatDistanceToNow(new Date(draft.created_at), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline" className={`${confidenceColor} font-semibold border px-2 py-0.5 text-[10px] uppercase tracking-wide`}>
                        {Math.round(draft.confidence_score * 100)}% Match
                    </Badge>
                </div>

                <Separator className="opacity-50" />

                {/* Content */}
                <CardContent className="p-4 space-y-4 flex-1">
                    {/* Locations */}
                    {/* Locations */}
                    <div className="flex gap-3">
                        {/* Timeline Line */}
                        <div className="flex flex-col items-center pt-1.5 pb-1.5">
                            <div className="h-2.5 w-2.5 rounded-full border-2 border-primary bg-background shrink-0 z-10" />
                            <div className="w-[2px] flex-1 bg-gradient-to-b from-muted-foreground/20 to-muted-foreground/10 my-0.5" />
                            <div className="h-2.5 w-2.5 rounded-full border-2 border-foreground bg-foreground shrink-0 z-10" />
                        </div>

                        {/* Addresses */}
                        <div className="flex flex-col gap-5 flex-1 min-w-0">
                            <div className="space-y-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Pickup</span>
                                <p className="text-sm font-medium leading-snug line-clamp-2 break-words" title={pickup}>
                                    {pickup || <span className="text-destructive/80 italic">Required</span>}
                                </p>
                            </div>

                            <div className="space-y-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Dropoff</span>
                                <p className="text-sm font-medium leading-snug line-clamp-2 break-words" title={dropoff}>
                                    {dropoff || <span className="text-destructive/80 italic">Required</span>}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Items Summary */}
                    {items.length > 0 && (
                        <div className="bg-primary/5 rounded-lg p-3 flex items-start gap-3 mt-2">
                            <Package className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <div className="text-xs text-foreground/80 leading-relaxed">
                                {items.map((item, i) => (
                                    <span key={i}>
                                        <span className="font-semibold text-primary">{item.quantity}x</span> {item.name}
                                        {i < items.length - 1 && ", "}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>

                {/* Footer */}
                <div className="p-3 pt-0 mt-auto">
                    <Button
                        className="w-full justify-between"
                        onClick={() => setReviewOpen(true)}
                    >
                        <span className="font-medium">Review Order</span>
                        <ArrowRight className="h-4 w-4 opacity-50 transition-opacity" />
                    </Button>
                </div>
            </Card>

            <ReviewDialog
                draft={draft}
                open={reviewOpen}
                onOpenChange={setReviewOpen}
            />
        </>
    );
}
