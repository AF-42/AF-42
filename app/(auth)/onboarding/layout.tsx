import { NextStepProvider, NextStep } from 'nextstepjs';
import { steps } from './steps';

export default function OnboardingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<NextStepProvider>
			<NextStep steps={steps}>{children}</NextStep>
		</NextStepProvider>
	);
}
