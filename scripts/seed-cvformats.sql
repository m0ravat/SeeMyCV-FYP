-- Seed cvformats table with the six CV templates from the CV builder page
-- Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING (requires unique title)

INSERT INTO cvformats (title, "desc", job_desc, sections, ai_prompt, "isPremium")
VALUES

  (
    'Entry Level / Generic',
    'Perfect for graduates and those new to the workforce',
    'Ideal for candidates with limited work experience who want to showcase their education, transferable skills, and any internships or volunteering.',
    ARRAY['contact', 'summary', 'education', 'skills', 'experience', 'projects'],
    'Generate a clean, concise CV summary for an entry-level candidate. Emphasise academic achievements, transferable skills, and any relevant projects or volunteer work. Keep it professional and no longer than 3 sentences.',
    false
  ),

  (
    'Customer Service',
    'Skills-based CV highlighting soft skills and achievements',
    'Suited for roles in retail, hospitality, call centres, or any customer-facing position. Emphasises communication, conflict resolution, and measurable service achievements.',
    ARRAY['contact', 'summary', 'skills', 'experience', 'education'],
    'Generate a CV summary for a customer service professional. Highlight communication skills, empathy, problem-solving ability, and measurable achievements such as customer satisfaction scores or upsell rates. Keep it under 3 sentences.',
    false
  ),

  (
    'Tech / IT',
    'Technical CV with project showcase and tech stack',
    'Designed for software developers, IT engineers, and technology professionals. Highlights technical skills, programming languages, projects, and GitHub portfolio.',
    ARRAY['contact', 'summary', 'skills', 'projects', 'experience', 'education'],
    'Generate a CV summary for a tech or IT professional. Mention key programming languages, frameworks, and notable projects or systems built. Keep it concise, specific, and under 3 sentences.',
    false
  ),

  (
    'Teaching / Education',
    'Educator-focused CV with certifications and methodologies',
    'Best for teachers, lecturers, and educational professionals. Focuses on qualifications, teaching philosophy, subject specialisms, and measurable student outcomes.',
    ARRAY['contact', 'summary', 'education', 'experience', 'skills'],
    'Generate a CV summary for a teaching or education professional. Highlight subject expertise, teaching methodologies, relevant qualifications, and any measurable impact on student performance. Keep it warm, professional, and under 3 sentences.',
    false
  ),

  (
    'Entry Level Software Engineer',
    'Premium format designed for new software engineers entering the field',
    'A premium template tailored for junior and graduate software engineers. Showcases programming skills, technical projects, and GitHub portfolio with a modern layout.',
    ARRAY['contact', 'summary', 'skills', 'projects', 'education', 'experience'],
    'Generate a CV summary for an entry-level software engineer. Focus on programming languages known, academic or personal projects built, and eagerness to contribute to a team. Keep it technical yet approachable, under 3 sentences.',
    true
  ),

  (
    'Software Engineer Apprenticeship',
    'Premium format tailored for apprenticeship programs and early-career roles',
    'A premium template for candidates applying to software engineering apprenticeships. Highlights learning progress, mentorship experience, and hands-on technical contributions.',
    ARRAY['contact', 'summary', 'education', 'skills', 'experience', 'projects'],
    'Generate a CV summary for a software engineering apprenticeship candidate. Emphasise willingness to learn, any hands-on technical experience, and relevant coursework or self-taught skills. Keep it enthusiastic, professional, and under 3 sentences.',
    true
  );
