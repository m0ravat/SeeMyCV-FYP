import { verifySession } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  ExternalHyperlink,
  LevelFormat,
  TabStopType,
  convertInchesToTwip,
} from 'docx';

// ── helpers ──────────────────────────────────────────────────────────────────

const FONT = 'Arial';
const pt = (n: number) => n * 2; // half-points used by docx for font size
// A4 width (8.27") minus left (0.9") and right (0.9") margins = 6.47" text width
const TEXT_WIDTH = convertInchesToTwip(6.47);
const RIGHT_TAB = [{ type: TabStopType.RIGHT, position: TEXT_WIDTH }];

/** Bold centred paragraph — black text, white background */
function centeredBoldWhite(text: string, size = pt(16)): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 0 },
    children: [new TextRun({ text, bold: true, size, color: '000000', font: FONT })],
  });
}

/** Centred contact line — black text, white background */
function centeredContactWhite(children: (TextRun | ExternalHyperlink)[]): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 160 },
    children,
  });
}

/** Section heading with a bottom border (mimics HR beneath the heading) */
function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    // Don't use HeadingLevel — it inherits theme colour (blue) from Word styles
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 4 },
    },
    spacing: { before: 240, after: 80 },
    children: [new TextRun({ text, bold: true, size: pt(12), font: FONT, color: '000000' })],
  });
}

/** Bullet point — splits text on newlines into separate bullets */
function bullets(lines: string[]): Paragraph[] {
  return lines
    .map(l => l.trim())
    .filter(Boolean)
    .map(
      line =>
        new Paragraph({
          bullet: { level: 0 },
          indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.25) },
          children: [new TextRun({ text: line, size: pt(11), font: FONT })],
        }),
    );
}

/** Bold entry header e.g. "Company – Role, Date Range" */
function entryHeader(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 120, after: 40 },
    children: [new TextRun({ text, bold: true, size: pt(11), font: FONT })],
  });
}

/** Plain paragraph */
function plain(text: string, size = pt(11)): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size, font: FONT })],
    spacing: { after: 40 },
  });
}

/** Hyperlink paragraph with label prefix */
function linkLine(label: string, url: string): Paragraph {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    children: [
      new TextRun({ text: `${label} `, bold: true, size: pt(11), font: FONT }),
      new ExternalHyperlink({
        link: url,
        children: [
          new TextRun({ text: url, style: 'Hyperlink', size: pt(11), font: FONT }),
        ],
      }),
    ],
  });
}

