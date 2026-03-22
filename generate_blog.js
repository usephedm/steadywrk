const fs = require('fs');

const content = `# How STEADYWRK Hires: A Transparent 7-Stage Process

If you've spent any time in the tech industry, you've probably experienced the pain of a broken hiring process. You know the drill: submitting a resume into the black hole of an Applicant Tracking System (ATS), taking an automated algorithmic test that has nothing to do with the actual job, enduring seven rounds of repetitive behavioral questions, and then—ghosting. Or worse, getting a generic rejection email three months later. 

At STEADYWRK LLC, we decided early on that if we were going to build a generational company, we needed to build a hiring process that reflects our core values. We are engineers, designers, and builders. We respect the craft, and just as importantly, we respect the time of the people who apply to work with us. 

We don't believe in trick questions. We don't care if you can invert a binary tree on a whiteboard while three people stare at you. We care about whether you can write clean, maintainable code, communicate effectively, and build systems that solve real problems for our users. We care about your pragmatism, your product sense, and your ability to collaborate in a peer-to-peer environment.

That's why we’ve designed a rigorous but fundamentally fair 7-stage hiring process. It is transparent by design. We want you to know exactly what to expect, how to prepare, and what we are looking for at every step of the journey. We aren't trying to catch you off guard; we are trying to find the best version of you.

Here is exactly how STEADYWRK hires, stage by stage.

---

## Stage 1: The Initial Application (No Cover Letters Required)

The first step is straightforward. You apply. But unlike most companies, we don't ask for a cover letter, and we don't use AI to screen your resume for arbitrary keywords.

### What Happens
You submit your application through our portal. We ask for your resume, a link to your GitHub profile, your portfolio, or any live projects you’ve built. We also ask one or two brief, highly specific questions related to the role (e.g., "Tell us about a time you had to optimize a slow database query"). 

Our engineering and design leaders review these applications manually. Yes, human beings read your application. 

### What We Look For
We are looking for evidence of impact and a passion for the craft. A pristine, ivy-league education is nice, but we are far more impressed by a messy, real-world side project that you shipped to actual users. We look at the code you’ve open-sourced. We look at the technical decisions you’ve made in your previous roles. 

- **Good Signal:** Clear descriptions of what *you* specifically built, not just what your team did. Links to live apps or public repos.
- **Red Flag:** Buzzword bingo. Resumes that list 45 different languages and frameworks but show no depth in any of them.

### Advice for Candidates
Keep your resume concise and focused on outcomes. If you sped up a build process, tell us by what percentage. If you designed an architecture, explain the constraints. Let your work speak for itself.

---

## Stage 2: The Async Work Sample (Paid & Real-World)

If your application stands out, we move to Stage 2. This is where we part ways with the traditional tech industry playbook. We don’t do automated LeetCode tests. Instead, we give you an asynchronous work sample. And because we respect your time, we pay you for it.

### What Happens
We send you a prompt based on the actual day-to-day work you would be doing at STEADYWRK. If you are a frontend engineer, we might ask you to build a small React component that interacts with an API and handles loading/error states. If you are a backend engineer, we might ask you to design a small API schema and write the endpoint logic using TypeScript and Drizzle ORM.

You are given a realistic timeframe to complete this (usually over a weekend, or a 48-hour window of your choosing). We compensate you at a fair hourly rate for the expected time it takes to complete the challenge.

### What We Look For
We want to see how you write code in your own environment, without the pressure of someone watching you type. We look for clean architecture, sensible variable naming, proper error handling, and a pragmatic approach to the problem. 

- **Good Signal:** Code that is easy to read, well-documented, and handles edge cases gracefully. A brief README explaining your technical choices and trade-offs.
- **Red Flag:** Over-engineering. Building a microservices architecture for a simple CRUD task. Ignoring instructions or failing to handle basic error states.

### Advice for Candidates
Treat this like a PR you are submitting to a senior engineer on your first week. Write tests if appropriate. Leave comments explaining *why* you did something, not just *what* it does. If you run out of time, document what you would have done next.

---

## Stage 3: The Technical Deep Dive (Synchronous)

Once you submit your work sample, our engineering team reviews it. If it meets our bar, we schedule the first synchronous interview: The Technical Deep Dive.

### What Happens
This is a 45-minute video call with one or two engineers from the team. We don't ask you new coding questions; instead, we open up the code you wrote in Stage 2 and talk about it.

We will ask you to walk us through your solution. We will ask why you chose a specific library, how your code would handle a massive spike in traffic, or how you might refactor a certain function to be more efficient.

### What We Look For
This stage is about technical communication and intellectual honesty. We want to see how you defend your technical decisions and how you respond to feedback. We aren't looking for people who think their code is perfect; we are looking for people who can objectively analyze their own work.

- **Good Signal:** "I chose approach A because of X constraint. If we had more time, I would refactor it to approach B." Receptiveness to alternative ideas.
- **Red Flag:** Getting defensive when a bug is pointed out. Inability to explain how a piece of your own code works (which usually implies copy-pasting without understanding).

### Advice for Candidates
Review your code before the call. Be prepared to talk about the trade-offs you made. If you realize you made a mistake after submitting it, bring it up! Saying "I was looking at this yesterday and realized I missed a critical edge case" shows incredible maturity.

---

## Stage 4: The Collaboration Session (Pair Programming)

Coding is rarely a solo endeavor. At STEADYWRK, we work highly collaboratively. Stage 4 is designed to simulate what it’s actually like to work with us on a daily basis.

### What Happens
In this 60-minute session, you will pair program with one of our engineers. We don't use contrived algorithm puzzles. We usually pull a real, scoped issue from our actual backlog or work on a realistic feature expansion together.

You can use your own IDE, your own terminal, and Google. You drive the keyboard, and our engineer acts as your co-pilot. You will debug, write code, and bounce ideas off each other.

### What We Look For
We are testing for collaboration, not syntax memorization. Can you communicate your thought process as you work? Can you take a vague requirement and break it down into actionable steps? How do you unblock yourself when you get stuck?

- **Good Signal:** Thinking out loud. Asking clarifying questions before writing code. Saying "I don't know the exact syntax for this, let me look it up in the docs."
- **Red Flag:** Working in total silence for 20 minutes. Refusing to listen to hints or suggestions from your pair. Frustration when things don't compile on the first try.

### Advice for Candidates
Treat the interviewer like a teammate. If you are stuck, say so. Talk through your logic: "I think the issue is happening in the data fetching layer, so I'm going to add a console log here to verify the payload." We want to see your debugging process, not just the final result.

---

## Stage 5: System Design & Architecture 

If you've made it this far, we know you can write good cod
