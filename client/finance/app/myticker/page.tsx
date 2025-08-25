import Auth from '@/app/components/Auth';
import MyTickerTable from '@/app/components/myticker/MyTickerTable';

export default function MyTickerPage() {
    return (
        <Auth
            userContent={
                <MyTickerTable />
            }
        />
    )
}
