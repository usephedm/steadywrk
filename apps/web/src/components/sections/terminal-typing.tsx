"use client";

import { useScrollInView } from "@steadywrk/ui";
import { useEffect, useRef, useState } from "react";

const LINES = [
	{ text: "// steadywrk bootcamp — week 1", color: "text-dark-600", delay: 0 },
	{ text: 'tools: ["claude", "chatgpt", "cursor", "v0", "midjourney"]', color: "", delay: 800 },
	{ text: 'skills: ["prompt-eng", "ai-ops", "ai-coding", "content"]', color: "", delay: 1600 },
	{ text: "experience_required: none", color: "", delay: 2400 },
	{ text: "status: accepting_applications ✓", color: "", delay: 3200 },
];

function colorize(text: string) {
	return text
		.replace(/(tools|skills|experience_required|status)/g, '<span class="text-amber">$1</span>')
		.replace(/(".*?")/g, '<span class="text-green-400">$1</span>')
		.replace(/(\[|\]|:|,|\+)/g, '<span class="text-dark-700">$1</span>')
		.replace(/(prompt-eng|ai-ops|ai-coding|content)/g, '<span class="text-purple-400">$1</span>')
		.replace(/(accepting_applications)/g, '<span class="text-green-400 animate-pulse">$1</span>')
		.replace(/(\/\/.*)/g, '<span class="text-dark-600">$1</span>')
		.replace(/(none)/g, '<span class="text-amber-400 font-bold">$1</span>')
		.replace(/(✓)/g, '<span class="text-dark-600">$1</span>');
}

export function TerminalTyping() {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useScrollInView(ref, { once: true });
	const [visibleChars, setVisibleChars] = useState<number[]>(LINES.map(() => 0));
	const [activeLine, setActiveLine] = useState(-1);

	useEffect(() => {
		if (!isInView) return;

		const timers: ReturnType<typeof setTimeout>[] = [];

		LINES.forEach((line, lineIdx) => {
			timers.push(
				setTimeout(() => {
					setActiveLine(lineIdx);
					let charIdx = 0;
					const interval = setInterval(
						() => {
							charIdx++;
							setVisibleChars((prev) => {
								const next = [...prev];
								next[lineIdx] = charIdx;
								return next;
							});
							if (charIdx >= line.text.length) clearInterval(interval);
						},
						20 + Math.random() * 30,
					);
					timers.push(interval as unknown as ReturnType<typeof setTimeout>);
				}, line.delay),
			);
		});

		return () => timers.forEach(clearTimeout);
	}, [isInView]);

	return (
		<section className="border-t border-dark-300/50 py-16 md:py-20">
			<div
				ref={ref}
				className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-dark-300 bg-dark-200 shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.03)]"
			>
				<div className="flex items-center gap-2 border-b border-dark-300 px-4 py-3">
					<span className="h-3 w-3 rounded-full bg-red-500/60" />
					<span className="h-3 w-3 rounded-full bg-yellow-500/60" />
					<span className="h-3 w-3 rounded-full bg-green-500/60" />
					<span className="ml-2 text-xs text-dark-600 font-mono">bootcamp-config.ts</span>
				</div>
				<div className="p-6 font-mono text-sm leading-loose min-h-[180px]">
					{LINES.map((line, i) => {
						const shown = line.text.slice(0, visibleChars[i]);
						if (visibleChars[i] === 0 && activeLine < i) return null;
						return (
							// biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list
							<div key={i}>
								{/* biome-ignore lint/security/noDangerouslySetInnerHtml: controlled syntax highlighting */}
								<span dangerouslySetInnerHTML={{ __html: colorize(shown) }} />
								{activeLine === i && (visibleChars[i] ?? 0) < line.text.length && (
									<span
										className="inline-block w-2 h-4 bg-amber ml-0.5 align-middle"
										style={{ animation: "blink-cursor 0.8s step-end infinite" }}
									/>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
