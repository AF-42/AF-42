import { AuthProvider } from '../AuthProvider';
import DevLayout from '@/components/layouts/dev-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
	return <AuthProvider>
		<DevLayout>{children}</DevLayout>
	</AuthProvider>;
}
