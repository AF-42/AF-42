import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';

export default withAuth(
	async function middleware(req: any) {
		// Add any custom middleware logic here
		// console.log('look at me', req.kindeAuth);
	},
	{
		publicPaths: ['/home', '/dashboard', '/login'],
		// Add proper error handling
		onError: (error: Error) => {
			console.error('Middleware error:', error);
		},
	},
);

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder files
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
};
