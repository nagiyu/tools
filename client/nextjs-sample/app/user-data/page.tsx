import styles from "../page.module.css";

import AuthUtil from '@client-common/auth/AuthUtil';

export default async function UserDataPage() {
    return (
        <div className={styles.page}>
            <>
                {JSON.stringify(await AuthUtil.getServerSession())}
            </>
        </div>
    );
}
