import { verifySession } from '@/lib/auth';
import { query } from '@/lib/db';
import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { jobDescription, formatId } = await request.json();

    if (!jobDescription?.trim()) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }
    if (!formatId) {
      return NextResponse.json({ error: 'Format ID is required' }, { status: 400 });
    }

    // 1. Get the cv format (sections + ai_prompt)
    const formatResult = await query(
      `SELECT title, sections, ai_prompt FROM cvformats WHERE id = $1 LIMIT 1`,
      [formatId]
    );
    if (formatResult.rows.length === 0) {
      return NextResponse.json({ error: 'CV format not found' }, { status: 404 });
    }
    const format = formatResult.rows[0];
    const sections: string[] = format.sections ?? [];
    const aiPrompt: string = format.ai_prompt ?? '';

    // 2. Fetch user profile
    const profileResult = await query(
      `SELECT p.first_name, p.last_name, p.email, p.phone_number, p.person_location,
              p.linkedin_url, p.personal_website, c.cv_id, c.about_me
       FROM profile p
       LEFT JOIN cv c ON c.profile_id = p.profile_id
       WHERE p.user_id = $1
       LIMIT 1`,
      [session.userId]
    );
    if (profileResult.rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    const profile = profileResult.rows[0];
    const cvId = profile.cv_id;

    // 3. Conditionally fetch each section based on the format's sections array
    const sectionLower = sections.map((s: string) => s.toLowerCase());

    const needsExperience = sectionLower.some(s => s.includes('experience') || s.includes('work'));
    const needsEducation = sectionLower.some(s => s.includes('education') || s.includes('academic'));
    const needsProjects = sectionLower.some(s => s.includes('project'));
    const needsCerts = sectionLower.some(s => s.includes('cert') || s.includes('qualification'));
    const needsSkills = sectionLower.some(s => s.includes('skill'));

    const [expRows, eduRows, projRows, certRows, skillRows] = await Promise.all([
      needsExperience && cvId
        ? query(`SELECT title, summary, description, key_skills, start_date, end_date, location FROM experience WHERE cv_id = $1 ORDER BY start_date DESC`, [cvId])
        : Promise.resolve({ rows: [] }),
      needsEducation && cvId
        ? query(`SELECT institute_name, achieved, target, grade_description, start_date, end_date, location FROM education WHERE cv_id = $1 ORDER BY start_date DESC`, [cvId])
        : Promise.resolve({ rows: [] }),
      needsProjects && cvId
        ? query(`SELECT title, summary, description, skills, link, start_date, end_date FROM project WHERE cv_id = $1 ORDER BY start_date DESC`, [cvId])
        : Promise.resolve({ rows: [] }),
      needsCerts && cvId
        ? query(`SELECT title, institute, summary, skills, issue_date, expiry_date FROM certification WHERE cv_id = $1 ORDER BY issue_date DESC`, [cvId])
        : Promise.resolve({ rows: [] }),
      needsSkills && cvId
        ? query(`SELECT name, skill_level, is_soft_skill FROM skill WHERE cv_id = $1 ORDER BY name`, [cvId])
        : Promise.resolve({ rows: [] }),
    ]);

    // 4. Build profile context string
    const lines: string[] = [];

    lines.push(`=== CANDIDATE PROFILE ===`);
    lines.push(`Name: ${profile.first_name} ${profile.last_name}`);
    if (profile.person_location) lines.push(`Location: ${profile.person_location}`);
    if (profile.linkedin_url) lines.push(`LinkedIn: ${profile.linkedin_url}`);
    if (profile.about_me) lines.push(`\nAbout Me:\n${profile.about_me}`);

    if (expRows.rows.length > 0) {
      lines.push(`\n=== WORK EXPERIENCE ===`);
      expRows.rows.forEach((e: Record<string, string>) => {
        lines.push(`- ${e.title}${e.start_date ? ` (${e.start_date} – ${e.end_date ?? 'Present'})` : ''}`);
        if (e.summary) lines.push(`  Summary: ${e.summary}`);
        if (e.description) lines.push(`  Description: ${e.description}`);
        if (e.key_skills) lines.push(`  Skills: ${e.key_skills}`);
      });
    }

    if (eduRows.rows.length > 0) {
      lines.push(`\n=== EDUCATION ===`);
      eduRows.rows.forEach((e: Record<string, string>) => {
        lines.push(`- ${e.achieved ?? e.target} at ${e.institute_name}${e.start_date ? ` (${e.start_date} – ${e.end_date ?? 'Present'})` : ''}`);
        if (e.grade_description) lines.push(`  Grade: ${e.grade_description}`);
      });
    }

    if (projRows.rows.length > 0) {
      lines.push(`\n=== PROJECTS ===`);
      projRows.rows.forEach((p: Record<string, string>) => {
        lines.push(`- ${p.title}`);
        if (p.summary) lines.push(`  Summary: ${p.summary}`);
        if (p.skills) lines.push(`  Skills: ${p.skills}`);
        if (p.link) lines.push(`  Link: ${p.link}`);
      });
    }

    if (certRows.rows.length > 0) {
      lines.push(`\n=== CERTIFICATIONS ===`);
      certRows.rows.forEach((c: Record<string, string>) => {
        lines.push(`- ${c.title} from ${c.institute}${c.issue_date ? ` (${c.issue_date})` : ''}`);
        if (c.skills) lines.push(`  Skills: ${c.skills}`);
      });
    }

    if (skillRows.rows.length > 0) {
      lines.push(`\n=== SKILLS ===`);
      const technical = skillRows.rows.filter((s: Record<string, unknown>) => !s.is_soft_skill).map((s: Record<string, string>) => `${s.name}${s.skill_level ? ` (${s.skill_level})` : ''}`);
      const soft = skillRows.rows.filter((s: Record<string, unknown>) => s.is_soft_skill).map((s: Record<string, string>) => s.name);
      if (technical.length > 0) lines.push(`Technical: ${technical.join(', ')}`);
      if (soft.length > 0) lines.push(`Soft Skills: ${soft.join(', ')}`);
    }

    const profileContext = lines.join('\n');

    // 5. Build the full prompt for Gemini
    const fullPrompt = `${aiPrompt}

${profileContext}

=== JOB DESCRIPTION ===
${jobDescription}

=== INSTRUCTIONS ===
Based on the candidate profile and job description above, provide structured feedback in the following JSON format only (no markdown, no explanation outside the JSON):
{
  "overallScore": <number 0-100>,
  "matchSummary": "<2-3 sentence summary of how well the candidate matches this role>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "atsScore": <number 0-100>,
  "atsTip": "<one sentence ATS tip>",
  "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
  "industryTips": ["<tip 1>", "<tip 2>"]
}`;

    // 6. Call Groq
    const { text: rawText } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: fullPrompt,
      temperature: 0.4,
      maxTokens: 1024,
    });

    // Strip any markdown code fences the model may add
    const jsonText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let feedback;
    try {
      feedback = JSON.parse(jsonText);
    } catch {
      console.error('[ai/feedback] Failed to parse Groq response:', rawText);
      return NextResponse.json({ error: 'Could not parse AI response. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ feedback }, { status: 200 });

  } catch (error) {
    console.error('[ai/feedback] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