/** Format a DB date string → "Month YYYY" or raw */
function fmtDate(d: string | null | undefined): string {
  if (!d) return 'Present';
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

// ── route ────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { formatId } = await request.json();
    if (!formatId) {
      return NextResponse.json({ error: 'formatId is required' }, { status: 400 });
    }

    // 1. Fetch format sections
    const fmtResult = await query(
      `SELECT title, sections FROM cvformats WHERE id = $1 LIMIT 1`,
      [formatId],
    );
    if (fmtResult.rows.length === 0) {
      return NextResponse.json({ error: 'CV format not found' }, { status: 404 });
    }
    const format = fmtResult.rows[0];
    const sections: string[] = format.sections ?? [];
    const sectionLower = sections.map((s: string) => s.toLowerCase());

    const includes = (keyword: string) => sectionLower.some(s => s.includes(keyword));

    // 2. Fetch user profile + cv header
    const profileResult = await query(
      `SELECT p.first_name, p.last_name, p.email, p.phone_number, p.person_location,
              p.linkedin_url, p.personal_website,
              c.cv_id, c.about_me
       FROM profile p
       LEFT JOIN cv c ON c.profile_id = p.profile_id
       WHERE p.user_id = $1
       LIMIT 1`,
      [session.userId],
    );
    if (profileResult.rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    const p = profileResult.rows[0];
    const cvId = p.cv_id;

    // 3. Fetch sections conditionally
    const [expRows, eduRows, projRows, certRows, skillRows] = await Promise.all([
      includes('experience') || includes('work')
        ? query(
            `SELECT title, summary, description, key_skills, start_date, end_date, location
             FROM experience WHERE cv_id = $1 ORDER BY start_date DESC NULLS LAST`,
            [cvId],
          )
        : { rows: [] },
      includes('education') || includes('academic')
        ? query(
            `SELECT institute_name, achieved, target, grade_description, start_date, end_date
             FROM education WHERE cv_id = $1 ORDER BY start_date DESC NULLS LAST`,
            [cvId],
          )
        : { rows: [] },
      includes('project')
        ? query(
            `SELECT title, summary, description, skills, link, start_date, end_date
             FROM project WHERE cv_id = $1 ORDER BY start_date DESC NULLS LAST`,
            [cvId],
          )
        : { rows: [] },
      includes('cert') || includes('qualification')
        ? query(
            `SELECT title, institute, summary, skills, issue_date, expiry_date
             FROM certification WHERE cv_id = $1 ORDER BY issue_date DESC NULLS LAST`,
            [cvId],
          )
        : { rows: [] },
      includes('skill')
        ? query(
            `SELECT name, description, is_soft_skill FROM skill WHERE cv_id = $1 ORDER BY is_soft_skill, name`,
            [cvId],
          )
        : { rows: [] },
    ]);

    // 4. Build docx children array ─────────────────────────────────────────
    const children: (Paragraph | Table)[] = [];

    // ── Header (black background, white text) ──
    children.push(centeredBoldWhite(`${p.first_name} ${p.last_name}`));

    // Contact line: Location | Phone | Email | Website — white text on black
    const contactParts: (TextRun | ExternalHyperlink)[] = [];
    const addPipe = () =>
      contactParts.push(new TextRun({ text: ' | ', size: pt(11), color: '000000', font: FONT }));

    if (p.person_location) contactParts.push(new TextRun({ text: p.person_location, size: pt(11), color: '000000', font: FONT }));
    if (p.phone_number) { addPipe(); contactParts.push(new TextRun({ text: p.phone_number, size: pt(11), color: '000000', font: FONT })); }
    if (p.email) {
      addPipe();
      contactParts.push(
        new ExternalHyperlink({
          link: `mailto:${p.email}`,
          children: [new TextRun({ text: p.email, size: pt(11), color: '000000', font: FONT })],
        }),
      );
    }
    if (p.personal_website) {
      addPipe();
      contactParts.push(
        new ExternalHyperlink({
          link: p.personal_website,
          children: [new TextRun({ text: p.personal_website, size: pt(11), color: '000000', font: FONT })],
        }),
      );
    }
    if (p.linkedin_url) {
      addPipe();
      contactParts.push(
        new ExternalHyperlink({
          link: p.linkedin_url,
          children: [new TextRun({ text: p.linkedin_url, size: pt(11), color: '000000', font: FONT })],
        }),
      );
    }

    children.push(centeredContactWhite(contactParts));

    // ── About Me ──
    if (includes('about') && p.about_me) {
      children.push(sectionHeading('About Me'));
      children.push(plain(p.about_me));
    }

    // ── Skills ──
    if (includes('skill') && skillRows.rows.length > 0) {
      children.push(sectionHeading('Skills'));

      const formatTitleLower = (format.title ?? '').toLowerCase();
      const isGenericOrCustomer =
        formatTitleLower.includes('generic') || formatTitleLower.includes('customer');

      if (isGenericOrCustomer) {
        // Soft skills only — each as a bullet "Skill name - description"
        const softSkills = (skillRows.rows as Record<string, string>[]).filter(
          s => s.is_soft_skill,
        );
        for (const s of softSkills) {
          const line = s.description ? `${s.name} - ${s.description}` : s.name;
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.25) },
              children: [new TextRun({ text: line, size: pt(11), font: FONT, color: '000000' })],
            }),
          );
        }
      } else {
        // Technical formats — soft skills comma list then hard skills comma list
        const soft = (skillRows.rows as Record<string, string>[])
          .filter(s => s.is_soft_skill)
          .map(s => s.name)
          .join(', ');
        const hard = (skillRows.rows as Record<string, string>[])
          .filter(s => !s.is_soft_skill)
          .map(s => s.name)
          .join(', ');
        if (soft)
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Soft Skills - ', bold: true, size: pt(11), font: FONT, color: '000000' }),
                new TextRun({ text: soft, size: pt(11), font: FONT, color: '000000' }),
              ],
              spacing: { after: 40 },
            }),
          );
        if (hard)
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Hard Skills - ', bold: true, size: pt(11), font: FONT, color: '000000' }),
                new TextRun({ text: hard, size: pt(11), font: FONT, color: '000000' }),
              ],
              spacing: { after: 80 },
            }),
          );
      }
    }

    // ── Experience ──
    if ((includes('experience') || includes('work')) && expRows.rows.length > 0) {
      children.push(sectionHeading('Experience'));
      for (const e of expRows.rows as Record<string, string>[]) {
        const dateRange = `${fmtDate(e.start_date)} - ${fmtDate(e.end_date)}`;
        // "Title (Company / Location)          (Date Range)"
        const locationPart = e.location ? ` / ${e.location}` : '';
        const titlePart = `${e.title}${locationPart}`;
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            tabStops: RIGHT_TAB,
            children: [
              new TextRun({ text: titlePart, bold: true, size: pt(11), font: FONT, color: '000000' }),
              new TextRun({ text: `\t(${dateRange})`, size: pt(11), font: FONT, color: '000000' }),
            ],
          }),
        );
        const descLines = (e.description ?? e.summary ?? '').split('\n');
        children.push(...bullets(descLines));
      }
    }

    // ── Projects ──
    if (includes('project') && projRows.rows.length > 0) {
      children.push(sectionHeading('Projects'));
      for (const proj of projRows.rows as Record<string, string>[]) {
        const dateRange = proj.start_date
          ? `${fmtDate(proj.start_date)} - ${fmtDate(proj.end_date)}`
          : null;
        // Title line with optional date right-aligned
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            tabStops: dateRange ? RIGHT_TAB : [],
            children: [
              new TextRun({ text: proj.title, bold: true, size: pt(11), font: FONT, color: '000000' }),
              ...(dateRange ? [new TextRun({ text: `\t(${dateRange})`, size: pt(11), font: FONT, color: '000000' })] : []),
            ],
          }),
        );
        // URL line beneath title
        if (proj.link) {
          children.push(linkLine('Link:', proj.link));
        }
        const descLines = (proj.description ?? proj.summary ?? '').split('\n');
        children.push(...bullets(descLines));
      }
    }

    // ── Education ──
    if ((includes('education') || includes('academic')) && eduRows.rows.length > 0) {
      children.push(sectionHeading('Education'));
      for (const e of eduRows.rows as Record<string, string>[]) {
        const degree = e.achieved ?? e.target ?? '';
        const dates = `${fmtDate(e.start_date)} - ${fmtDate(e.end_date)}`;
        // Line 1: "Institute Name          (Dates)"
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            tabStops: RIGHT_TAB,
            children: [
              new TextRun({ text: e.institute_name ?? '', bold: true, size: pt(11), font: FONT, color: '000000' }),
              new TextRun({ text: `\t(${dates})`, size: pt(11), font: FONT, color: '000000' }),
            ],
          }),
        );
        // Line 2: degree name
        if (degree) {
          children.push(plain(degree));
        }
        // Line 3: expected grade
        if (e.grade_description) {
          children.push(plain(`Expected - ${e.grade_description}`));
        }
      }
    }

    // ── Certifications ──
    if ((includes('cert') || includes('qualification')) && certRows.rows.length > 0) {
      children.push(sectionHeading('Certifications'));
      for (const c of certRows.rows as Record<string, string>[]) {
        // "Title (Institute)          (Date)"
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            tabStops: RIGHT_TAB,
            children: [
              new TextRun({ text: `${c.title} (${c.institute ?? ''})`, bold: true, size: pt(11), font: FONT, color: '000000' }),
              new TextRun({ text: `\t(${fmtDate(c.issue_date)})`, size: pt(11), font: FONT, color: '000000' }),
            ],
          }),
        );
        // URL line if present
        if (c.link) children.push(linkLine('Link:', c.link));
        if (c.summary) children.push(...bullets(c.summary.split('\n')));
      }
    }

    // 5. Build and pack the document
    const doc = new Document({
      numbering: {
        config: [
          {
            reference: 'bullet-list',
            levels: [
              {
                level: 0,
                format: LevelFormat.BULLET,
                text: '\u2022',
                alignment: AlignmentType.LEFT,
              },
            ],
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(0.75),
                bottom: convertInchesToTwip(0.75),
                left: convertInchesToTwip(0.9),
                right: convertInchesToTwip(0.9),
              },
            },
          },
          children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    const safeName = `${p.first_name ?? 'CV'}_${format.title ?? 'CV'}`.replace(/\s+/g, '_');
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${safeName}.docx"`,
      },
    });
  } catch (error) {
    console.error('[cv/generate] Error:', error);
    return NextResponse.json({ error: 'Failed to generate CV. Please try again.' }, { status: 500 });
  }
}
