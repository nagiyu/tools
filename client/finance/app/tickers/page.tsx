import Auth from '@/app/components/Auth';
import TickerTable from '@/app/components/ticker/TickerTable';

export default function TickersPage() {
    return (
        <Auth
            adminContent={
                <TickerTable />
            }
            userContent={
                <div>権限がありません。</div>
            }
        />
    );
}
