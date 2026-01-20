import { Loader2 } from 'lucide-react';

export default function OrdersLoading() {
    return (
        <div className="loading-container">
            <Loader2 className="loading-spinner" />
        </div>
    );
}
