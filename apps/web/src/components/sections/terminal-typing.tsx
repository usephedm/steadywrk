"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

const LINES = [
	{ text: "// steadywrk dispatch protocol", color: "text-dark-600", delay: 0 },
	{ text: 'agents: ["claude-opus", "codex-gpt5", "gemini-ultra"]', color: "", delay: 800 },
	{ text: 'mcps: ["dispatch-oracle", "hawkeye", "leadforge"]', color: "", delay: 1600 },
	{ text: "matching: h3-geo + reputation + margin-calc", color: "", delay: 2400 },
	{ text: "status: operational ✓", color: "", delay: 3200 },
];

function colorize(text: string) {
	return text
		.replace(/(agents|mcps|matching|status)/g, '<span class="text-amber">$1</span>')
		.replace(/(".*?")/g, '<span class="text-green-400">$1</span>')
		.replace(/(\[|\]|:|,|\+)/g, '<span class="text-dark-700">$1</span>')
		.replace(/(h3-geo|reputation|margin-calc)/g, '<span class="text-purple-400">$1</span>')
		.replace(/(operational)/g, '<span class="text-green-400 animate-pulse">$1</span>')
		.replace(/(\/\/.*)/g, '<span class="text-dark-600">$1</span>')
		.replace(/(✓)/g, '<span class="text-dark-600">$1</span>');
}

export function TerminalTyping() {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
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
		<div
			ref={ref}
			className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-dark-300 bg-dark-200"
		>
			<div className="flex items-center gap-2 border-b border-dark-300 px-4 py-3">
				<span className="h-3 w-3 rounded-full bg-red-500/60" />
				<span className="h-3 w-3 rounded-full bg-yellow-500/60" />
				<span className="h-3 w-3 rounded-full bg-green-500/60" />
				<span className="ml-2 text-xs text-dark-600 font-mono">dispatch-protocol.ts</span>
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
	);
}
