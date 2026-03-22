export const PROGRAMS = [
  {
    name: 'IGNITE',
    slug: 'ignite',
    type: 'Internship',
    duration: '3 months',
    desc: 'Ship production work from week one. Real AI projects, real deadlines, real mentorship.',
    longDesc:
      'IGNITE is our internship program for ambitious students and recent graduates. You\u2019ll be embedded in a real team, working on production systems that serve US clients. No coffee runs. No busywork. You ship code, run campaigns, or manage operations from day one.',
    outcomes: [
      'Production-deployed projects for your portfolio',
      'Mentorship from senior engineers and leaders',
      'Potential conversion to full-time ORBIT fellowship',
      'Network of peers in Jordan\u2019s AI ecosystem',
    ],
  },
  {
    name: 'ORBIT',
    slug: 'orbit',
    type: 'Fellowship',
    duration: '6 months',
    desc: 'Lead projects. Mentor juniors. Build the systems that power our operations.',
    longDesc:
      'ORBIT is a fellowship for early-career professionals ready to accelerate. You\u2019ll lead projects, mentor IGNITE interns, and build systems across our four verticals. This is the bridge between individual contributor and team lead.',
    outcomes: [
      'Project leadership experience across verticals',
      'Mentorship skills and team management exposure',
      'Clear path to APEX leadership track',
      'Shipped work serving Fortune 500 clients',
    ],
  },
  {
    name: 'APEX',
    slug: 'apex',
    type: 'Leadership',
    duration: '12 months',
    desc: 'Architect solutions. Drive teams. Shape the company\u2019s technical direction.',
    longDesc:
      'APEX is our leadership accelerator for experienced professionals. You\u2019ll architect solutions, drive cross-functional teams, and shape STEADYWRK\u2019s technical direction. This track produces the leaders who scale the company.',
    outcomes: [
      'C-suite and board exposure',
      'Cross-functional leadership experience',
      'Equity participation opportunity',
      'Industry recognition and speaking opportunities',
    ],
  },
] as const;
